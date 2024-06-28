package invoker_sn

import (
	"backend/internal/chain_sn"
	"backend/internal/database"
	"math/big"
	"time"

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

func ReadNekoSpiritInfo(tokenId uint64, origin bool) (database.ServerNekoSpiritInfo, error) {

	var tag *felt.Felt
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
		return database.ServerNekoSpiritInfo{}, errRpc
	}
	// fmt.Println("res:", response)
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
		SPI:     decimal.NewFromUint64(response[3].Uint64()).Div(decimal.NewFromUint64(100)),
		ATK:     decimal.NewFromUint64(response[5].Uint64()).Div(decimal.NewFromUint64(100)),
		DEF:     decimal.NewFromUint64(response[7].Uint64()).Div(decimal.NewFromUint64(100)),
		SPD:     decimal.NewFromUint64(response[9].Uint64()).Div(decimal.NewFromUint64(100)),
		Fade:    decimal.NewFromUint64(response[11].Uint64()).Div(decimal.NewFromUint64(100)),
		Level:   response[15].Uint64(),
	}, nil

}

func ReadOwnerOfNekoSpirit(tokenId uint64) (string, error) {

	call := rpc.FunctionCall{
		ContractAddress:    chain_sn.NekomotoContractAddress,
		EntryPointSelector: utils.GetSelectorFromNameFelt("owner_of"),
		Calldata:           []*felt.Felt{utils.BigIntToFelt(big.NewInt(int64(tokenId))), utils.BigIntToFelt(big.NewInt(0))},
	}

	response, errRpc := chain_sn.Client.Call(context.Background(), call, rpcTag)
	if errRpc != nil {
		fmt.Println(errRpc.Error())
		return "", errRpc
	}

	fmt.Println("response: ", response)

	return response[0].String(), nil

}

func SendCoinAndNFT(to string, nekocoinAmount *big.Int, prismAmount *big.Int, nftAmount *big.Int) error {

	toFelt, err := utils.HexToFelt(to)
	if err != nil {
		fmt.Println("address err: ", err.Error())
		return err
	}

	if nekocoinAmount.Cmp(big.NewInt(0)) > 0 {
		nonce, errRpc := chain_sn.Account.Nonce(context.Background(), rpcTag, chain_sn.Account.AccountAddress)
		if errRpc != nil {
			fmt.Println("nonce err: ", errRpc.Error())
			return errRpc
		}

		invoke := rpc.InvokeTxnV1{
			MaxFee:        chain_sn.MaxFee,
			Version:       rpc.TransactionV1,
			Nonce:         nonce,
			Type:          rpc.TransactionType_Invoke,
			SenderAddress: chain_sn.Account.AccountAddress,
		}
		call := rpc.FunctionCall{
			ContractAddress:    chain_sn.NekoCoinContractAddress,
			EntryPointSelector: utils.GetSelectorFromNameFelt("transfer"),
			// Calldata:           []*felt.Felt{toFelt, utils.BigIntToFelt(nekocoinAmount), utils.BigIntToFelt(big.NewInt(0))},
		}

		invoke.Calldata, err = chain_sn.Account.FmtCalldata([]rpc.FunctionCall{call})
		if err != nil {
			fmt.Println("calldata err: ", err.Error())
			return err
		}

		if err = chain_sn.Account.SignInvokeTransaction(context.Background(), &invoke); err != nil {
			fmt.Println("sign err: ", err.Error())
			return err
		}
		// fmt.Println("invoke: ", invoke)

		response, errRpc := chain_sn.Account.AddInvokeTransaction(context.Background(), invoke)
		if errRpc != nil {
			fmt.Println("invoke err: ", errRpc.Error())
			return errRpc
		}
		fmt.Println("send neko coin response: ", response)
	}
	if prismAmount.Cmp(big.NewInt(0)) > 0 {
		nonce, errRpc := chain_sn.Account.Nonce(context.Background(), rpcTag, chain_sn.Account.AccountAddress)
		if errRpc != nil {
			fmt.Println("nonce err: ", errRpc.Error())
			return errRpc
		}

		invoke := rpc.InvokeTxnV1{
			MaxFee:        chain_sn.MaxFee,
			Version:       rpc.TransactionV1,
			Nonce:         nonce,
			Type:          rpc.TransactionType_Invoke,
			SenderAddress: chain_sn.Account.AccountAddress,
		}
		call := rpc.FunctionCall{
			ContractAddress:    chain_sn.PrismContractAddress,
			EntryPointSelector: utils.GetSelectorFromNameFelt("mint"),
			Calldata:           []*felt.Felt{toFelt, utils.BigIntToFelt(prismAmount), utils.BigIntToFelt(big.NewInt(0))},
		}

		invoke.Calldata, err = chain_sn.Account.FmtCalldata([]rpc.FunctionCall{call})
		if err != nil {
			fmt.Println("calldata err: ", err.Error())
			return err
		}

		if err = chain_sn.Account.SignInvokeTransaction(context.Background(), &invoke); err != nil {
			fmt.Println("sign err: ", err.Error())
			return err
		}
		response, errRpc := chain_sn.Account.AddInvokeTransaction(context.Background(), invoke)
		if errRpc != nil {
			fmt.Println("invoke err: ", errRpc.Error())
			return errRpc
		}
		fmt.Println("send prism response: ", response)
	}
	if nftAmount.Cmp(big.NewInt(0)) > 0 {
		nonce, errRpc := chain_sn.Account.Nonce(context.Background(), rpcTag, chain_sn.Account.AccountAddress)
		if errRpc != nil {
			fmt.Println("nonce err: ", errRpc.Error())
			return errRpc
		}

		invoke := rpc.InvokeTxnV1{
			MaxFee:        chain_sn.MaxFee,
			Version:       rpc.TransactionV1,
			Nonce:         nonce,
			Type:          rpc.TransactionType_Invoke,
			SenderAddress: chain_sn.Account.AccountAddress,
		}
		call := rpc.FunctionCall{
			ContractAddress:    chain_sn.ShardContractAddress,
			EntryPointSelector: utils.GetSelectorFromNameFelt("mint"),
			Calldata:           []*felt.Felt{toFelt, utils.BigIntToFelt(nftAmount), utils.BigIntToFelt(big.NewInt(0))},
		}

		invoke.Calldata, err = chain_sn.Account.FmtCalldata([]rpc.FunctionCall{call})
		if err != nil {
			fmt.Println("calldata err: ", err.Error())
			return err
		}

		if err = chain_sn.Account.SignInvokeTransaction(context.Background(), &invoke); err != nil {
			fmt.Println("sign err: ", err.Error())
			return err
		}
		response, errRpc := chain_sn.Account.AddInvokeTransaction(context.Background(), invoke)
		if errRpc != nil {
			fmt.Println("invoke err: ", errRpc.Error())
			return errRpc
		}
		fmt.Println("send nft response: ", response)
	}

	return nil

}

