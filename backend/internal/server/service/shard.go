package service

import (
	// "backend/internal/chain_sn"
	// "backend/internal/database"
	// "backend/internal/invoker_sn"
	// "fmt"
)

// func UpdateShardFromChain(from string, to string, tokenId uint64) {
// 	fmt.Println("UpdateShardFromChain: ", tokenId)
// 	if from == chain_sn.EmptyAddressStringShort {
// 		// new
// 		_ = database.CreateShardRecord(database.ServerTemporalShardRecord{
// 			TokenId: tokenId,
// 			Uid:     database.GetAddressDetailByAddress(to).Uid,
// 		}, to)
// 	} else if to == chain_sn.EmptyAddressStringShort {
// 		// delete
// 		_ = database.DeleteShardRecord(tokenId)

// 		if startTime, err := invoker_sn.ReadTimeFreeze(from); err == nil {
// 			detail := database.GetAddressDetailByAddress(from)
// 			if !detail.Buff.StartTime.Equal(startTime) {
// 				database.UpdateBuffRecord(&database.ServerBuffRecord{
// 					Model: database.Model{ID: detail.Buff.ID},
// 					StartTime: startTime,
// 				})
// 			}
// 		}

// 	}
// }


