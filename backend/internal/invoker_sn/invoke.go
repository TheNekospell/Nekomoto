package invoker_sn

import (
	"backend/internal/chain_sn"
	"backend/internal/database"
	"math/big"

	"context"
	"fmt"

	"github.com/NethermindEth/juno/core/felt"
	"github.com/NethermindEth/starknet.go/rpc"
	"github.com/NethermindEth/starknet.go/utils"
)

var (
	rpcTag rpc.BlockID = rpc.BlockID{Tag: "latest"}
)

func init() {

	ReadNekoSpiritInfo(1, false)

}

func ReadNekoSpiritInfo(tokenId uint64, origin bool) (database.ServerNekoSpiritInfo, error) {

	var tag int64 = 0
	if origin {
		tag = 1
	}
	call := rpc.FunctionCall{
		ContractAddress:    chain_sn.NekomotoContractAddress,
		EntryPointSelector: utils.GetSelectorFromNameFelt("generate"),
		Calldata:           []*felt.Felt{utils.BigIntToFelt(big.NewInt(int64(tokenId))), utils.BigIntToFelt(big.NewInt(tag))},
	}

	response, err := chain_sn.Client.Call(context.Background(), call, rpcTag)
	if err != nil {
		fmt.Println(err.Error())
		return database.ServerNekoSpiritInfo{}, err
	}

	fmt.Println("res:", response)

	return database.ServerNekoSpiritInfo{}, nil
}
