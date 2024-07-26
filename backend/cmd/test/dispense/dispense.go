package main

import (
	"fmt"
	"strings"
)

// "backend/internal/env"
// invoke "backend/internal/invoker"

// "github.com/ethereum/go-ethereum/common"
// "github.com/shopspring/decimal"

func main() {

	// invoke.SendNekoCoin(common.HexToAddress(env.GetEnvValue("TEST_ADDRESS")), decimal.New(2500000, 18).BigInt())

	// invoke.MintPrism(common.HexToAddress(env.GetEnvValue("TEST_ADDRESS")), decimal.New(2500000, 18).BigInt())

	// for i := 0; i < 10; i++ {
	// 	invoke.MintShard(common.HexToAddress(env.GetEnvValue("TEST_ADDRESS")))
	// }

	address := "0x2e05aea2819bcd04d59d291c5d65273b8f426956c2b9c000a605280b9aa587"
	fmt.Println(len(address))

	if len(address) >= 66 {
		address = "0x" + address[len(address)-63:]
	}
	fmt.Println(address)

	if len(address) < 65 {
		address = "0x" + strings.Repeat("0", 65-len(address)) + address[2:]
	}
	fmt.Println(address)

}
