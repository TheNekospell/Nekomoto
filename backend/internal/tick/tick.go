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
	nextEpoch := now.Truncate(time.Hour).Add(time.Hour * 12)

	waitTime := nextEpoch.Sub(now)
	allocateTimer := time.NewTimer(waitTime)

	burnTimer := time.NewTimer(5 * time.Minute)

	for {
		select {

		case <-allocateTimer.C:

			nextEpoch = nextEpoch.Add(time.Hour * 12)
			waitTime = time.Until(nextEpoch)

			allocateTimer.Reset(waitTime)

			service.AllocateProfit()

		case <-burnTimer.C:

			// service.BurnCoin()

		}
	}

}
