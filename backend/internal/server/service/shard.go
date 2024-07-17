package service

import (
	"backend/internal/chain_sn"
	"backend/internal/database"
	"backend/internal/invoker_sn"
	"fmt"
)

func UpdateShardFromChain(from string, to string, tokenId uint64) {
	fmt.Println("UpdateShardFromChain: ", tokenId)
	if from == chain_sn.EmptyAddressStringShort {
		// new
		_ = database.CreateShardRecord(database.ServerTemporalShardRecord{
			TokenId: tokenId,
			Uid:     database.GetAddressDetailByAddress(to).Uid,
		}, to)
	} else if to == chain_sn.EmptyAddressStringShort {
		// delete
		_ = database.DeleteShardRecord(tokenId)

		if startTime, err := invoker_sn.ReadTimeFreeze(from); err == nil {
			detail := database.GetAddressDetailByAddress(from)
			if !detail.Buff.StartTime.Equal(startTime) {
				database.UpdateBuffRecord(&database.ServerBuffRecord{
					Model: database.Model{ID: detail.Buff.ID},
					StartTime: startTime,
				})
			}
		}

	}
}

// func UpdateShardFromChain(event *chain.ShardTransfer) {
// 	fmt.Println("UpdateShardFromChain: ", event.TokenId)
// 	if event.From == chain.EmptyAddress {
// 		// new
// 		_ = database.CreateShardRecord(database.ServerTemporalShardRecord{
// 			TokenId: event.TokenId.Uint64(),
// 			Uid:     database.GetAddressDetailByAddress(event.To.Hex()).Uid,
// 		}, event.To.Hex())
// 	} else if event.To == chain.EmptyAddress {
// 		// delete
// 		_ = database.DeleteShardRecord(event.TokenId.Uint64())

// 	}
// }
