package service

import (
	"backend/internal/database"
	"backend/internal/invoker_sn"
	"fmt"
	"time"

	"github.com/shopspring/decimal"
)

func AllocateProfit() {

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
	whiteList, boost, open := database.GetBountyWaveList()

	// basic calculation
	manaMap := make(map[uint64]decimal.Decimal)
	for _, process := range processList {

		temp := database.ServerNekoSpiritInfo{
			Model:          database.Model{ID: process.ID},
			TokenId:        process.TokenId,
			Fade:           process.Fade,
			Rewards:        process.Rewards,
			ClaimedRewards: process.ClaimedRewards,
		}

		// calculate the fade, and add mana into the map
		fmt.Println("process spirit ID: ", process.ID)

		detail := database.GetAddressDetailByUid(process.StakeFromUid)
		// time freeze
		if now.Sub(detail.Buff.StartTime.Add(time.Hour*3)) > 0 {
			temp.Fade = temp.Fade.Sub(decimal.New(1, 0))
		}

		if process.Fade.GreaterThan(decimal.New(0, 0)) {
			// Mana=0.065*（0.4*SPI+0.3*ATK+0.2*DEF+0.1*SPD
			manaOfSpirit := process.Mana
			if detail.Buff.Level > 0 {
				manaOfSpirit = manaOfSpirit.Mul(getBoostOfAscend(detail.Buff.Level))
			}
			// Bounty wave
			if open && inList(process.StakeFromUid, whiteList) {
				manaOfSpirit = manaOfSpirit.Mul(boost.Add(decimal.New(1, 0)))
			}
			// update mana
			totalMana = totalMana.Add(manaOfSpirit)
			// record them

			toUpdate = append(toUpdate, temp)
			manaMap[process.ID] = manaOfSpirit
		}
	}

	// Reward calculation
	toAllocate := rewardPool.Mul(calTheRewardCoefficient(totalMana))
	fmt.Println("rewardPool: ", rewardPool, "toAllocate: ", toAllocate)
	for i := range toUpdate {
		coefficient := manaMap[toUpdate[i].ID].Div(totalMana)
		toUpdate[i].Rewards = toUpdate[i].Rewards.Add(toAllocate.Mul(coefficient))
	}
	// fmt.Println("toUpdate: ", toUpdate)
	database.UpdateNekoSpiritList(toUpdate)

	// sub the reward pool
	database.SubRewardPool(toAllocate)
}

func calTheRewardCoefficient(mana decimal.Decimal) decimal.Decimal {
	if mana.Cmp(decimal.New(100, 0)) < 0 {
		return decimal.New(615, -7)
	} else if mana.Cmp(decimal.New(1000, 0)) < 0 {
		return decimal.New(5800, -7)
	} else if mana.Cmp(decimal.New(5000, 0)) < 0 {
		return decimal.New(30000, -7)
	} else if mana.Cmp(decimal.New(10000, 0)) < 0 {
		return decimal.New(60000, -7)
	} else if mana.Cmp(decimal.New(50000, 0)) < 0 {
		return decimal.New(300000, -7)
	} else if mana.Cmp(decimal.New(100000, 0)) < 0 {
		return decimal.New(600000, -7)
	}
	return decimal.New(620000, -7)
}

func inList(uid uint64, list []database.ServerWhiteListOfBountyWave) bool {
	for _, v := range list {
		if database.GetAddressDetailByAddress(v.Address).Uid == uid {
			return true
		}
	}
	return false
}

func getBoostOfAscend(level uint64) decimal.Decimal {
	switch level {
	case 1:
		return decimal.New(102, -2)
	case 2:
		return decimal.New(105, -2)
	case 3:
		return decimal.New(110, -2)
	case 4:
		return decimal.New(115, -2)
	case 5:
		return decimal.New(120, -2)
	case 6:
		return decimal.New(128, -2)
	case 7:
		return decimal.New(135, -2)
	case 8:
		return decimal.New(143, -2)
	case 9:
		return decimal.New(151, -2)
	default:
		return decimal.New(0, 0)
	}
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
