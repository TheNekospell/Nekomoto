package chain

import (
	"backend/internal/env"
	"encoding/hex"
	"fmt"
	"log"
	"math/big"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
)

var (
	Client *ethclient.Client
	Auth   *bind.TransactOpts

	OwnerAddress      = common.HexToAddress(env.GetEnvValue("OWNER_ADDRESS"))
	EmptyAddress      = common.HexToAddress("0x0000000000000000000000000000000000000000")
	EmptyAddressInHex = "0x0000000000000000000000000000000000000000"

	ContractNekoSpiritAddress   = common.HexToAddress(env.GetEnvValue("BOX_CONTRACT"))
	ContractNekoAddress  = common.HexToAddress(env.GetEnvValue("NEKO_CONTRACT"))
	ContractPrismAddress = common.HexToAddress(env.GetEnvValue("PRISM_CONTRACT"))
	ContractShardAddress = common.HexToAddress(env.GetEnvValue("SHARD_CONTRACT"))

	ContractNekoSpirit   *Spirit
	ContractNeko  *Neko
	ContractPrism *Prism
	ContractShard *Shard

	Processor = NewEventProcessor()

	// Contract box
	eventboxApprovalForAll = common.HexToHash("0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31")
	eventboxSummon         = common.HexToHash("0xf2c33f510a56fb8a1a188f0dde2ae413536b05a3d5db693f1881548df8794949")
	eventboxTimeFreeze     = common.HexToHash("0xe45be87d2d2aa093c931eda59de7d0643b76fdfe8e59f89edf402eacdbdd1384")
	eventboxTransfer       = common.HexToHash("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef")
	eventboxUpgrade        = common.HexToHash("0xa0ad55fd11cc19ae2402e185f0103dc5a70da0930212e8db8d1b5020fa15728c")
	eventboxUpgradeAscend  = common.HexToHash("0xf7bcaca06e1a63376378ab09a4c6c9a5ff0eb588f4ac9376c5a5a495d69d086f")
	eventboxApproval       = common.HexToHash("0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925")
	// Contract neko
	eventnekoApproval = common.HexToHash("0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925")
	eventnekoTransfer = common.HexToHash("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef")
	// Contract prism
	eventprismApproval = common.HexToHash("0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925")
	eventprismTransfer = common.HexToHash("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef")
	// Contract shard
	eventshardApprovalForAll = common.HexToHash("0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31")
	eventshardTransfer       = common.HexToHash("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef")
	eventshardApproval       = common.HexToHash("0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925")


	// todo
)

func init() {
	var err error
	Client, err = ethclient.Dial(env.GetEnvValue("RPC_URL"))
	if err != nil {
		panic(err)
	}

	fmt.Println("Connected to chain")

	ContractNekoSpirit, err = NewSpirit(ContractNekoSpiritAddress, Client)
	fmt.Println("ContractNekoSpiritAddress", ContractNekoSpiritAddress)
	if err != nil {
		log.Fatal("Error creating new NekoSpirit contract: ", err)
	}
	ContractNeko, err = NewNeko(ContractNekoAddress, Client)
	fmt.Println("ContractNekoAddress", ContractNekoAddress)
	if err != nil {
		log.Fatal("Error creating new Neko contract: ", err)
	}
	ContractPrism, err = NewPrism(ContractPrismAddress, Client)
	fmt.Println("ContractPrismAddress", ContractPrismAddress)
	if err != nil {
		log.Fatal("Error creating new Prism contract: ", err)
	}
	ContractShard, err = NewShard(ContractShardAddress, Client)
	fmt.Println("ContractShardAddress", ContractShardAddress)
	if err != nil {
		log.Fatal("Error creating new Shard contract: ", err)
	}

	privateKey, _ := crypto.HexToECDSA(env.GetEnvValue("PRIVATE_KEY"))
	chainId, _ := big.NewInt(0).SetString(env.GetEnvValue("CHAIN_ID"), 10)
	Auth, _ = bind.NewKeyedTransactorWithChainID(privateKey, chainId)

}

func CalculateEventSignature(eventSignature string) string {

	signature := crypto.Keccak256([]byte(eventSignature))

	signatureHex := hex.EncodeToString(signature)
	return signatureHex

}
