package service

import (
	"backend/internal/chain_sn"
	"backend/internal/database"
	"backend/internal/invoker_sn"
	"math/big"
	"strconv"
	"strings"
	"time"

	"backend/internal/model"
	"fmt"

	"github.com/shopspring/decimal"
)

func UpdateNekoSpiritByTransfer(from string, to string, tokenId uint64) {

	fmt.Println("UpdateNekoSpiritByTransfer: ", from, to, tokenId)

	if from == "0x0" {

		// mint

		toSave, err := invoker_sn.ReadNekoSpiritInfo(tokenId, true)
		if err != nil {
			fmt.Println("ReadNekoSpiritInfo error: ", err)
			return
		}

		toSave.TokenId = tokenId
		toSave.StakeFromUid = database.GetAddressDetailByAddress(to).Uid
		toSave.StakeTime = time.Now()
		toSave.Epoch = database.GetEpoch()
		if err := database.CreateNekoSpiritInfo(&toSave); err != nil {
			fmt.Println("CreateNekoSpiritInfo error: ", err)
			return
		}
		fmt.Println("CreateNekoSpiritInfo: ", toSave)

		// starter pack
		// TODO process starter pack
		// if toSave.Fade.Equal(decimal.New(125, 0)) {
		// 	fmt.Println("This spirit is a starter pack")
		// 	database.UpdateAddressStarter(detail.Uid)
		// 	return
		// }

		// add 30% of mint cost into MINT reward pool
		database.AddRewardsPool(decimal.New(int64(7500), 18), decimal.NewFromInt(0))

	} else {

		// stake

		toUpdate, err := database.GetNekoSpiritInfoByTokenId(tokenId)
		// fmt.Println("GetNekoSpiritInfoByTokenId : ", tokenId, toUpdate)
		if err != nil {
			fmt.Println("GetNekoSpiritInfoByTokenId error: ", err)
			return
		}

		attr := make(map[string]interface{})

		// fmt.Println("to:", to)
		// fmt.Println("chain_sn.HostAddress:", chain_sn.HostAddress)
		if strings.EqualFold(to[len(to)-63:], chain_sn.HostAddress[len(chain_sn.HostAddress)-63:]) {
			// fmt.Println("to == chain_sn.HostAddress")
			attr["is_staked"] = true
			attr["stake_time"] = time.Now()
		} else {
			attr["is_staked"] = false
		}

		_ = database.UpdateNekoSpiritInfoWithStakeStatus(toUpdate, attr)

	}

}

func UpdateNekoSpiritByUpgrade(tokenId uint64, nekocoin uint64) {

	// TODO game reward pool update

	fmt.Println("UpdateNekoSpiritFromChain: ", tokenId)

	info, err := invoker_sn.ReadNekoSpiritInfo(tokenId, false)
	fmt.Println("ReadNekoSpiritInfo : ", tokenId, info)
	if err != nil {
		fmt.Println("ReadNekoSpiritInfo error: ", err)
		return
	}

	origin, err := database.GetNekoSpiritInfoByTokenId(tokenId)
	if err != nil {
		fmt.Println("GetNekoSpiritInfoByTokenId error: ", err)
		return
	}

	if err := database.UpdateNekoSpiritInfo(&database.ServerNekoSpiritInfo{
		Model:   database.Model{ID: origin.ID},
		TokenId: info.TokenId,
		ATK:     info.ATK,
		Level:   info.Level,
	}); err != nil {
		fmt.Println("UpdateNekoSpiritInfo error: ", err)
		return
	}

	// add 30% of upgrade cost into MINT reward pool
	database.AddRewardsPool(decimal.NewFromUint64(nekocoin).Mul(decimal.New(3, -1)), decimal.NewFromInt(0))

	database.Cache.Delete(database.CacheTagNekoSpirit + strconv.Itoa(int(tokenId)))

}

func SummonBox(address string, count uint64) (hash string, code model.ResponseCode, message string) {

	hash, err := invoker_sn.Summon(address, big.NewInt(int64(count)))
	if err != nil {
		fmt.Println("SummonBox error: ", err)
		return "", model.ServerInternalError, err.Error()
	}

	// record
	database.AddTreasureRevenue(address, count, hash)

	return hash, model.Success, "Summon success"

}
