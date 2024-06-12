package service

import (
	"backend/internal/chain"
	"backend/internal/database"
	"fmt"
)

func UpdateShardFromChain(event *chain.ShardTransfer) {
	fmt.Println("UpdateShardFromChain: ", event.TokenId)
	if event.From == chain.EmptyAddress {
		// new
		_ = database.CreateShardRecord(database.ServerTemporalShardRecord{
			TokenId: event.TokenId.Uint64(),
			Uid:     database.GetAddressDetailByAddress(event.To.Hex()).Uid,
		}, event.To.Hex())
	} else if event.To == chain.EmptyAddress {
		// delete
		_ = database.DeleteShardRecord(event.TokenId.Uint64())

	}
}
