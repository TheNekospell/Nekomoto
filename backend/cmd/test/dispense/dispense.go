package main

import (
	"backend/internal/env"
	invoke "backend/internal/invoker"

	"github.com/ethereum/go-ethereum/common"
	"github.com/shopspring/decimal"
)

func main() {

	invoke.SendNekoCoin(common.HexToAddress(env.GetEnvValue("TEST_ADDRESS")), decimal.New(2500000, 18).BigInt())

	invoke.MintPrism(common.HexToAddress(env.GetEnvValue("TEST_ADDRESS")), decimal.New(2500000, 18).BigInt())

	for i := 0; i < 10; i++ {
		invoke.MintShard(common.HexToAddress(env.GetEnvValue("TEST_ADDRESS")))
	}
	
}
