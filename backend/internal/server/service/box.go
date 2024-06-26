package service

import (
	// "backend/internal/chain"
	"backend/internal/chain_sn"
	"backend/internal/database"
	"backend/internal/invoker_sn"
	"math/big"
	"time"

	// invoke "backend/internal/invoker"
	"backend/internal/model"
	"fmt"

	"github.com/shopspring/decimal"
)

func UpdateNekoSpiritByTransfer(from string, to string, tokenId uint64) {

	fmt.Println("UpdateNekoSpiritByTransfer: ", from, to, tokenId)

	if from == "0x0" {

		toSave, err := invoker_sn.ReadNekoSpiritInfo(tokenId, true)
		if err != nil {
			fmt.Println("ReadNekoSpiritInfo error: ", err)
			return
		}

		toSave.TokenId = tokenId
		toSave.StakeFromUid = database.GetAddressDetailByAddress(to).Uid
		toSave.StakeTime = time.Now()
		database.CreateNekoSpiritInfo(&toSave)
		fmt.Println("CreateNekoSpiritInfo: ", toSave)

		// starter pack
		if toSave.Fade.Equal(decimal.New(125, 0)) {
			fmt.Println("This spirit is a starter pack")
			return
		}

		// reward to inviter
		detail := database.GetAddressDetailByAddress(to)
		var second = database.ServerInvitationRewardRecord{
			Uid:     detail.SecondInviter,
			FromUid: detail.Uid,
			Amount:  decimal.NewFromInt(2500),
		}
		var third = database.ServerInvitationRewardRecord{
			Uid:     detail.ThirdInviter,
			FromUid: detail.Uid,
			Amount:  decimal.NewFromInt(1250),
		}
		database.CreateInvitationRewardRecords([]database.ServerInvitationRewardRecord{second, third})
		if detail.SecondInviter != 0 {
			database.AddInvitationRewardStatic(detail.SecondInviter, decimal.NewFromInt(2500))
		}
		if detail.ThirdInviter != 0 {
			database.AddInvitationRewardStatic(detail.ThirdInviter, decimal.NewFromInt(1250))
		}
		// unlock reward of invitation
		database.UnlockInvitationRewardStatic(detail.Uid, decimal.NewFromInt(2500))
		// burn 25% of mint cost
		// by contract

	} else {

		info, err := invoker_sn.ReadNekoSpiritInfo(tokenId, false)
		if err != nil {
			fmt.Println("ReadNekoSpiritInfo error: ", err)
			return
		}

		toUpdate, err := database.GetNekoSpiritInfoByTokenId(tokenId)
		if err != nil {
			fmt.Println("GetNekoSpiritInfoByTokenId error: ", err)
			return
		}

		if to == chain_sn.HostAddress {
			toUpdate.IsStaked = true
			toUpdate.StakeTime = time.Now()
		} else {
			toUpdate.IsStaked = false
		}

		toUpdate.Fade = info.Fade

		database.UpdateNekoSpiritInfo(toUpdate)

	}

}

func UpdateNekoSpiritByUpgrade(tokenId uint64) {

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
		Name:    info.Name,
		SPI:     info.SPI,
		ATK:     info.ATK,
		DEF:     info.DEF,
		SPD:     info.SPD,
		Level:   info.Level,
	}); err != nil {
		fmt.Println("UpdateNekoSpiritInfo error: ", err)
		return
	}

}

// func UpdateNekoSpiritByTransfer(tokenId *big.Int, to common.Address) {

// 	fmt.Println("UpdateNekoSpiritByTransfer: ", tokenId, to)

// 	info, err := invoke.ReadNekoSpiritInfo(tokenId, false)
// 	fmt.Println("ReadNekoSpiritInfo : ", tokenId, info)
// 	if err != nil {
// 		fmt.Println("ReadNekoSpiritInfo error: ", err)
// 		return
// 	}

// 	origin, err := database.GetNekoSpiritInfoByTokenId(tokenId.Uint64())
// 	if err != nil && errors.Is(err, gorm.ErrRecordNotFound) {
// 		// new record

// 		uid := database.GetAddressDetailByAddress(to.Hex()).Uid
// 		// if err != nil {
// 		// 	fmt.Println("GetUidByAddress error: ", err)
// 		// 	return
// 		// }

// 		origin := database.ServerNekoSpiritInfo{
// 			TokenId:      tokenId.Uint64(),
// 			Rarity:       info.Rarity,
// 			Element:      info.Element,
// 			Name:         info.Name,
// 			SPI:          decimal.NewFromUint64(info.SPI.Uint64()).Div(decimal.NewFromUint64(100)),
// 			ATK:          decimal.NewFromUint64(info.ATK.Uint64()).Div(decimal.NewFromUint64(100)),
// 			DEF:          decimal.NewFromUint64(info.DEF.Uint64()).Div(decimal.NewFromUint64(100)),
// 			SPD:          decimal.NewFromUint64(info.SPD.Uint64()).Div(decimal.NewFromUint64(100)),
// 			Fade:         decimal.NewFromUint64(info.Fade.Uint64()).Div(decimal.NewFromUint64(100)),
// 			Level:        info.Level.Uint64(),
// 			StakeFromUid: uid,
// 			StakeTime:    time.Now(),
// 		}

// 		_ = database.CreateNekoSpiritInfo(&origin)

// 		// starter pack
// 		if origin.Fade.Equal(decimal.New(125, 0)) {
// 			fmt.Println("This spirit is a starter pack")
// 			return
// 		}

