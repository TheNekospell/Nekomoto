package service

import (
	"backend/internal/database"
	"backend/internal/invoker_sn"
	"fmt"
	"time"

	"github.com/shopspring/decimal"
)

func AllocateProfit() {

	// 1. Linear regression of last epoch
	// 2. Allocate profit of last epoch
	// 3. Two pools

	// database.Cache.Set(database.CacheAllocate, true, -1)

	now := time.Now()
	var totalMana decimal.Decimal
	rewardPool := database.GetRewardPool()
	fmt.Println("")
	fmt.Println("Wow, it's time to start a big allocate profit:", now)

	processList := database.QueryStakedSpiritList()
	if len(processList) == 0 {
		fmt.Println("There is no staked spirit")
		return
	}
	var toUpdate []database.ServerNekoSpiritInfo

	// white list bounty wave
	// whiteList, boost, open := database.GetBountyWaveList()

	// basic calculation
	// manaMap := make(map[uint64]decimal.Decimal)
	for _, process := range processList {

		temp := database.ServerNekoSpiritInfo{
			Model:          database.Model{ID: process.ID},
			TokenId:        process.TokenId,
			Rewards:        process.Rewards,
			ClaimedRewards: process.ClaimedRewards,
		}

		// calculate the fade, and add mana into the map
		fmt.Println("process spirit ID: ", process.ID, temp)

		// TODO epoch profit
		// detail := database.GetAddressDetailByUid(process.StakeFromUid)

		// if process.Fade.GreaterThan(decimal.New(0, 0)) {
		// 	// Mana=0.065*（0.4*SPI+0.3*ATK+0.2*DEF+0.1*SPD
		// manaOfSpirit := process.Mana
		// 	if detail.Buff.Level > 0 {
		// 		manaOfSpirit = manaOfSpirit.Mul(getBoostOfAscend(detail.Buff.Level))
		// 	}
		// 	// Bounty wave
		// 	if open && inList(process.StakeFromUid, whiteList) {
		// 		manaOfSpirit = manaOfSpirit.Mul(boost.Add(decimal.New(1, 0)))
		// 	}
		// 	// update mana
		// 	totalMana = totalMana.Add(manaOfSpirit)
		// 	// record them

		// toUpdate = append(toUpdate, temp)
		// manaMap[process.ID] = manaOfSpirit
		// }
	}

	// Reward calculation
	toAllocate := rewardPool.StakePool.Mul(calTheRewardCoefficient(totalMana))
	fmt.Println("rewardPool: ", rewardPool, "toAllocate: ", toAllocate)
	// for i := range toUpdate {
	// coefficient := manaMap[toUpdate[i].ID].Div(totalMana)
	// toUpdate[i].Rewards = toUpdate[i].Rewards.Add(toAllocate.Mul(coefficient))
	// }
	// fmt.Println("toUpdate: ", toUpdate)
	database.UpdateNekoSpiritList(toUpdate)

	// sub the reward pool
	database.SubRewardPool(decimal.Zero, toAllocate)
}

func calTheRewardCoefficient(mana decimal.Decimal) decimal.Decimal {
	if mana.Cmp(decimal.New(100, 0)) < 0 {
		return decimal.New(615, -9)
	} else if mana.Cmp(decimal.New(1000, 0)) < 0 {
		return decimal.New(5800, -9)
	} else if mana.Cmp(decimal.New(5000, 0)) < 0 {
		return decimal.New(30000, -9)
	} else if mana.Cmp(decimal.New(10000, 0)) < 0 {
		return decimal.New(60000, -9)
	} else if mana.Cmp(decimal.New(50000, 0)) < 0 {
		return decimal.New(300000, -9)
	} else if mana.Cmp(decimal.New(100000, 0)) < 0 {
		return decimal.New(600000, -9)
	}
	return decimal.New(620000, -9)
}



func GiveChest() {

	uidList := database.QueryUidThatStakeGreatNeko()
	fmt.Println("We should give chest to: ", uidList)
	var toSave []database.ServerChest
	for _, uid := range uidList {
		toSave = append(toSave, database.ServerChest{
			Uid: uid,
		})
	}
	if len(toSave) > 0 {
		database.DB.CreateInBatches(toSave, 100)
	}

}

func BurnCoin() {
	list := database.GetTempBurn()
	fmt.Println("to burn list: ", list)

	if list != nil {
		var toBurn decimal.Decimal
		for _, v := range list {
			toBurn = toBurn.Add(v.Count)
		}
		if err := invoker_sn.BurnNekoCoin(toBurn); err != nil {
			fmt.Println("BurnNekoCoin error: ", err)
			return
		} else {
			var id []uint64
			for _, v := range list {
				id = append(id, v.ID)
			}
			database.UpdateTempBurn(id)
		}
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
