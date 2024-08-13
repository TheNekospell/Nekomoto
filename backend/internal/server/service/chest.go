package service

import (
	"backend/internal/database"
	"backend/internal/invoker_sn"
	"backend/internal/util"
	"fmt"
	"strings"

	// "backend/internal/invoker"
	"backend/internal/model"
	"math/big"
	"math/rand"
	"time"

	"github.com/shopspring/decimal"
)

func generateRandomNumber(min, max uint64) uint64 {
	rand.NewSource(time.Now().UnixNano())
	return rand.Uint64()%(max-min) + min
}

// func shakeIt() {}

func OpenChest(req model.AddressAndSignature) (data database.ServerChest, code model.ResponseCode, message string) {

	chest := database.QueryNotOpenedChest(database.GetAddressDetailByAddress(req.Address).Uid)
	if chest.ID == 0 {
		return database.ServerChest{}, model.NotFound, "chest not found"
	}

	config := database.GetChestConfig()
	count := database.QueryOpenedChest(uint(chest.ChestType))
	if count >= config[0].TotalLimit {
		return database.ServerChest{}, model.ServerInternalError, "Exceed total limit"
	}

	random := generateRandomNumber(0, 10000)

	chance := decimal.NewFromUint64(0)
	for _, v := range config {
		chance = chance.Add(v.Chance)
		if v.ChestType == chest.ChestType && decimal.NewFromUint64(random).LessThan(chance.Mul(decimal.NewFromUint64(10000))) {
			chest.IsOpen = 1
			chest.Token1Amount = v.Token1Amount
			chest.Token2Amount = v.Token2Amount
			chest.NFTAmount = v.NFTAmount
			break
		}
	}

	token1, err := big.NewInt(0).SetString(chest.Token1Amount.StringFixed(0), 10)
	if !err {
		fmt.Println("SetString error: ", err)
		return database.ServerChest{}, model.ServerInternalError, "server internal error"
	}
	token2, err := big.NewInt(0).SetString(chest.Token2Amount.StringFixed(0), 10)
	if !err {
		fmt.Println("SetString error: ", err)
		return database.ServerChest{}, model.ServerInternalError, "server internal error"
	}
	pow := new(big.Int).Exp(big.NewInt(10), big.NewInt(18), nil)
	if err := invoker_sn.SendCoinAndNFT(req.Address, new(big.Int).Mul(token1, pow), new(big.Int).Mul(token2, pow), big.NewInt(int64(chest.NFTAmount))); err != nil {
		fmt.Println("SendCoinAndNFT error: ", err)
		return database.ServerChest{}, model.ServerInternalError, "server internal error"
	}

	database.UpdateChest(&chest)

	return chest, model.Success, "Open success"
}

func EmpowerChest(req model.TwoAddressAndSignature) (code model.ResponseCode, message string) {

	if strings.EqualFold(util.CleanAddress(req.Address1), util.CleanAddress(req.Address2)) {
		return model.WrongParam, "can not empower yourself"
	}

	detail1 := database.GetAddressDetailByAddress(req.Address1)
	detail2 := database.GetAddressDetailByAddress(req.Address2)

	if database.QueryChest(detail1.Uid).ID == 0 {
		return model.NotFound, "you should have chest first"
	}

	chest := database.QueryNotOpenedChest(detail2.Uid)
	if chest.ID == 0 {
		return model.NotFound, "chest not found"
	}

	if can := database.CanEmpowerChest(detail1.Uid); can {
		record := database.ServerChestEmpowerRecord{
			Uid: detail1.Uid,
			Cid: chest.ID,
		}
		database.CreateEmpowerChestRecord(record)
	} else {
		return model.ServerInternalError, "you can only empower once a day"
	}

	if count := database.CountEmpower(chest.ID); count >= 5 {
		chest.ChestType = 1
		database.UpdateChest(&chest)
	}

	return model.Success, "Open success"
}