func Summon(to string, count *big.Int) error {
	randomInput := big.NewInt(int64(time.Now().Nanosecond()))
	fmt.Println("[Invoker]build randomInput: ", randomInput)

	toFelt, err := utils.HexToFelt(to)
	if err != nil {
		fmt.Println("address err: ", err.Error())
		return err
	}

	nonce, errRpc := chain_sn.Account.Nonce(context.Background(), rpcTag, chain_sn.Account.AccountAddress)
	if errRpc != nil {
		fmt.Println("nonce err: ", errRpc.Error())
		return errRpc
	}

	invoke := rpc.InvokeTxnV1{
		MaxFee:        chain_sn.MaxFee,
		Version:       rpc.TransactionV1,
		Nonce:         nonce,
		Type:          rpc.TransactionType_Invoke,
		SenderAddress: chain_sn.Account.AccountAddress,
	}
	call := rpc.FunctionCall{
		ContractAddress:    chain_sn.NekomotoContractAddress,
		EntryPointSelector: utils.GetSelectorFromNameFelt("summon"),
		Calldata:           []*felt.Felt{toFelt, utils.BigIntToFelt(count), utils.BigIntToFelt(big.NewInt(0)), utils.BigIntToFelt(randomInput), utils.BigIntToFelt(big.NewInt(0))},
	}

	invoke.Calldata, err = chain_sn.Account.FmtCalldata([]rpc.FunctionCall{call})
	if err != nil {
		fmt.Println("calldata err: ", err.Error())
		return err
	}

	if err = chain_sn.Account.SignInvokeTransaction(context.Background(), &invoke); err != nil {
		fmt.Println("sign err: ", err.Error())
		return err
	}
	response, errRpc := chain_sn.Account.AddInvokeTransaction(context.Background(), invoke)
	if errRpc != nil {
		fmt.Println("invoke err: ", errRpc.Error())
		return errRpc
	}
	fmt.Println("response: ", response)

	return nil
}