// 		// reward to inviter
// 		detail := database.GetAddressDetailByAddress(to.Hex())
// 		var second = database.ServerInvitationRewardRecord{
// 			Uid:     detail.SecondInviter,
// 			FromUid: detail.Uid,
// 			Amount:  decimal.NewFromInt(2500),
// 		}
// 		var third = database.ServerInvitationRewardRecord{
// 			Uid:     detail.ThirdInviter,
// 			FromUid: detail.Uid,
// 			Amount:  decimal.NewFromInt(1250),
// 		}
// 		database.CreateInvitationRewardRecords([]database.ServerInvitationRewardRecord{second, third})
// 		if detail.SecondInviter != 0 {
// 			database.AddInvitationRewardStatic(detail.SecondInviter, decimal.NewFromInt(2500))
// 		}
// 		if detail.ThirdInviter != 0 {
// 			database.AddInvitationRewardStatic(detail.ThirdInviter, decimal.NewFromInt(1250))
// 		}
// 		// unlock reward of invitation
// 		database.UnlockInvitationRewardStatic(detail.Uid, decimal.NewFromInt(2500))
// 		// burn 25% of mint cost
// 		// by contract

// 	} else if err == nil {
// 		// update

// 		var toUpdate = database.ServerNekoSpiritInfo{
// 			Model:   database.Model{ID: origin.Model.ID},
// 			TokenId: origin.TokenId,
// 		}

// 		// only transfer change
// 		toUpdate.Fade.Equal(decimal.NewFromUint64(info.Fade.Uint64()).Div(decimal.NewFromUint64(100)))
// 		// if to == chain.OwnerAddress {
// 		// 	toUpdate.IsStaked = true
// 		// 	toUpdate.StakeTime = time.Now()
// 		// } else {
// 		// 	toUpdate.IsStaked = false
// 		// }

// 		if err := database.UpdateNekoSpiritInfo(&toUpdate); err != nil {
// 			fmt.Println("UpdateNekoSpiritInfo error: ", err)
// 			return
// 		}
// 	}

// }

// func UpdateNekoSpiritByUpgrade(tokenId *big.Int) {

// 	fmt.Println("UpdateNekoSpiritFromChain: ", tokenId)

// 	info, err := invoke.ReadNekoSpiritInfo(tokenId, false)
// 	fmt.Println("ReadNekoSpiritInfo : ", tokenId, info)
// 	if err != nil {
// 		fmt.Println("ReadNekoSpiritInfo error: ", err)
// 		return
// 	}

// 	owner, err := invoke.ReadOwnerOfNekoSpirit(tokenId)
// 	fmt.Println("ReadOwnerOfNekoSpirit : ", tokenId, owner)
// 	if err != nil {
// 		fmt.Println("ReadOwnerOfNekoSpirit error: ", err)
// 		return
// 	}

// 	origin, err := database.GetNekoSpiritInfoByTokenId(tokenId.Uint64())
// 	if err != nil {
// 		fmt.Println("GetNekoSpiritInfoByTokenId error: ", err)
// 	}

// 	// update
// 	var toUpdate = database.ServerNekoSpiritInfo{
// 		Model: database.Model{ID: origin.Model.ID},
// 	}

// 	// only upgrade level
// 	toUpdate.TokenId = tokenId.Uint64()
// 	toUpdate.SPI = decimal.NewFromUint64(info.SPI.Uint64()).Div(decimal.NewFromUint64(100))
// 	toUpdate.ATK = decimal.NewFromUint64(info.ATK.Uint64()).Div(decimal.NewFromUint64(100))
// 	toUpdate.DEF = decimal.NewFromUint64(info.DEF.Uint64()).Div(decimal.NewFromUint64(100))
// 	toUpdate.SPD = decimal.NewFromUint64(info.SPD.Uint64()).Div(decimal.NewFromUint64(100))
// 	toUpdate.Level = info.Level.Uint64()

// 	_ = database.UpdateNekoSpiritInfo(&toUpdate)

// }

// func UpdateAscendFromChain(sender common.Address, level *big.Int) {
func UpdateAscendFromChain(sender string, level uint64) {

	fmt.Println("UpdateAscendFromChain: ", sender, level)

	//等级 Prism消耗	Neko消耗	全局Mana加成
	//9	746	13299996	51%
	//8	429	3043477	43%
	//7	247	696448	35%
	//6	142	159370	28%
	//5	82	36469	20%
	//4	47	8345	15%
	//3	27	1910	10%
	//2	16	437	5%
	//1	9	100	2%

	targetLevel := level
	boost := decimal.New(0, 0)
	switch targetLevel {
	case 1:
		boost = decimal.New(2, -2)
	case 2:
		boost = decimal.New(5, -2)
	case 3:
		boost = decimal.New(10, -2)
	case 4:
		boost = decimal.New(15, -2)
	case 5:
		boost = decimal.New(20, -2)
	case 6:
		boost = decimal.New(28, -2)
	case 7:
		boost = decimal.New(35, -2)
	case 8:
		boost = decimal.New(43, -2)
	case 9:
		boost = decimal.New(51, -2)
	}

	detail := database.GetAddressDetailByAddress(sender)

	_ = database.UpdateBuffRecord(&database.ServerBuffRecord{
		Uid:   detail.Uid,
		Level: targetLevel,
		Boost: boost,
	})

}

func SummonBox(address string, count uint64) (code model.ResponseCode, message string) {

	if err := invoker_sn.Summon(address, big.NewInt(int64(count))); err != nil {
		fmt.Println("SummonBox error: ", err)
	}

	// half of mint cost
	database.AddRewardsPool(decimal.New(int64(count*12500), 0))

	return model.Success, "Summon success"

}
