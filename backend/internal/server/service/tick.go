package service

import (
	"backend/internal/database"
	"fmt"
	"time"

	"github.com/shopspring/decimal"
)

func CalLuckAndPower(nekoList []database.ServerNekoSpiritInfo, epoch uint64) (decimal.Decimal, decimal.Decimal) {
	TotalLuck := decimal.Zero
	TotalPower := decimal.Zero
	for _, neko := range nekoList {
		if neko.Epoch == epoch {
			if neko.Rarity == "SSR" {
				TotalLuck = TotalLuck.Add(decimal.New(1, 0))
			} else if neko.Rarity == "UR" {
				TotalLuck = TotalLuck.Add(decimal.New(3, 0))
			}
		}
		if neko.IsStaked {
			TotalPower = TotalPower.Add(neko.ATK)
		}
	}

	return TotalLuck, TotalPower
}

func AllocateProfit() {

	now := time.Now()
	fmt.Println("")
	fmt.Println("Wow, it's time to start a big allocate profit:", now)

	lastEpoch := database.GetEpoch() - 1

	rewardPool := database.GetRewardPool()
	currentMintPoolReward, currentStakePoolReward := rewardPool.MintPool, rewardPool.StakePool

	nekoList := database.GetNekoSpiritList()
	if len(nekoList) == 0 {
		// mark here
		fmt.Println("There is no neko spirit")
		database.ResetRewardPool(currentMintPoolReward, currentStakePoolReward)
		return
	}

	var toUpdate []database.ServerNekoSpiritInfo

	TotalLuck, TotalPower := CalLuckAndPower(nekoList, lastEpoch)
	currentStakePoolRewardReleased, currentStakePoolRewardNotReleased := calTheReleaseReward(currentStakePoolReward, TotalPower)
	fmt.Println("TotalLuck: ", TotalLuck, " TotalPower: ", TotalPower, " currentStakePoolRewardReleased: ", currentStakePoolRewardReleased, " currentStakePoolRewardNotReleased: ", currentStakePoolRewardNotReleased)

	for _, process := range nekoList {

		temp := database.ServerNekoSpiritInfo{
			Model:       database.Model{ID: process.ID},
			TokenId:     process.TokenId,
			Rewards:     process.Rewards,
			MintRewards: process.MintRewards,
		}

		fmt.Println("process token ID: ", process.ID, temp)

		update := false

		// mint pool
		if process.Epoch == lastEpoch {
			if process.Rarity == "SSR" {
				temp.MintRewards = temp.MintRewards.Add(currentMintPoolReward.Mul(decimal.New(1, 0).Div(TotalLuck)))
				update = true
			} else if process.Rarity == "UR" {
				temp.MintRewards = temp.MintRewards.Add(currentMintPoolReward.Mul(decimal.New(3, 0).Div(TotalLuck)))
				update = true
			}
		}

		// stake pool
		if process.IsStaked {
			temp.Rewards = temp.Rewards.Add(currentStakePoolRewardReleased.Mul(process.ATK.Div(TotalPower)))
			update = true
		}

		if update {
			toUpdate = append(toUpdate, temp)
			fmt.Println("update token ID: ", process.TokenId, temp)
		}

	}

	database.ResetRewardPool(decimal.Zero, currentStakePoolRewardNotReleased)

	database.UpdateNekoSpiritList(toUpdate)

}

func calTheReleaseReward(reward decimal.Decimal, power decimal.Decimal) (decimal.Decimal, decimal.Decimal) {
	// 50%	0
	// 60%	200000
	// 70%	300000
	// 80%	400000
	// 90%	500000
	// 100%	600000

	if power.Cmp(decimal.New(200000, 0)) < 0 {
		return reward.Mul(decimal.New(5, -1)), reward.Mul(decimal.New(5, -1))
	} else if power.Cmp(decimal.New(300000, 0)) < 0 {
		return reward.Mul(decimal.New(6, -1)), reward.Mul(decimal.New(4, -1))
	} else if power.Cmp(decimal.New(400000, 0)) < 0 {
		return reward.Mul(decimal.New(7, -1)), reward.Mul(decimal.New(3, -1))
	} else if power.Cmp(decimal.New(500000, 0)) < 0 {
		return reward.Mul(decimal.New(8, -1)), reward.Mul(decimal.New(2, -1))
	} else if power.Cmp(decimal.New(600000, 0)) < 0 {
		return reward.Mul(decimal.New(9, -1)), reward.Mul(decimal.New(1, -1))
	} else {
		return reward, decimal.Zero
	}
}

func AddEpoch() bool {
	epochNow := database.GetEpoch()
	if epochNow == 1 {
		return true
	}
	database.AddEpoch()
	return false

}
