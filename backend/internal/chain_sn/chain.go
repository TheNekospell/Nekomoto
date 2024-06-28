package chain_sn

import (
	"backend/internal/env"
	"encoding/hex"
	"fmt"
	"math/big"
	"strings"

	"github.com/NethermindEth/juno/core/felt"
	"github.com/NethermindEth/starknet.go/account"
	"github.com/NethermindEth/starknet.go/rpc"
	"github.com/NethermindEth/starknet.go/utils"
)

var (
	Client  *rpc.Provider
	Account *account.Account

	NekomotoContractAddress *felt.Felt
	NekoCoinContractAddress *felt.Felt
	PrismContractAddress    *felt.Felt
	ShardContractAddress    *felt.Felt

	MaxFee *felt.Felt
	EmptyAddressStringShort = "0x0"
	HostAddress = env.GetEnvValue("OWNER_ADDRESS_SN")
)

func init() {
	var err error

	NekomotoContractAddress, err = utils.HexToFelt(env.GetEnvValue("BOX_CONTRACT_SN"))
	if err != nil {
		panic(err.Error())
	}
	NekoCoinContractAddress, err = utils.HexToFelt(env.GetEnvValue("NEKO_CONTRACT_SN"))
	if err != nil {
		panic(err.Error())
	}
	PrismContractAddress, err = utils.HexToFelt(env.GetEnvValue("PRISM_CONTRACT_SN"))
	if err != nil {
		panic(err.Error())
	}
	ShardContractAddress, err = utils.HexToFelt(env.GetEnvValue("SHARD_CONTRACT_SN"))
	if err != nil {
		panic(err.Error())
	}

	Client, err = rpc.NewProvider(env.GetEnvValue("RPC_URL_SN"))
	if err != nil {
		panic(err.Error())
	}

	address, err := utils.HexToFelt(env.GetEnvValue("OWNER_ADDRESS_SN"))
	if err != nil {
		panic(err.Error())
	}

	publicKey := env.GetEnvValue("PUBLIC_KEY_SN")
	privateKey, ok := new(big.Int).SetString(env.GetEnvValue("PRIVATE_KEY_SN"), 0)
	if !ok {
		panic("invalid private key")
	}

	ks := account.NewMemKeystore()
	ks.Put(publicKey, privateKey)

	Account, err = account.NewAccount(Client, address, publicKey, ks, 2)
	if err != nil {
		panic(err.Error())
	}

	MaxFee = utils.Uint64ToFelt(10000000000000000)
}

func FeltToString(hexOrigin string) string {

	hexOrigin = strings.TrimPrefix(hexOrigin, "0x")

	hexBytes, err := hex.DecodeString(hexOrigin)
	if err != nil {
		fmt.Println("err in felt to string:", err.Error())
		return ""
	}

	str := string(hexBytes)
	// fmt.Println("str: ", str)
	return str

}
