package service

import (
	// "backend/internal/database"
	// "backend/internal/invoker_sn"
	// "fmt"
	// "math/big"

	// "backend/internal/model"
	// "strconv"
	// "time"

	// "github.com/shopspring/decimal"
)

// func ClaimReward(req model.AddressAndSignature) (model.ResponseCode, string) {

// 	// two parts to claim
// 	// 1. spirit stake that which's fade is run out
// 	// 2. unlocked mint rewards from invitee through minting box

// 	addressDetail := database.GetAddressDetailByAddress(req.Address)

// 	// make sure it past 24 hours from the last time claimed

// 	if addressDetail.LastClaim.Add(24 * time.Hour).After(time.Now()) {
// 		return model.ServerInternalError, "Every 24 hours can only claim once"
// 	}

// 	// limit the max claimable amount

// 	maxToClaim := calMaxToClaim(req.Address).Div(decimal.New(9, -1))
// 	fmt.Println("address: ", req.Address, "maxToClaim: ", maxToClaim)
// 	if maxToClaim.Equal(decimal.Zero) {
// 		return model.ServerInternalError, "Exceed the limit"
// 	}

// 	// make sure that there are rewards to claim

// 	spiritReward := decimal.Zero
// 	// sort.Slice(addressDetail.NekoSpiritList, func(i, j int) bool {
// 	// 	return addressDetail.NekoSpiritList[i].Rewards.LessThan(addressDetail.NekoSpiritList[j].Rewards)
// 	// })
// 	var spiritToUpdate []database.ServerNekoSpiritInfo
// 	for _, spirit := range addressDetail.NekoSpiritList {
// 		if spirit.Rewards.Equal(decimal.Zero) {
// 			continue
// 		}
// 		temp := database.ServerNekoSpiritInfo{
// 			Model:          database.Model{ID: spirit.ID},
// 			TokenId:        spirit.TokenId,
// 			ClaimedRewards: spirit.ClaimedRewards,
// 		}
// 		if spiritReward.Add(spirit.Rewards).LessThanOrEqual(maxToClaim) {
// 			spiritReward = spiritReward.Add(spirit.Rewards)
// 			temp.ClaimedRewards = temp.ClaimedRewards.Add(spirit.Rewards)
// 			temp.Rewards = decimal.Zero
// 			spiritToUpdate = append(spiritToUpdate, temp)
// 		} else {
// 			// part of the reward of this spirit
// 			partReward := maxToClaim.Sub(spiritReward)
// 			spiritReward = spiritReward.Add(partReward)
// 			temp.ClaimedRewards = temp.ClaimedRewards.Add(partReward)
// 			temp.Rewards = spirit.Rewards.Sub(partReward)
// 			spiritToUpdate = append(spiritToUpdate, temp)
// 			break
// 		}
// 	}

// 	// invitationReward := decimal.Zero
// 	// if claimable := addressDetail.InvitationReward.UnlockedAmount.Sub(addressDetail.InvitationReward.ClaimedAmount); claimable.GreaterThan(decimal.Zero) {
// 	// 	invitationReward = claimable
// 	// }

// 	totalReward := spiritReward
// 	if totalReward.Equal(decimal.Zero) {
// 		return model.ServerInternalError, "Nothing to claim"
// 	}

// 	// invoke chain to send rewards, 10% as tax

// 	if err := invoker_sn.SendCoinAndNFT(addressDetail.Address, totalReward.Mul(decimal.New(9, -1)).Mul(decimal.New(1, 18)).BigInt(), big.NewInt(0), big.NewInt(0)); err != nil {
// 		fmt.Println("SendCoinAndNFT error: ", err)
// 		return model.ServerInternalError, err.Error()
// 	}

// 	// update related tables

// 	database.UpdateNekoSpiritListWithMap(spiritToUpdate)
// 	// database.ClaimInvitationRewardStatic(addressDetail.Uid, invitationReward)
// 	database.CreateClaimRecord(addressDetail.Uid, totalReward.Mul(decimal.New(9, -1)))

// 	// clear cache

// 	database.Cache.Delete(database.CacheTagUid + strconv.FormatUint(addressDetail.Uid, 10))

// 	return model.Success, "Claimed " + totalReward.Mul(decimal.New(9, -1)).Round(2).String() + "NKO"
// }

// func ClaimRewardOfInvitation(req model.AddressAndSignature) (model.ResponseCode, string) {

// 	// limit the max claimable amount

// 	maxToClaim := calMaxToClaim(req.Address)
// 	if maxToClaim.Equal(decimal.Zero) {
// 		return model.ServerInternalError, "Exceed the limit"
// 	}

// 	addressDetail := database.GetAddressDetailByAddress(req.Address)

// 	invitationReward := decimal.Zero
// 	if claimable := decimal.Min(addressDetail.InvitationReward.TotalAmount, addressDetail.InvitationReward.UnlockedAmount).Sub(addressDetail.InvitationReward.ClaimedAmount); claimable.GreaterThan(decimal.Zero) {
// 		invitationReward = claimable
// 	}

// 	if invitationReward.Equal(decimal.Zero) {
// 		return model.ServerInternalError, "Nothing to claim"
// 	}

// 	if invitationReward.GreaterThan(maxToClaim) {
// 		invitationReward = maxToClaim
// 	}

// 	if err := invoker_sn.SendCoinAndNFT(addressDetail.Address, invitationReward.Mul(decimal.New(1, 18)).BigInt(), big.NewInt(0), big.NewInt(0)); err != nil {
// 		fmt.Println("SendCoinAndNFT error: ", err)
// 		return model.ServerInternalError, err.Error()
// 	}

// 	database.ClaimInvitationRewardStatic(addressDetail.Uid, invitationReward)
// 	// database.CreateClaimRecord(addressDetail.Uid, invitationReward)

// 	database.Cache.Delete(database.CacheTagUid + strconv.FormatUint(addressDetail.Uid, 10))

// 	return model.Success, "Claimed " + invitationReward.Round(2).String() + "NKO"

// }

