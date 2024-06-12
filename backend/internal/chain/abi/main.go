package main

import (
	"fmt"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"log"
	"os"
	"strings"
)

// list all events in abi. generate the event hash use in eventlistener.registerHandlers()
func main() {
	files := []string{"spirit", "neko", "prism", "shard"}
	for _, file := range files {
		abiContent, err := os.ReadFile(fmt.Sprintf("./internal/chain/abi/%s.abi", file))
		if err != nil {
			log.Fatalf("Error reading ABI file: %v", err)
		}

		contractAbi, err := abi.JSON(strings.NewReader(string(abiContent)))
		if err != nil {
			log.Fatalf("Error parsing ABI: %v", err)
		}

		//fmt.Printf("\nContract %s\n", file)
		fmt.Printf("// Contract %s\n", file)
		for name, event := range contractAbi.Events {
			//fmt.Printf("%s Event %s: %s\n", file, name, event.ID.Hex())
			fmt.Printf("event%s%s = \"%s\"\n", file, name, event.ID.Hex())
		}
	}

}

// abigen --abi ./internal/chain/abi/spirit.abi --pkg chain --type Spirit --out ./internal/chain/spirit.go