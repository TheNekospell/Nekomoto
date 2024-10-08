package service

import (
	"backend/internal/database"
	"backend/internal/invoker_sn"
	"fmt"
	"math/big"

	"backend/internal/model"
	"strconv"
	"github.com/shopspring/decimal"
)

func ClaimReward(req model.AddressAndSignature) (model.ResponseCode, string) {

	addressDetail := database.GetAddressDetailByAddress(req.Address)

	// make sure that there are rewards to claim
	spiritReward := decimal.Zero

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
		spiritReward = spiritReward.Add(spirit.Rewards)
		temp.ClaimedRewards = temp.ClaimedRewards.Add(spirit.Rewards)
		temp.Rewards = decimal.Zero
		spiritToUpdate = append(spiritToUpdate, temp)
	}
	totalReward := spiritReward
	if totalReward.Equal(decimal.Zero) {
		return model.ServerInternalError, "Nothing to claim"
	}

	if err := invoker_sn.SendCoinAndNFT(addressDetail.Address, totalReward.Mul(decimal.New(1, 18)).BigInt(), big.NewInt(0), big.NewInt(0)); err != nil {
		fmt.Println("SendCoinAndNFT error: ", err)
		return model.ServerInternalError, err.Error()
	}

	// update related tables
	database.UpdateNekoSpiritListWithMap(spiritToUpdate)
	database.CreateClaimRecord(addressDetail.Uid, totalReward)

	// clear cache
	database.Cache.Delete(database.CacheTagUid + strconv.FormatUint(addressDetail.Uid, 10))

	return model.Success, "Claimed " + totalReward.Round(2).String() + "NKO"
}


func ClaimRewardOfMint(req model.AddressAndSignature) (model.ResponseCode, string) {

	addressDetail := database.GetAddressDetailByAddress(req.Address)

	// make sure that there are rewards to claim
	spiritReward := decimal.Zero

	var spiritToUpdate []database.ServerNekoSpiritInfo
	for _, spirit := range addressDetail.NekoSpiritList {
		if spirit.Rewards.Equal(decimal.Zero) {
			continue
		}
		temp := database.ServerNekoSpiritInfo{
			Model:          database.Model{ID: spirit.ID},
			TokenId:        spirit.TokenId,
			ClaimedMintRewards: spirit.ClaimedMintRewards,
		}
		spiritReward = spiritReward.Add(spirit.MintRewards)
		temp.ClaimedMintRewards = temp.ClaimedMintRewards.Add(spirit.MintRewards)
		temp.MintRewards = decimal.Zero
		spiritToUpdate = append(spiritToUpdate, temp)
	}
	totalReward := spiritReward
	if totalReward.Equal(decimal.Zero) {
		return model.ServerInternalError, "Nothing to claim"
	}

	if err := invoker_sn.SendCoinAndNFT(addressDetail.Address, totalReward.Mul(decimal.New(1, 18)).BigInt(), big.NewInt(0), big.NewInt(0)); err != nil {
		fmt.Println("SendCoinAndNFT error: ", err)
		return model.ServerInternalError, err.Error()
	}

	// update related tables
	database.UpdateNekoSpiritListWithMap(spiritToUpdate)
	database.CreateClaimRecord(addressDetail.Uid, totalReward)

	// clear cache
	database.Cache.Delete(database.CacheTagUid + strconv.FormatUint(addressDetail.Uid, 10))

	return model.Success, "Claimed " + totalReward.Round(2).String() + "NKO"
}