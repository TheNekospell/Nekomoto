package indexer_sn

import (
	"backend/internal/chain_sn"
	"backend/internal/database"
	"backend/starknet/rpc"
	"backend/starknet/utils"

	"backend/internal/server/service"
	"context"
	"fmt"
	"time"

	"github.com/NethermindEth/juno/core/felt"
)

func init() {

}

func StartIndexer() {

	fmt.Println("Starting Indexer")

	channel := make(chan uint64)

	lastHeight := database.GetIndexerHeight()
	fmt.Println("[Indexer] lastHeight", lastHeight)
	go recordIndexerHeight(lastHeight, channel)

	for {

		currentBlock, err := chain_sn.Client.BlockNumber(context.Background())
		if err != nil {
			panic(err)
		}
		// fmt.Println("[Indexer] currentBlock", currentBlock)

		lastHeight := database.GetIndexerHeight()
		// fmt.Println("lastHeight", lastHeight)

		for i := lastHeight + 1; i <= currentBlock; i++ {

			resolveBoxTransfer(i)

			resolveBoxUpgrade(i)

			resolveAscendUpgrade(i)

			resolveShardTransfer(i)

			channel <- i

			// time.Sleep(1 * time.Second)

		}

		time.Sleep(1 * time.Second)

	}

}

func checkIndexedTransaction(event *rpc.EmittedEvent) bool {
	return database.CheckIndexedEvent(event.BlockNumber, event.TransactionHash.String())
}

func recordIndexedTransaction(event *rpc.EmittedEvent) {
	database.AddIndexedTransactionRecord(event.BlockNumber, event.BlockHash.String(), event.TransactionHash.String())
}

func resolveShardTransfer(block uint64) {
	result, err := chain_sn.Account.Events(context.Background(), rpc.EventsInput{
		EventFilter: rpc.EventFilter{
			FromBlock: rpc.BlockID{Number: &block},
			ToBlock:   rpc.BlockID{Number: &block},
			Address:   chain_sn.ShardContractAddress,
			Keys:      [][]*felt.Felt{{utils.GetSelectorFromNameFelt("Transfer")}},
		},
		ResultPageRequest: rpc.ResultPageRequest{ChunkSize: 1000},
	})
	if err != nil {
		// panic(err)
		fmt.Println("err : ", err.Error())
		return
	}

	for _, event := range result.Events {
		if checkIndexedTransaction(&event) {
			continue
		}
		from := event.Event.Keys[1].String()
		to := event.Event.Keys[2].String()
		tokenId := event.Event.Keys[3].Uint64()
		service.UpdateShardFromChain(from, to, tokenId)
	}

	for _, event := range result.Events {
		recordIndexedTransaction(&event)
	}

}

func resolveAscendUpgrade(block uint64) {
	result, err := chain_sn.Account.Events(context.Background(), rpc.EventsInput{
		EventFilter: rpc.EventFilter{
			FromBlock: rpc.BlockID{Number: &block},
			ToBlock:   rpc.BlockID{Number: &block},
			Address:   chain_sn.NekomotoContractAddress,
			Keys:      [][]*felt.Felt{{utils.GetSelectorFromNameFelt("UpgradeAscend")}},
		},
		ResultPageRequest: rpc.ResultPageRequest{ChunkSize: 1000},
	})
	if err != nil {
		// panic(err)
		fmt.Println("err : ", err.Error())
		return
	}
	// fmt.Println("event : ", result.Events)
	for _, event := range result.Events {
		if checkIndexedTransaction(&event) {
			continue
		}
		service.UpdateAscendFromChain(event.Event.Keys[1].String(), event.Event.Data[0].Uint64())

	}

	for _, event := range result.Events {
		recordIndexedTransaction(&event)
	}
}

func resolveBoxUpgrade(block uint64) {
	result, err := chain_sn.Account.Events(context.Background(), rpc.EventsInput{
		EventFilter: rpc.EventFilter{
			FromBlock: rpc.BlockID{Number: &block},
			ToBlock:   rpc.BlockID{Number: &block},
			Address:   chain_sn.NekomotoContractAddress,
			Keys:      [][]*felt.Felt{{utils.GetSelectorFromNameFelt("Upgrade")}},
		},
		ResultPageRequest: rpc.ResultPageRequest{ChunkSize: 1000},
	})
	if err != nil {
		// panic(err)
		fmt.Println("err : ", err.Error())
		return
	}
	for _, event := range result.Events {
		if checkIndexedTransaction(&event) {
			continue
		}
		service.UpdateNekoSpiritByUpgrade(event.Event.Keys[2].Uint64())

	}

	for _, event := range result.Events {
		recordIndexedTransaction(&event)
	}
}

func resolveBoxTransfer(block uint64) {
	result, err := chain_sn.Account.Events(context.Background(), rpc.EventsInput{
		EventFilter: rpc.EventFilter{
			FromBlock: rpc.BlockID{Number: &block},
			ToBlock:   rpc.BlockID{Number: &block},
			Address:   chain_sn.NekomotoContractAddress,
			Keys:      [][]*felt.Felt{{utils.GetSelectorFromNameFelt("Transfer")}},
		},
		ResultPageRequest: rpc.ResultPageRequest{ChunkSize: 1000},
	})
	if err != nil {
		// panic(err)
		fmt.Println("err : ", err.Error())
		return
	}
	// fmt.Println("result: ", result.ContinuationToken)
	// panic("stop")
	for _, event := range result.Events {
		if checkIndexedTransaction(&event) {
			// fmt.Println("continue")
			continue
		}
		from := event.Event.Keys[1].String()
		to := event.Event.Keys[2].String()
		tokenId := event.Event.Keys[3].Uint64()

		service.UpdateNekoSpiritByTransfer(from, to, tokenId)

	}

	for _, event := range result.Events {
		recordIndexedTransaction(&event)
	}
}

func recordIndexerHeight(height uint64, signal <-chan uint64) {

	for {
		select {
		case newHeight := <-signal:
			fmt.Println("[Indexer] newHeight", newHeight)
			if newHeight > height {
				database.UpdateHeight(height)
				height = newHeight
			}
		}
	}

}