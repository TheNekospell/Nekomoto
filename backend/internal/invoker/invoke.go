package invoke

import (
	"backend/internal/chain"
	"fmt"
	"math/big"
	"time"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
)

func ReadNekoSpiritInfo(tokenId *big.Int, origin bool) (chain.BoxInfo, error) {
	info, err := chain.ContractNekoSpirit.Generate(&bind.CallOpts{}, tokenId, origin)
	if err != nil {
		fmt.Println("Error getting box info: ", err)
		return info, err
	}
	return info, nil
}

func ReadOwnerOfNekoSpirit(tokenId *big.Int) (common.Address, error) {
	owner, err := chain.ContractNekoSpirit.OwnerOf(&bind.CallOpts{}, tokenId)
	if err != nil {
		fmt.Println("Error getting owner: ", err)
		return owner, err
	}
	return owner, nil
}

func SendChestReward(to common.Address, token1Amount *big.Int, token2Amount *big.Int, nftAmount *big.Int) error {
	if token1Amount.Cmp(big.NewInt(0)) > 0 {
		tx, err := chain.ContractNeko.Transfer(chain.Auth, to, token1Amount)
		if err != nil {
			fmt.Println("Send chest reward failed:", err.Error())
			return err
		}
		fmt.Println("Send chest reward success:", tx)
	}
	if token2Amount.Cmp(big.NewInt(0)) > 0 {
		tx, err := chain.ContractPrism.Mint(chain.Auth, to, token2Amount)
		if err != nil {
			fmt.Println("Send chest reward failed:", err.Error())
			return err
		}
		fmt.Println("Send chest reward success:", tx)
	}
	if nftAmount.Cmp(big.NewInt(0)) > 0 {
		tx, err := chain.ContractShard.Mint(chain.Auth, to)
		if err != nil {
			fmt.Println("Send chest reward failed:", err.Error())
			return err
		}
		fmt.Println("Send chest reward success:", tx.Hash())
	}
	return nil
}

func SendNekoCoin(to common.Address, amount *big.Int) error {
	if amount.Cmp(big.NewInt(0)) > 0 {
		tx, err := chain.ContractNeko.Transfer(chain.Auth, to, amount)
		if err != nil {
			fmt.Println("Send Neko Coin failed:", err.Error())
			return err
		}
		fmt.Println("Send Neko Coin success:", tx)
	}
	return nil
}

func Summon(to common.Address, count *big.Int) error {
	randomInput := big.NewInt(int64(time.Now().Nanosecond()))
	fmt.Println("[Invoker]build randomInput: ", randomInput)
	if tx, err := chain.ContractNekoSpirit.Summon(chain.Auth, to, count, randomInput); err != nil {
		fmt.Println("Summon failed:", err)
		return err
	} else {
		fmt.Println("Summon success:", tx)
	}
	return nil
}

// func SummonStarter(to common.Address) error {
// 	if tx, err := chain.ContractNekoSpirit.Summon(chain.Auth, to, big.NewInt(1), big.NewInt(0), true); err != nil {
// 		fmt.Println("SummonStarter failed:", err)
// 		return err
// 	} else {
// 		fmt.Println("SummonStarter success:", tx)
// 	}
// 	return nil
// }

func MintPrism(to common.Address, amount *big.Int) error {
	if tx, err := chain.ContractPrism.Mint(chain.Auth, to, amount); err != nil {
		fmt.Println("Mint Prism failed:", err.Error())
		return err
	} else {
		fmt.Println("Mint Prism success:", tx)
	}
	return nil
}

func MintShard(to common.Address) error {
	if tx, err := chain.ContractShard.Mint(chain.Auth, to); err != nil {
		fmt.Println("Mint Shard failed:", err.Error())
		return err
	} else {
		fmt.Println("Mint Shard success:", tx)
	}
	return nil
}
