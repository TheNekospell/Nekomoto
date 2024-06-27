package service

import (
	"backend/internal/database"
	// "backend/internal/invoker"
	"backend/internal/model"
	"math/rand"
	"time"

	"github.com/shopspring/decimal"
)

func generateRandomNumber(min, max uint64) uint64 {
	rand.NewSource(time.Now().UnixNano())
	return rand.Uint64()%(max-min) + min
}

// func shakeIt() {}

func OpenChest(req model.AddressAndSignature) (code model.ResponseCode, message string) {

	chest := database.QueryNotOpenedChest(database.GetAddressDetailByAddress(req.Address).Uid)
	if chest.ID == 0 {
		return model.NotFound, "chest not found"
	}

	random := generateRandomNumber(0, 10000)
	config := database.GetChestConfig()

	for _, v := range config {
		if v.ChestType == chest.ChestType && decimal.NewFromUint64(random).LessThan(v.Chance.Mul(decimal.NewFromUint64(10000))) {
			chest.IsOpen = 1
			chest.Token1Amount = v.Token1Amount
			chest.Token2Amount = v.Token2Amount
			chest.NFTAmount = v.NFTAmount
			break
		}
	}

	// token1, err := big.NewInt(0).SetString(chest.Token1Amount.StringFixed(0), 10)
	// if !err {
	// 	return model.ServerInternalError, "server internal error"
	// }
	// token2, err := big.NewInt(0).SetString(chest.Token2Amount.StringFixed(0), 10)
	// if !err {
	// 	return model.ServerInternalError, "server internal error"
	// }
	// pow := new(big.Int).Exp(big.NewInt(10), big.NewInt(18), nil)
	// if err := invoke.SendChestReward(common.HexToAddress(req.Address), new(big.Int).Mul(token1, pow), new(big.Int).Mul(token2, pow), big.NewInt(int64(chest.NFTAmount))); err != nil {
	// 	return model.ServerInternalError, "server internal error"
	// }

	database.UpdateChest(&chest)

	return model.Success, "Open success"
}

func EmpowerChest(req model.TwoAddressAndSignature) (code model.ResponseCode, message string) {

	chest := database.QueryNotOpenedChest(database.GetAddressDetailByAddress(req.Address2).Uid)
	if chest.ID == 0 {
		return model.NotFound, "chest not found"
	}

	if can := database.CanEmpowerChest(database.GetAddressDetailByAddress(req.Address1).Uid); can {
		record := database.ServerChestEmpowerRecord{
			Uid: database.GetAddressDetailByAddress(req.Address1).Uid,
			Cid: chest.ID,
		}
		database.CreateEmpowerChestRecord(record)
	}

	if count := database.CountEmpower(chest.ID); count >= 5 {
		chest.ChestType = 1
		database.UpdateChest(&chest)
	}

	return model.Success, "Open success"
}

// func OpenStarterChest(req model.AddressAndSignature) (code model.ResponseCode, message string) {

// 	config := database.QueryStarterChestConfig()
// 	if config.Limit <= config.Opened {
// 		return model.ServerInternalError, "Exceeded limit"
// 	}

// 	if err := invoke.SummonStarter(common.HexToAddress(req.Address)); err != nil {
// 		fmt.Println("SummonStarter error: ", err)
// 		return model.ServerInternalError, "Server internal error"
// 	}
// 	database.AddStarterChestOpened()
// 	database.UpdateAddressStarter(req.Address)
// 	return model.Success, "Open success"

// }
