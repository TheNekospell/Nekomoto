package service

import (
	"backend/internal/database"
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
		if spirit.Fade.LessThanOrEqual(decimal.Zero) {
			spiritReward = spiritReward.Add(spirit.Rewards)
			temp.ClaimedRewards = spirit.Rewards
			spiritToUpdate = append(spiritToUpdate, temp)
		}
	}

	invitationReward := decimal.Zero
	if claimable := addressDetail.InvitationReward.UnlockedAmount.Sub(addressDetail.InvitationReward.ClaimedAmount); claimable.GreaterThan(decimal.Zero) {
		invitationReward = claimable
	}

	totalReward := invitationReward.Add(spiritReward)
	if totalReward.Equal(decimal.Zero) {
		return model.Success, "Nothing to claim"
	}

	// update related tables

	database.UpdateNekoSpiritList(spiritToUpdate)
	database.ClaimInvitationRewardStatic(addressDetail.Uid, invitationReward)
	database.CreateClaimRecord(addressDetail.Uid, totalReward)

	// invoke chain to send rewards, 10% as tax

	// invoke.SendNekoCoin(common.HexToAddress(addressDetail.Address), totalReward.Mul(decimal.New(9, -1)).Mul(decimal.New(10, 18)).BigInt())

	// clear cache

	database.Cache.Delete(database.CacheTagUid + strconv.FormatUint(addressDetail.Uid, 10))

	return model.Success, "Success"
}
