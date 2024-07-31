package tick

import (
	"fmt"
	"time"

	"backend/internal/server/service"
)

func init() {

}

func StartTicker() {

	fmt.Println("Start ticker", time.Now().UTC().Local())

	now := time.Now().UTC()
	nextHour := now.Truncate(time.Hour).Add(time.Hour)

	waitTime := nextHour.Sub(now)
	allocateTimer := time.NewTimer(waitTime)

	nextDay := now.AddDate(0, 0, 1)
	nextMidnight := time.Date(nextDay.Year(), nextDay.Month(), nextDay.Day(), 0, 0, 0, 0, nextDay.Location())

	waitTime2 := nextMidnight.Sub(now)
	chestTimer := time.NewTimer(waitTime2)

	burnTimer := time.NewTimer(5 * time.Minute)

	for {
		select {

		case <-chestTimer.C:

			service.GiveChest()

			nextDay = nextDay.AddDate(0, 0, 1)
			nextMidnight = time.Date(nextDay.Year(), nextDay.Month(), nextDay.Day(), 0, 0, 0, 0, nextDay.Location())

			waitTime2 = time.Until(nextMidnight)

			chestTimer.Reset(waitTime2)

		case <-allocateTimer.C:

			service.AllocateProfit()

			nextHour = nextHour.Add(time.Hour)
			waitTime = time.Until(nextHour)

			allocateTimer.Reset(waitTime)

		case <-burnTimer.C:
			
			service.BurnCoin()

		}
	}

}
