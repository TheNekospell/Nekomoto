package chain_sn

import (
	"backend/internal/env"
	"backend/starknet/account"
	"backend/starknet/rpc"
	"backend/starknet/utils"
	"encoding/hex"
	"fmt"
	"math/big"
	"strings"

	"github.com/NethermindEth/juno/core/felt"
)

var (
	Client  *rpc.Provider
	Account *account.Account

	NekomotoContractAddress *felt.Felt
	NekoCoinContractAddress *felt.Felt
	PrismContractAddress    *felt.Felt
	ShardContractAddress    *felt.Felt

	MaxFee                  *felt.Felt
	EmptyAddressStringShort = "0x0"
	HostAddress             = env.GetEnvValue("OWNER_ADDRESS_SN")
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
	//MaxFee = new(felt.Felt).SetUint64(1000000000000000)
	//bigint, _ := new(big.Int).SetString("1000000000000000000000000000000", 10)
	//MaxFee = utils.BigIntToFelt(bigint)
	//MaxFee, err = utils.HexToFelt("0x9184e72a000")
	//if err != nil {
	//	panic(err.Error())
	//}
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
