package chain

import (
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/event"
)

type EventHandler interface {
	Handle(eventLog types.Log)
}

type EventProcessor struct {
	handlers map[common.Address]EventHandler
}

func NewEventProcessor() *EventProcessor {
	return &EventProcessor{
		handlers: make(map[common.Address]EventHandler),
	}
}

//func (p *EventProcessor) RegisterHandler(contractAddress common.Address, eventHash string, handler EventHandler) {
//	if p.handlers[contractAddress] == nil {
//		p.handlers[contractAddress] = make(map[common.Hash]EventHandler)
//	}
//	p.handlers[contractAddress][common.HexToHash(eventHash)] = handler
//}

func (p *EventProcessor) RegisterHandler(contractAddress common.Address, handler EventHandler) {
	p.handlers[contractAddress] = handler
}

func (p *EventProcessor) ProcessLog(log types.Log) {
	handler, ok := p.handlers[log.Address]
	if !ok {
		return
	}
	handler.Handle(log)
}

type EventSubscription struct {
	subscription event.Subscription
	eventChannel interface{}
}

type SubscribeFunc[T any] func(opts *bind.WatchOpts, channel chan<- T) (event.Subscription, error)
