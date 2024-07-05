package indexer_sn

import (
	"backend/internal/chain_sn"
	"backend/internal/database"

	"backend/internal/server/service"
	"context"
	"fmt"
	"time"

	"github.com/NethermindEth/juno/core/felt"
	"github.com/NethermindEth/starknet.go/rpc"
	"github.com/NethermindEth/starknet.go/utils"
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

			time.Sleep(2 * time.Second)

		}

		time.Sleep(10 * time.Second)

	}

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
		fmt.Println("err: ", err.Code, err.Message, err.Data)
		return
	}

	for _, event := range result.Events {
		from := event.Event.Keys[1].String()
		to := event.Event.Keys[2].String()
		tokenId := event.Event.Keys[3].Uint64()
		service.UpdateShardFromChain(from, to, tokenId)
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
		fmt.Println("err: ", err.Code, err.Message, err.Data)
		return
	}
	for _, event := range result.Events {

		service.UpdateAscendFromChain(event.Event.Keys[2].String(), event.Event.Data[0].Uint64())

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
		fmt.Println("err: ", err.Code, err.Message, err.Data)
		return
	}
	for _, event := range result.Events {

		service.UpdateNekoSpiritByUpgrade(event.Event.Keys[2].Uint64())

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
		fmt.Println("err: ", err.Code, err.Message, err.Data)
		return
	}
	// fmt.Println("result: ", result)
	for _, event := range result.Events {

		from := event.Event.Keys[1].String()
		to := event.Event.Keys[2].String()
		tokenId := event.Event.Keys[3].Uint64()

		service.UpdateNekoSpiritByTransfer(from, to, tokenId)

	}
}

func recordIndexerHeight(height uint64, signal <-chan uint64) {

	for {
		select {
		case newHeight := <-signal:
			// fmt.Println("[Indexer] newHeight", newHeight)
			if newHeight > height {
				database.UpdateHeight(height)
				height = newHeight
			}
		}
	}

}
