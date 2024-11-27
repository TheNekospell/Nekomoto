package indexer_sn

import (
	"backend/internal/chain_sn"
	"backend/internal/database"
	"backend/starknet/rpc"
	"backend/starknet/utils"
	"strconv"

	"backend/internal/server/service"
	"context"
	"fmt"
	"time"

	"github.com/NethermindEth/juno/core/felt"
	"github.com/shopspring/decimal"
)

type RecordType uint8

const (
	None RecordType = iota
	NekoCoinBurn
	ToUse2
	ToUse3
	BoxUpgrade
	BoxTransfer
	BuyScroll
	PrismTransfer
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
			// panic(err)
			fmt.Println("get current block err : ", err.Error())
			time.Sleep(5 * time.Second)
		}
		// fmt.Println("[Indexer] currentBlock", currentBlock)

		lastHeight = database.GetIndexerHeight()
		// fmt.Println("[Indexer] lastHeight", lastHeight)

		for i := lastHeight + 1; i <= currentBlock+1; i++ {
			// now := time.Now()
			resolveBoxTransfer(i)
			// fmt.Println("------------------resolveBoxTransfer cost time: ", time.Since(now)/time.Millisecond)

			// now = time.Now()
			resolveBoxUpgrade(i)
			// fmt.Println("------------------resolveBoxUpgrade cost time: ", time.Since(now)/time.Millisecond)

			// now = time.Now()
			resolveNekoCoinBurn(i)
			// fmt.Println("------------------resolveNekoCoinBurn cost time: ", time.Since(now)/time.Millisecond)

			resolveScroll(i)

			resolvePrismTransfer(i)

			channel <- i

			// time.Sleep(1 * time.Second)

		}

		time.Sleep(100 * time.Millisecond)

	}

}

func checkIndexedTransaction(event *rpc.EmittedEvent, recordType uint8) bool {
	return database.CheckIndexedEvent(event.TransactionHash.String(), recordType)
}

func recordIndexedTransaction(event *rpc.EmittedEvent, recordType uint8) {
	var blockNumber uint64
	if event.BlockNumber > 0 {
		blockNumber = event.BlockNumber
	}
	var blockHash string
	if event.BlockHash != nil {
		blockHash = event.BlockHash.String()
	}
	database.AddIndexedTransactionRecord(blockNumber, blockHash, event.TransactionHash.String(), recordType)
}

func resolveNekoCoinBurn(block uint64) {
	result, err := chain_sn.Account.Events(context.Background(), rpc.EventsInput{
		EventFilter: rpc.EventFilter{
			FromBlock: rpc.BlockID{Number: &block},
			ToBlock:   rpc.BlockID{Number: &block},
			Address:   chain_sn.NekoCoinContractAddress,
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
		if checkIndexedTransaction(&event, uint8(NekoCoinBurn)) {
			continue
		}
		// fmt.Println("event : ", event.Event)
		to := event.Event.Keys[2].String()
		amount := decimal.NewFromBigInt(utils.FeltToBigInt(event.Event.Data[0]), -18)
		if to == chain_sn.EmptyAddressStringShort {
			service.RecordNekoCoinBurn(amount)
		}
	}

	for _, event := range result.Events {
		recordIndexedTransaction(&event, uint8(NekoCoinBurn))
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
		if checkIndexedTransaction(&event, uint8(BoxUpgrade)) {
			continue
		}
		info, recordType := service.UpdateNekoSpiritByUpgrade(event.Event.Keys[2].Uint64(), event.Event.Data[2].Uint64())

		if recordType != database.None {
			recordTransactionForDisplay(info.StakeFromUid, event.TransactionHash.String(), info.Rarity+" Neko #"+strconv.FormatUint(info.TokenId, 10), recordType)
		}

	}

	for _, event := range result.Events {
		recordIndexedTransaction(&event, uint8(BoxUpgrade))
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
		if checkIndexedTransaction(&event, uint8(BoxTransfer)) {
			// fmt.Println("continue")
			continue
		}
		from := event.Event.Keys[1].String()
		to := event.Event.Keys[2].String()
		tokenId := event.Event.Keys[3].Uint64()

		info, recordType := service.UpdateNekoSpiritByTransfer(from, to, tokenId)

		if recordType != database.None {
			recordTransactionForDisplay(info.StakeFromUid, event.TransactionHash.String(), info.Rarity+" Neko #"+strconv.FormatUint(info.TokenId, 10), recordType)
		}

	}

	for _, event := range result.Events {
		recordIndexedTransaction(&event, uint8(BoxTransfer))
	}
}

func resolveScroll(block uint64) {
	result, err := chain_sn.Account.Events(context.Background(), rpc.EventsInput{
		EventFilter: rpc.EventFilter{
			FromBlock: rpc.BlockID{Number: &block},
			ToBlock:   rpc.BlockID{Number: &block},
			Address:   chain_sn.NekomotoContractAddress,
			Keys:      [][]*felt.Felt{{utils.GetSelectorFromNameFelt("BuyCoin")}},
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
		if checkIndexedTransaction(&event, uint8(BuyScroll)) {
			// fmt.Println("continue")
			continue
		}
		address := event.Event.Keys[1].String()
		count := event.Event.Keys[2].Uint64()

		recordTransactionForDisplay(database.GetAddressDetailByAddress(address).Uid, event.TransactionHash.String(), strconv.FormatUint(count, 10), database.BuyScroll)

	}

	for _, event := range result.Events {
		recordIndexedTransaction(&event, uint8(BuyScroll))
	}
}

func resolvePrismTransfer(block uint64) {
	result, err := chain_sn.Account.Events(context.Background(), rpc.EventsInput{
		EventFilter: rpc.EventFilter{
			FromBlock: rpc.BlockID{Number: &block},
			ToBlock:   rpc.BlockID{Number: &block},
			Address:   chain_sn.PrismContractAddress,
			Keys:      [][]*felt.Felt{{utils.GetSelectorFromNameFelt("Transfer")}},
		},
		ResultPageRequest: rpc.ResultPageRequest{ChunkSize: 1000},
	})
	if err != nil {
		// panic(err)
		fmt.Println("err : ", err.Error())
		return
	}
	//fmt.Println("result: ", result.Events)
	// panic("stop")
	for _, event := range result.Events {
		if checkIndexedTransaction(&event, uint8(PrismTransfer)) {
			// fmt.Println("continue")
			continue
		}
		//fmt.Println("event : ", event.Event.Data)
		to := event.Event.Keys[2].String()
		value := event.Event.Data[0].Uint64()

		recordTransactionForDisplay(database.GetAddressDetailByAddress(to).Uid, event.TransactionHash.String(), decimal.NewFromUint64(value).Div(decimal.New(1, 18)).String(), database.Prism)

	}

	for _, event := range result.Events {
		recordIndexedTransaction(&event, uint8(PrismTransfer))
	}
}

func recordIndexerHeight(height uint64, signal <-chan uint64) {

	for newHeight := range signal {
		// fmt.Println("[Indexer] newHeight", newHeight)
		if newHeight > height {
			database.UpdateHeight(height)
			height = newHeight
		}
	}

}

func recordTransactionForDisplay(uid uint64, hash string, obj string, recordType database.RecordType) {

	database.AddServerTransactionRecord(uid, hash, recordType, obj)

}
