package indexer

import (
	"backend/internal/chain"
	"backend/internal/database"
	"backend/internal/server/service"
	"context"
	"fmt"
	"log"
	"math/big"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
)

var (
	Processor = chain.NewEventProcessor()

	// Contract box
	eventboxApprovalForAll = common.HexToHash("0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31")
	eventboxSummon         = common.HexToHash("0xf2c33f510a56fb8a1a188f0dde2ae413536b05a3d5db693f1881548df8794949")
	eventboxTimeFreeze     = common.HexToHash("0xe45be87d2d2aa093c931eda59de7d0643b76fdfe8e59f89edf402eacdbdd1384")
	eventboxTransfer       = common.HexToHash("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef")
	eventboxUpgrade        = common.HexToHash("0xa0ad55fd11cc19ae2402e185f0103dc5a70da0930212e8db8d1b5020fa15728c")
	eventboxUpgradeAscend  = common.HexToHash("0xf7bcaca06e1a63376378ab09a4c6c9a5ff0eb588f4ac9376c5a5a495d69d086f")
	eventboxApproval       = common.HexToHash("0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925")
	// Contract neko
	eventnekoApproval = common.HexToHash("0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925")
	eventnekoTransfer = common.HexToHash("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef")
	// Contract prism
	eventprismApproval = common.HexToHash("0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925")
	eventprismTransfer = common.HexToHash("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef")
	// Contract shard
	eventshardApprovalForAll = common.HexToHash("0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31")
	eventshardTransfer       = common.HexToHash("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef")
	eventshardApproval       = common.HexToHash("0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925")
)

func init() {

	//Processor.RegisterHandler(ContractNekoSpiritAddress, eventboxApproval, &EventHandlerNekoSpiritApproval{})
	Processor.RegisterHandler(chain.ContractNekoSpiritAddress, &EventHandlerNekoSpirit{})
	Processor.RegisterHandler(chain.ContractNekoSpiritAddress, &EventHandlerNekoSpirit{})
	Processor.RegisterHandler(chain.ContractNekoSpiritAddress, &EventHandlerNekoSpirit{})
	Processor.RegisterHandler(chain.ContractNekoSpiritAddress, &EventHandlerNekoSpirit{})
	Processor.RegisterHandler(chain.ContractNekoSpiritAddress, &EventHandlerNekoSpirit{})
	//Processor.RegisterHandler(ContractNekoAddress, eventnekoApproval, &EventHandlerNekoApproval{})
	Processor.RegisterHandler(chain.ContractNekoAddress, &EventHandlerNeko{})
	//Processor.RegisterHandler(ContractPrismAddress, eventprismApproval, &EventHandlerPrismApproval{})
	Processor.RegisterHandler(chain.ContractPrismAddress, &EventHandlerPrism{})
	//Processor.RegisterHandler(ContractShardAddress, eventshardApprovalForAll, &EventHandlerShardApprovalForAll{})
	Processor.RegisterHandler(chain.ContractShardAddress, &EventHandlerShard{})
	//Processor.RegisterHandler(ContractShardAddress, eventshardApproval, &EventHandlerShardApproval{})

	fmt.Println("Indexer initialized")

}

func StartIndexer() {

	address := []common.Address{
		chain.ContractNekoSpiritAddress,
		chain.ContractNekoAddress,
		chain.ContractPrismAddress,
		chain.ContractShardAddress,
	}

	historyLogs, logs := make(chan types.Log), make(chan types.Log, 2000)

	// history block
	endBlock, err := chain.Client.BlockNumber(context.Background())
	if err != nil {
		log.Fatal("Error getting block number: ", err)
	}

	lastHeight := database.GetIndexerHeight()
	go sendHistoryEvents(lastHeight, endBlock, address, historyLogs)

	// current block
	fmt.Println("Start subscribing ...")
	sub, err := chain.Client.SubscribeFilterLogs(context.Background(), ethereum.FilterQuery{
		Addresses: address,
	}, logs)
	if err != nil {
		log.Fatal("Error subscribing: ", err)
	}

	for {
		select {
		case vLog, ok := <-historyLogs:
			if !ok {
				historyLogs = nil
				fmt.Println("Process history block [done]")
			} else {
				processLog(vLog)
			}
		case err := <-sub.Err():
			fmt.Println("Error subscribing: ", err)
		case vLog := <-logs:
			if historyLogs == nil {
				processLog(vLog)
			}
		}
	}

}

func processLog(vLog types.Log) {
	fmt.Println(" ")
	fmt.Println("-------------- Received log: ", vLog.Topics[0])
	Processor.ProcessLog(vLog)
	database.UpdateHeight(vLog.BlockNumber)
	fmt.Println(" ")
}

func sendHistoryEvents(startBlock uint64, endBlock uint64, address []common.Address, historyLogs chan<- types.Log) {
	if startBlock < endBlock {
		fmt.Println("Processing history block: ", "Start block:", startBlock, "End block:", endBlock)
		logs, err := chain.Client.FilterLogs(context.Background(), ethereum.FilterQuery{
			FromBlock: big.NewInt(int64(startBlock)),
			ToBlock:   big.NewInt(int64(endBlock)),
			Addresses: address,
		})
		fmt.Println("logs size: ", len(logs))
		if err != nil {
			log.Fatal("Error getting logs: ", err)
		}
		for _, vLog := range logs {
			historyLogs <- vLog
		}
	}
	close(historyLogs)
}

type EventHandlerNekoSpirit struct{}

func (e *EventHandlerNekoSpirit) Handle(eventLog types.Log) {
	switch eventLog.Topics[0] {

	case eventboxTransfer:

		event, err := chain.ContractNekoSpirit.ParseTransfer(eventLog)
		if err != nil {
			return
		}
		err = database.SaveEventNekoSpiritTransfer(event)
		if err != nil {
			return
		}
		service.UpdateNekoSpiritByTransfer(event.TokenId, event.To)

	case eventboxUpgrade:

		event, err := chain.ContractNekoSpirit.ParseUpgrade(eventLog)
		if err != nil {
			return
		}
		err = database.SaveEventNekoSpiritUpgrade(event)
		if err != nil {
			return
		}
		service.UpdateNekoSpiritByUpgrade(event.TokenId)

	case eventboxUpgradeAscend:

		event, err := chain.ContractNekoSpirit.ParseUpgradeAscend(eventLog)
		if err != nil {
			return
		}
		err = database.SaveEventNekoSpiritUpgradeAscend(event)
		if err != nil {
			return
		}
		service.UpdateAscendFromChain(event.Sender, event.NewLevel)

		// todo case

	}
}

type EventHandlerNeko struct{}

func (e *EventHandlerNeko) Handle(eventLog types.Log) {
	switch eventLog.Topics[0] {
	}
}

type EventHandlerPrism struct{}

func (e *EventHandlerPrism) Handle(eventLog types.Log) {
	switch eventLog.Topics[0] {
	}
}

type EventHandlerShard struct{}

func (e *EventHandlerShard) Handle(eventLog types.Log) {
	switch eventLog.Topics[0] {
	case eventshardTransfer:

		event, err := chain.ContractShard.ParseTransfer(eventLog)
		if err != nil {
			return
		}

		err = database.SaveEventShardTransfer(event)
		if err != nil {
			return
		}

		if event.From == chain.EmptyAddress || event.To == chain.EmptyAddress {
			service.UpdateShardFromChain(event)
		}

	}
}
