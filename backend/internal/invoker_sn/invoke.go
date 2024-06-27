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
	"github.com/shopspring/decimal"
)

var (
	rpcTag rpc.BlockID = rpc.BlockID{Tag: "latest"}
)

func init() {

	ReadNekoSpiritInfo(1, false)

}

func ReadNekoSpiritInfo(tokenId uint64, origin bool) (database.ServerNekoSpiritInfo, error) {

	var tag *felt.Felt
	var err error
	if origin {
		tag, _ = utils.HexToFelt("0x1")
	} else {
		tag, _ = utils.HexToFelt("0x0")
	}

	call := rpc.FunctionCall{
		ContractAddress:    chain_sn.NekomotoContractAddress,
		EntryPointSelector: utils.GetSelectorFromNameFelt("generate"),
		Calldata:           []*felt.Felt{utils.BigIntToFelt(big.NewInt(int64(tokenId))), utils.BigIntToFelt(big.NewInt(0)), tag},
	}

	response, errRpc := chain_sn.Client.Call(context.Background(), call, rpcTag)
	if errRpc != nil {
		fmt.Println(errRpc.Error())
		return database.ServerNekoSpiritInfo{}, err
	}
	fmt.Println("res:", response)
	// fmt.Println("text: ", response[0].Text(16))
	// fmt.Println("string: ", response[0].String())
	// fmt.Println("short string: ", response[0].ShortString())
	// fmt.Println("64: ", response[0].Uint64())
	// text:  556e636f6d6d6f6e
	// string:  0x556e636f6d6d6f6e
	// short string:  0x556e...6f6e
	// 64:  6155967070890454894

	return database.ServerNekoSpiritInfo{
		Rarity:  chain_sn.FeltToString(response[0].String()),
		Element: chain_sn.FeltToString(response[1].String()),
		Name:    chain_sn.FeltToString(response[2].String()),
		SPI:     decimal.NewFromUint64(response[3].Uint64()),
		ATK:     decimal.NewFromUint64(response[5].Uint64()),
		DEF:     decimal.NewFromUint64(response[7].Uint64()),
		SPD:     decimal.NewFromUint64(response[9].Uint64()),
		Fade:    decimal.NewFromUint64(response[11].Uint64()),
		Level:   response[15].Uint64(),
	}, nil

}

func ReadOwnerOfNekoSpirit(tokenId uint64) string {

	

}
