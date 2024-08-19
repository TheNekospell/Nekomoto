package service

import (
	"backend/internal/database"
	"backend/internal/invoker_sn"
	"fmt"
	"math/big"

	"backend/internal/model"
	"strconv"
	"time"

	"github.com/shopspring/decimal"
)

func ClaimReward(req model.AddressAndSignature) (model.ResponseCode, string) {

	// two parts to claim
	// 1. spirit stake that which's fade is run out
	// 2. unlocked mint rewards from invitee through minting box

	addressDetail := database.GetAddressDetailByAddress(req.Address)

	// make sure it past 24 hours from the last time claimed

	if addressDetail.LastClaim.Add(24 * time.Hour).After(time.Now()) {
		return model.ServerInternalError, "Every 24 hours can only claim once"
	}

	// limit the max claimable amount

	maxToClaim := calMaxToClaim(req.Address).Div(decimal.New(9, -1))
	fmt.Println("address: ", req.Address, "maxToClaim: ", maxToClaim)
	if maxToClaim.Equal(decimal.Zero) {
		return model.ServerInternalError, "Exceed the limit"
	}

	// make sure that there are rewards to claim

	spiritReward := decimal.Zero
	// sort.Slice(addressDetail.NekoSpiritList, func(i, j int) bool {
	// 	return addressDetail.NekoSpiritList[i].Rewards.LessThan(addressDetail.NekoSpiritList[j].Rewards)
	// })
	var spiritToUpdate []database.ServerNekoSpiritInfo
	for _, spirit := range addressDetail.NekoSpiritList {
		if spirit.Rewards.Equal(decimal.Zero) {
			continue
		}
		temp := database.ServerNekoSpiritInfo{
			Model:          database.Model{ID: spirit.ID},
			TokenId:        spirit.TokenId,
			ClaimedRewards: spirit.ClaimedRewards,
		}
		if spiritReward.Add(spirit.Rewards).LessThanOrEqual(maxToClaim) {
			spiritReward = spiritReward.Add(spirit.Rewards)
			temp.ClaimedRewards = temp.ClaimedRewards.Add(spirit.Rewards)
			temp.Rewards = decimal.Zero
			spiritToUpdate = append(spiritToUpdate, temp)
		} else {
			// part of the reward of this spirit
			partReward := maxToClaim.Sub(spiritReward)
			spiritReward = spiritReward.Add(partReward)
			temp.ClaimedRewards = temp.ClaimedRewards.Add(partReward)
			temp.Rewards = spirit.Rewards.Sub(partReward)
			spiritToUpdate = append(spiritToUpdate, temp)
			break
		}
	}

	// invitationReward := decimal.Zero
	// if claimable := addressDetail.InvitationReward.UnlockedAmount.Sub(addressDetail.InvitationReward.ClaimedAmount); claimable.GreaterThan(decimal.Zero) {
	// 	invitationReward = claimable
	// }

	totalReward := spiritReward
	if totalReward.Equal(decimal.Zero) {
		return model.ServerInternalError, "Nothing to claim"
	}

	// invoke chain to send rewards, 10% as tax

	if err := invoker_sn.SendCoinAndNFT(addressDetail.Address, totalReward.Mul(decimal.New(9, -1)).Mul(decimal.New(1, 18)).BigInt(), big.NewInt(0), big.NewInt(0)); err != nil {
		fmt.Println("SendCoinAndNFT error: ", err)
		return model.ServerInternalError, err.Error()
	}

	// update related tables

	database.UpdateNekoSpiritListWithMap(spiritToUpdate)
	// database.ClaimInvitationRewardStatic(addressDetail.Uid, invitationReward)
	database.CreateClaimRecord(addressDetail.Uid, totalReward.Mul(decimal.New(9, -1)))

	// clear cache

	database.Cache.Delete(database.CacheTagUid + strconv.FormatUint(addressDetail.Uid, 10))

	return model.Success, "Claimed " + totalReward.Mul(decimal.New(9, -1)).Round(2).String() + "NKO"
}

func ClaimRewardOfInvitation(req model.AddressAndSignature) (model.ResponseCode, string) {

	// limit the max claimable amount

	maxToClaim := calMaxToClaim(req.Address)
	if maxToClaim.Equal(decimal.Zero) {
		return model.ServerInternalError, "Exceed the limit"
	}

	addressDetail := database.GetAddressDetailByAddress(req.Address)

	invitationReward := decimal.Zero
	if claimable := decimal.Min(addressDetail.InvitationReward.TotalAmount, addressDetail.InvitationReward.UnlockedAmount).Sub(addressDetail.InvitationReward.ClaimedAmount); claimable.GreaterThan(decimal.Zero) {
		invitationReward = claimable
	}

	if invitationReward.Equal(decimal.Zero) {
		return model.ServerInternalError, "Nothing to claim"
	}

	if invitationReward.GreaterThan(maxToClaim) {
		invitationReward = maxToClaim
	}

	if err := invoker_sn.SendCoinAndNFT(addressDetail.Address, invitationReward.Mul(decimal.New(1, 18)).BigInt(), big.NewInt(0), big.NewInt(0)); err != nil {
		fmt.Println("SendCoinAndNFT error: ", err)
		return model.ServerInternalError, err.Error()
	}

	database.ClaimInvitationRewardStatic(addressDetail.Uid, invitationReward)
	// database.CreateClaimRecord(addressDetail.Uid, invitationReward)

	database.Cache.Delete(database.CacheTagUid + strconv.FormatUint(addressDetail.Uid, 10))

	return model.Success, "Claimed " + invitationReward.Round(2).String() + "NKO"

}

func CalMax(levelCount uint64) decimal.Decimal {

	// 	[0,10]	25000
	// [11,20]	50000
	// [21,40]	125000
	// [41,80]	250000
	// [81,100]	550000
	// [101,150]	1200000
	// [151,200]	1600000
	// [201,+∞]	2000000

	if levelCount <= 10 {
		return decimal.New(25000, 0)
	} else if levelCount <= 20 {
		return decimal.New(50000, 0)
	} else if levelCount <= 40 {
		return decimal.New(125000, 0)
	} else if levelCount <= 80 {
		return decimal.New(250000, 0)
	} else if levelCount <= 100 {
		return decimal.New(550000, 0)
	} else if levelCount <= 150 {
		return decimal.New(1200000, 0)
	} else if levelCount <= 200 {
		return decimal.New(1600000, 0)
	} else {
		return decimal.New(2000000, 0)
	}
}

func calMaxToClaim(address string) decimal.Decimal {
	balance, err := invoker_sn.ReadBalance(address)
	if err != nil {
		fmt.Println("ReadBalance error: ", err.Error())
		return decimal.Zero
	}

	levelCount, err := invoker_sn.ReadLevelCount(address)
	if err != nil {
		fmt.Println("ReadLevelCount error: ", err.Error())
		return decimal.Zero
	}

	maxToClaim := CalMax(levelCount).Sub(balance.Div(decimal.New(1, 18)))
	if maxToClaim.LessThan(decimal.Zero) {
		return decimal.Zero
	}

	return maxToClaim
}
