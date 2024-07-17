package invoker_sn

import (
	"backend/internal/chain_sn"
	"backend/internal/database"
	"backend/starknet/rpc"
	"backend/starknet/utils"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"

	"math/big"
	"net/http"
	"time"

	"github.com/NethermindEth/juno/core/felt"

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

	SPI := decimal.NewFromUint64(utils.FeltToBigInt(response[3]).Uint64()).Div(decimal.NewFromUint64(100))
	ATK := decimal.NewFromUint64(utils.FeltToBigInt(response[5]).Uint64()).Div(decimal.NewFromUint64(100))
	DEF := decimal.NewFromUint64(utils.FeltToBigInt(response[7]).Uint64()).Div(decimal.NewFromUint64(100))
	SPD := decimal.NewFromUint64(utils.FeltToBigInt(response[9]).Uint64()).Div(decimal.NewFromUint64(100))
	Mana := SPI.Mul(decimal.New(4, -1)).Add(ATK.Mul(decimal.New(3, -1))).Add(DEF.Mul(decimal.New(2, -1))).Add(SPD.Mul(decimal.New(1, -1))).Mul(decimal.New(65, -3))

	return database.ServerNekoSpiritInfo{
		Rarity:  chain_sn.FeltToString(response[0].String()),
		Element: chain_sn.FeltToString(response[1].String()),
		Name:    chain_sn.FeltToString(response[2].String()),
		SPI:     SPI,
		ATK:     ATK,
		DEF:     DEF,
		SPD:     SPD,
		Mana:    Mana,
		Fade:    decimal.NewFromUint64(utils.FeltToBigInt(response[11]).Uint64()).Div(decimal.NewFromUint64(100)),
		Level:   utils.FeltToBigInt(response[15]).Uint64(),
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

	// fmt.Println("response: ", response)

	return response[0].String(), nil

}

func ReadTimeFreeze(address string) (time.Time, error) {

	addressFelt, err := utils.HexToFelt(address)
	if err != nil {
		fmt.Println("address err: ", err.Error())
		return time.Time{}, err
	}

	call := rpc.FunctionCall{
		ContractAddress:    chain_sn.NekomotoContractAddress,
		EntryPointSelector: utils.GetSelectorFromNameFelt("time_freeze_end"),
		Calldata:           []*felt.Felt{addressFelt},
	}

	response, errRpc := chain_sn.Client.Call(context.Background(), call, rpcTag)
	if errRpc != nil {
		fmt.Println(errRpc.Error())
		return time.Time{}, errRpc
	}

	fmt.Println("response: ", response)
	return time.Unix(int64(response[0].Uint64()-uint64(3*24*60*60)), 0), nil
}

func SendCoinAndNFT(to string, nekocoinAmount *big.Int, prismAmount *big.Int, nftAmount *big.Int) error {

	// toFelt, err := utils.HexToFelt(to)
	// if err != nil {
	// 	fmt.Println("address err: ", err.Error())
	// 	return err
	// }

	data := make(map[string]interface{})

	data["to"] = to
	if nekocoinAmount.Cmp(big.NewInt(0)) > 0 {
		data["nekocoin"] = nekocoinAmount
	}
	if prismAmount.Cmp(big.NewInt(0)) > 0 {
		data["prism"] = prismAmount
	}
	if nftAmount.Cmp(big.NewInt(0)) > 0 {
		data["nft"] = nftAmount
	}

	jsonData, err := json.Marshal(data)
	if err != nil {
		fmt.Println("json err: ", err.Error())
		return err
	}

	req, err := http.Post("http://localhost:8973/send", "application/json", bytes.NewReader(jsonData))
	if err != nil {
		fmt.Println("req err: ", err.Error())
		return err
	}

	body, err := io.ReadAll(req.Body)
	if err != nil {
		fmt.Println("body err: ", err.Error())
		return err
	}

	fmt.Println("response: ", string(body))

	// if nekocoinAmount.Cmp(big.NewInt(0)) > 0 {
	// nonce, errRpc := chain_sn.Account.Nonce(context.Background(), rpcTag, chain_sn.Account.AccountAddress)
	// if errRpc != nil {
	// 	fmt.Println("nonce err: ", errRpc.Error())
	// 	return errRpc
	// }

	// invoke := rpc.BroadcastInvokev1Txn{
	// 	InvokeTxnV1: rpc.InvokeTxnV1{
	// 		MaxFee:        chain_sn.MaxFee,
	// 		Version:       rpc.TransactionV1,
	// 		Nonce:         nonce,
	// 		Type:          rpc.TransactionType_Invoke,
	// 		SenderAddress: chain_sn.Account.AccountAddress,
	// 	}}
	// call := rpc.FunctionCall{
	// 	ContractAddress:    chain_sn.NekoCoinContractAddress,
	// 	EntryPointSelector: utils.GetSelectorFromNameFelt("transfer"),
	// 	Calldata:           []*felt.Felt{toFelt, utils.BigIntToFelt(nekocoinAmount), utils.BigIntToFelt(big.NewInt(0))},
	// }

	// invoke.Calldata, err = chain_sn.Account.FmtCalldata([]rpc.FunctionCall{call})
	// if err != nil {
	// 	fmt.Println("calldata err: ", err.Error())
	// 	return err
	// }

	// if err = chain_sn.Account.SignInvokeTransaction(context.Background(), &invoke.InvokeTxnV1); err != nil {
	// 	fmt.Println("sign err: ", err.Error())
	// 	return err
	// }
	// // fmt.Println("invoke: ", invoke)

	// response, errRpc := chain_sn.Account.AddInvokeTransaction(context.Background(), invoke)
	// if errRpc != nil {
	// 	fmt.Println("invoke err: ", errRpc.Error())
	// 	return errRpc
	// }
	// fmt.Println("send neko coin response: ", response)
	// }
	// if prismAmount.Cmp(big.NewInt(0)) > 0 {
	// nonce, errRpc := chain_sn.Account.Nonce(context.Background(), rpcTag, chain_sn.Account.AccountAddress)
	// if errRpc != nil {
	// 	fmt.Println("nonce err: ", errRpc.Error())
	// 	return errRpc
	// }

	// invoke := rpc.BroadcastInvokev1Txn{
	// 	InvokeTxnV1: rpc.InvokeTxnV1{
	// 		MaxFee:        chain_sn.MaxFee,
	// 		Version:       rpc.TransactionV1,
	// 		Nonce:         nonce,
	// 		Type:          rpc.TransactionType_Invoke,
	// 		SenderAddress: chain_sn.Account.AccountAddress,
	// 	}}
	// call := rpc.FunctionCall{
	// 	ContractAddress:    chain_sn.PrismContractAddress,
	// 	EntryPointSelector: utils.GetSelectorFromNameFelt("mint"),
	// 	Calldata:           []*felt.Felt{toFelt, utils.BigIntToFelt(prismAmount), utils.BigIntToFelt(big.NewInt(0))},
	// }

	// invoke.Calldata, err = chain_sn.Account.FmtCalldata([]rpc.FunctionCall{call})
	// if err != nil {
	// 	fmt.Println("calldata err: ", err.Error())
	// 	return err
	// }

	// if err = chain_sn.Account.SignInvokeTransaction(context.Background(), &invoke.InvokeTxnV1); err != nil {
	// 	fmt.Println("sign err: ", err.Error())
	// 	return err
	// }
	// response, errRpc := chain_sn.Account.AddInvokeTransaction(context.Background(), invoke)
	// if errRpc != nil {
	// 	fmt.Println("invoke err: ", errRpc.Error())
	// 	return errRpc
	// }
	// fmt.Println("send prism response: ", response)
	// }
	// if nftAmount.Cmp(big.NewInt(0)) > 0 {
	// nonce, errRpc := chain_sn.Account.Nonce(context.Background(), rpcTag, chain_sn.Account.AccountAddress)
	// if errRpc != nil {
	// 	fmt.Println("nonce err: ", errRpc.Error())
	// 	return errRpc
	// }

	// invoke := rpc.BroadcastInvokev1Txn{
	// 	InvokeTxnV1: rpc.InvokeTxnV1{
	// 		MaxFee:        chain_sn.MaxFee,
	// 		Version:       rpc.TransactionV1,
	// 		Nonce:         nonce,
	// 		Type:          rpc.TransactionType_Invoke,
	// 		SenderAddress: chain_sn.Account.AccountAddress,
	// 	}}
	// call := rpc.FunctionCall{
	// 	ContractAddress:    chain_sn.ShardContractAddress,
	// 	EntryPointSelector: utils.GetSelectorFromNameFelt("mint"),
	// 	Calldata:           []*felt.Felt{toFelt, utils.BigIntToFelt(nftAmount), utils.BigIntToFelt(big.NewInt(0))},
	// }

	// invoke.Calldata, err = chain_sn.Account.FmtCalldata([]rpc.FunctionCall{call})
	// if err != nil {
	// 	fmt.Println("calldata err: ", err.Error())
	// 	return err
	// }

	// if err = chain_sn.Account.SignInvokeTransaction(context.Background(), &invoke.InvokeTxnV1); err != nil {
	// 	fmt.Println("sign err: ", err.Error())
	// 	return err
	// }
	// response, errRpc := chain_sn.Account.AddInvokeTransaction(context.Background(), invoke)
	// if errRpc != nil {
	// 	fmt.Println("invoke err: ", errRpc.Error())
	// 	return errRpc
	// }
	// fmt.Println("send nft response: ", response)
	// }

	return nil

}

func Summon(to string, count *big.Int) (string, error) {

	//// Load variables from '.env' file
	//rpcProviderUrl := ""
	//accountAddress := ""
	//accountCairoVersion := 2
	//privateKey := ""
	//publicKey := ""
	//
	//// Initialize connection to RPC provider
	//client, err := rpc.NewProvider(rpcProviderUrl)
	//if err != nil {
	//	panic(fmt.Sprintf("Error dialing the RPC provider: %s", err))
	//}
	//
	//// Initialize the account memkeyStore (set public and private keys)
	//ks := account.NewMemKeystore()
	//privKeyBI, ok := new(big.Int).SetString(privateKey, 0)
	//if !ok {
	//	panic("Fail to convert privKey to bitInt")
	//}
	//ks.Put(publicKey, privKeyBI)
	//
	//// Here we are converting the account address to felt
	//accountAddressInFelt, err := utils.HexToFelt(accountAddress)
	//if err != nil {
	//	fmt.Println("Failed to transform the account address, did you give the hex address?")
	//	panic(err)
	//}
	//// Initialize the account
	//accnt, err := account.NewAccount(client, accountAddressInFelt, publicKey, ks, accountCairoVersion)
	//if err != nil {
	//	panic(err)
	//}
	//
	//fmt.Println("Established connection with the client")
	//
	//// Getting the nonce from the account
	//nonce, err := accnt.Nonce(context.Background(), rpc.BlockID{Tag: "latest"}, accnt.AccountAddress)
	//if err != nil {
	//	panic(err)
	//}
	//
	//// Building the InvokeTx struct
	//InvokeTx := rpc.BroadcastInvokev1Txn{
	//	InvokeTxnV1: rpc.InvokeTxnV1{
	//		MaxFee:        new(felt.Felt).SetUint64(100000000000000),
	//		Version:       rpc.TransactionV1,
	//		Nonce:         nonce,
	//		Type:          rpc.TransactionType_Invoke,
	//		SenderAddress: accnt.AccountAddress,
	//	}}
	//
	//// Converting the contractAddress from hex to felt
	//contractAddress, err := utils.HexToFelt("")
	//if err != nil {
	//	panic(err)
	//}
	//
	//toFelt, err := utils.HexToFelt("")
	//if err != nil {
	//	fmt.Println("address err: ", err.Error())
	//}
	////amount, _ := utils.HexToFelt("0xffffffff")
	//// Building the functionCall struct, where :
	//FnCall := rpc.FunctionCall{
	//	ContractAddress:    contractAddress,                                                                                                                                                    //contractAddress is the contract that we want to call
	//	EntryPointSelector: utils.GetSelectorFromNameFelt(""),                                                                                                                            //this is the function that we want to call
	//	Calldata:           []*felt.Felt{toFelt, utils.BigIntToFelt(big.NewInt(20)), utils.BigIntToFelt(big.NewInt(0)), utils.BigIntToFelt(big.NewInt(20)), utils.BigIntToFelt(big.NewInt(0))}, //the calldata necessary to call the function. Here we are passing the "amount" value for the "mint" function
	//}
	//
	//// Building the Calldata with the help of FmtCalldata where we pass in the FnCall struct along with the Cairo version
	//InvokeTx.Calldata, err = accnt.FmtCalldata([]rpc.FunctionCall{FnCall})
	//if err != nil {
	//	panic(err)
	//}
	//
	//// Signing of the transaction that is done by the account
	//err = accnt.SignInvokeTransaction(context.Background(), &InvokeTx.InvokeTxnV1)
	//if err != nil {
	//	panic(err)
	//}
	//
	//// After the signing we finally call the AddInvokeTransaction in order to invoke the contract function
	//resp, err := accnt.AddInvokeTransaction(context.Background(), InvokeTx)
	//if err != nil {
	//	panic(err)
	//}
	//
	//fmt.Println("Waiting for the transaction status...")
	//time.Sleep(time.Second * 3) // Waiting 3 seconds
	//
	////Getting the transaction status
	//txStatus, err := client.GetTransactionStatus(context.Background(), resp.TransactionHash)
	//if err != nil {
	//	panic(err)
	//}
	//
	//// This returns us with the transaction hash and status
	//fmt.Printf("Transaction hash response: %v\n", resp.TransactionHash)
	//fmt.Printf("Transaction execution status: %s\n", txStatus.ExecutionStatus)
	//fmt.Printf("Transaction status: %s\n", txStatus.FinalityStatus)

	randomInput := big.NewInt(int64(time.Now().Nanosecond()))
	fmt.Println("[Invoker]build randomInput: ", randomInput)

	// toFelt, err := utils.HexToFelt(to)
	// if err != nil {
	// 	fmt.Println("address err: ", err.Error())
	// 	return "", err
	// }

	// nonce, errRpc := chain_sn.Account.Nonce(context.Background(), rpcTag, chain_sn.Account.AccountAddress)
	// if errRpc != nil {
	// 	fmt.Println("nonce err: ", errRpc.Error())
	// 	return "", errRpc
	// }

	// invoke := rpc.BroadcastInvokev1Txn{
	// 	InvokeTxnV1: rpc.InvokeTxnV1{
	// 		MaxFee:        chain_sn.MaxFee,
	// 		Version:       rpc.TransactionV1,
	// 		Nonce:         nonce,
	// 		Type:          rpc.TransactionType_Invoke,
	// 		SenderAddress: chain_sn.Account.AccountAddress,
	// 	}}
	// call := rpc.FunctionCall{
	// 	ContractAddress:    chain_sn.NekomotoContractAddress,
	// 	EntryPointSelector: utils.GetSelectorFromNameFelt("summon"),
	// 	Calldata:           []*felt.Felt{toFelt, utils.BigIntToFelt(count), utils.BigIntToFelt(big.NewInt(0)), utils.BigIntToFelt(randomInput), utils.BigIntToFelt(big.NewInt(0))},
	// }

	// invoke.Calldata, err = chain_sn.Account.FmtCalldata([]rpc.FunctionCall{call})
	// if err != nil {
	// 	fmt.Println("calldata err: ", err.Error())
	// 	return "", err
	// }

	// if err = chain_sn.Account.SignInvokeTransaction(context.Background(), &invoke.InvokeTxnV1); err != nil {
	// 	fmt.Println("sign err: ", err.Error())
	// 	return "", err
	// }
	// response, errRpc := chain_sn.Account.AddInvokeTransaction(context.Background(), invoke)
	// if errRpc != nil {
	// 	fmt.Println("invoke err: ", errRpc.Error())
	// 	return "", errRpc
	// }
	// fmt.Println("response: ", response)

	data := make(map[string]interface{})
	data["to"] = to
	data["count"] = count
	data["random"] = randomInput
	jsonData, err := json.Marshal(data)
	if err != nil {
		fmt.Println("json err: ", err.Error())
		return "", err
	}

	req, err := http.Post("http://localhost:8973/summon", "application/json", bytes.NewReader(jsonData))
	if err != nil {
		fmt.Println("req err: ", err.Error())
		return "", err
	}

	body, err := io.ReadAll(req.Body)
	if err != nil {
		fmt.Println("read err: ", err.Error())
		return "", err
	}

	fmt.Println("response: ", string(body))
	return string(body), nil
}

func ValidSignature(address *felt.Felt, hash *felt.Felt, r *felt.Felt, s *felt.Felt) error {

	call := rpc.FunctionCall{
		ContractAddress:    address,
		EntryPointSelector: utils.GetSelectorFromNameFelt("is_valid_signature"),
		Calldata:           []*felt.Felt{hash, utils.BigIntToFelt(big.NewInt(2)), r, s},
	}

	response, errRpc := chain_sn.Client.Call(context.Background(), call, rpcTag)
	if errRpc != nil {
		fmt.Println(errRpc.Error())
		return errRpc
	}

	fmt.Println("response:", response)
	return nil

}
