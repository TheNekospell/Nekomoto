package service

import (
	"backend/internal/database"
	"backend/internal/invoker_sn"
	"fmt"
	"math/big"

	// invoke "backend/internal/invoker"
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
		return model.Success, "Every 24 hours can only claim once"
	}

	// make sure that there are rewards to claim

	spiritReward := decimal.Zero
	var spiritToUpdate []database.ServerNekoSpiritInfo
	for _, spirit := range addressDetail.NekoSpiritList {
		temp := database.ServerNekoSpiritInfo{
			Model:          database.Model{ID: spirit.ID},
			TokenId:        spirit.TokenId,
			ClaimedRewards: spirit.ClaimedRewards,
		}
		// if spirit.Fade.LessThanOrEqual(decimal.Zero) {
		spiritReward = spiritReward.Add(spirit.Rewards)
		temp.ClaimedRewards = temp.ClaimedRewards.Add(spirit.Rewards)
		temp.Rewards = decimal.Zero
		spiritToUpdate = append(spiritToUpdate, temp)
		// }
	}

	// invitationReward := decimal.Zero
	// if claimable := addressDetail.InvitationReward.UnlockedAmount.Sub(addressDetail.InvitationReward.ClaimedAmount); claimable.GreaterThan(decimal.Zero) {
	// 	invitationReward = claimable
	// }

	totalReward := spiritReward
	if totalReward.Equal(decimal.Zero) {
		return model.Success, "Nothing to claim"
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

	return model.Success, "Success"
}

func ClaimRewardOfInvitation(req model.AddressAndSignature) (model.ResponseCode, string) {

	addressDetail := database.GetAddressDetailByAddress(req.Address)

	invitationReward := decimal.Zero
	if claimable := decimal.Min(addressDetail.InvitationReward.TotalAmount, addressDetail.InvitationReward.UnlockedAmount).Sub(addressDetail.InvitationReward.ClaimedAmount); claimable.GreaterThan(decimal.Zero) {
		invitationReward = claimable
	}

	if invitationReward.Equal(decimal.Zero) {
		return model.Success, "Nothing to claim"
	}

	if err := invoker_sn.SendCoinAndNFT(addressDetail.Address, invitationReward.Mul(decimal.New(1, 18)).BigInt(), big.NewInt(0), big.NewInt(0)); err != nil {
		fmt.Println("SendCoinAndNFT error: ", err)
		return model.ServerInternalError, err.Error()
	}

	database.ClaimInvitationRewardStatic(addressDetail.Uid, invitationReward)
	// database.CreateClaimRecord(addressDetail.Uid, invitationReward)

	database.Cache.Delete(database.CacheTagUid + strconv.FormatUint(addressDetail.Uid, 10))

	return model.Success, "Success"

}
