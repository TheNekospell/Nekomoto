package database

import (
	"backend/internal/util"
	"errors"
	"fmt"
	"github.com/patrickmn/go-cache"
	"strconv"

	"time"

	"gorm.io/gorm"

	"github.com/shopspring/decimal"
)

var (
	Cache               = cache.New(-1, -1)
	CacheTagUid         = "uid"
	CacheTagAddress     = "address"
	CacheTagNekoSpirit  = "NekoSpirit"
	CacheAllocate       = "allocate"
	CacheTagChestConfig = "chestConfig"
	CacheSignature      = "signature"
)

type AddressInfo struct {
	Uid                    uint64
	Address                string
	IsStarter              bool
	Active                 bool
	NekoSpiritIdList       []uint64
	NekoSpiritList         []ServerNekoSpiritInfo
	MintPoolToClaim        decimal.Decimal
	MintPoolCurrentReward  decimal.Decimal
	StakePoolToClaim       decimal.Decimal
	StakePoolCurrentReward decimal.Decimal
	EstMintPoolReward      decimal.Decimal
	EstStakePoolReward     decimal.Decimal
	MyPower                decimal.Decimal
	MyLuck                 uint64
	MySSR                  uint64
	MyUR                   uint64
	StaticEpoch            uint64
	StaticMintPool         decimal.Decimal
	StaticTotalLuck        decimal.Decimal
	StaticStakePool        decimal.Decimal
	StaticTotalPower       decimal.Decimal
	TransactionHistory     []ServerTransactionRecord
}

func GetAddressDetailByUid(uid uint64) AddressInfo {

	var serverAddress ServerAddress
	DB.Where("id = ?", uid).Find(&serverAddress)

	epoch, mintPool, stakePool, totalLuck, totalPower := GetStatic()

	var NekoSpiritList []ServerNekoSpiritInfo
	DB.Model(&ServerNekoSpiritInfo{}).Where("stake_from_uid = ?", uid).Find(&NekoSpiritList)
	stakePoolToClaim := decimal.Zero
	mintPoolToClaim := decimal.Zero
	var idList []uint64
	var myLuck, mySSR, myUR uint64
	var myPower decimal.Decimal
	for _, spirit := range NekoSpiritList {
		stakePoolToClaim = stakePoolToClaim.Add(spirit.Rewards)
		mintPoolToClaim = mintPoolToClaim.Add(spirit.MintRewards)
		idList = append(idList, spirit.TokenId)
		if spirit.Epoch == epoch {
			if spirit.Rarity == "SSR" {
				mySSR++
				myLuck += 1
			}
			if spirit.Rarity == "UR" {
				myUR++
				myLuck += 3
			}
		}
		if spirit.IsStaked {
			myPower = myPower.Add(spirit.ATK)
		}
	}

	estMintPoolReward := decimal.Zero
	if !totalLuck.Equal(decimal.Zero) {
		estMintPoolReward = mintPool.Mul(decimal.NewFromUint64(myLuck).Div(totalLuck))
	}

	estStakePoolReward := decimal.Zero
	if !totalPower.Equal(decimal.Zero) {
		estStakePoolReward = stakePool.Mul(myPower.Div(totalPower))
	}

	var transactionHistory []ServerTransactionRecord
	DB.Model(&ServerTransactionRecord{}).Where("uid = ?", uid).Order("created_at desc").Find(&transactionHistory)

	result := AddressInfo{
		Uid:                uid,
		Address:            serverAddress.Address,
		IsStarter:          serverAddress.IsStarter,
		Active:             serverAddress.Active,
		NekoSpiritIdList:   idList,
		NekoSpiritList:     NekoSpiritList,
		StaticTotalPower:   totalPower,
		StaticStakePool:    stakePool,
		StaticTotalLuck:    totalLuck,
		StaticMintPool:     mintPool,
		StakePoolToClaim:   stakePoolToClaim.Div(decimal.New(10, 18)),
		MintPoolToClaim:    mintPoolToClaim.Div(decimal.New(10, 18)),
		StaticEpoch:        epoch,
		MyPower:            myPower,
		MyLuck:             myLuck,
		MySSR:              mySSR,
		MyUR:               myUR,
		EstMintPoolReward:  estMintPoolReward,
		EstStakePoolReward: estStakePoolReward,
		TransactionHistory: transactionHistory,
	}

	//Cache.Set(CacheTagUid+strconv.FormatUint(uid, 10), result, -1)
	// fmt.Println("Rebuild cache for uid:", uid, "Result:", result)
	return result
}

func GetStatic() (uint64, decimal.Decimal, decimal.Decimal, decimal.Decimal, decimal.Decimal) {

	// !! cache !!

	rewardPool := GetRewardPool()
	epoch := GetEpoch()

	totalLuck := decimal.Zero
	DB.Model(&ServerNekoSpiritInfo{}).Where("epoch = ?", epoch).Select("ifnull(sum(case when rarity = 'SSR' then 1 when rarity = 'UR' then 3 else 0 end),0) as total_luck").Scan(&totalLuck)

	totalPower := decimal.Zero
	DB.Model(&ServerNekoSpiritInfo{}).Where("is_staked = ?", true).Select("ifnull(sum(atk),0) as total_power").Scan(&totalPower)

	return epoch, rewardPool.MintPool.Div(decimal.New(10, 18)), rewardPool.StakePool.Div(decimal.New(10, 18)), totalLuck, totalPower
}

func GetAddressDetailByAddress(address string) AddressInfo {
	if uid, found := Cache.Get(CacheTagAddress + address); found {
		return GetAddressDetailByUid(uid.(uint64))
	}
	if uid, err := GetUidByAddress(address); err == nil {
		// Cache.Set(CacheTagAddress+address, uid, -1)
		return GetAddressDetailByUid(uid)
	} else if errors.Is(err, gorm.ErrRecordNotFound) {
		return GetAddressDetailByUid(CreateAddressInfo(address))
	}
	return AddressInfo{}
}

func GetAddressDetailByInviteCode(inviteCode string) AddressInfo {
	if uid, found := Cache.Get(CacheTagAddress + inviteCode); found {
		return GetAddressDetailByUid(uid.(uint64))
	}
	if uid, err := GetUidByInviteCode(inviteCode); err == nil {
		Cache.Set(CacheTagAddress+inviteCode, uid, -1)
		return GetAddressDetailByUid(uid)
	}
	return AddressInfo{}
}

func CreateAddressInfo(address string) uint64 {

	address = util.CleanAddress(address)

	// uid -> address
	uid, err := CreateAddress(&ServerAddress{
		Address:    address,
		InviteCode: "neko-" + strconv.Itoa(time.Now().Nanosecond())[:5] + address[len(address)-3:],
		IsStarter:  true,
		Active:     true,
	})
	if err != nil {
		panic(err)
	}
	// uid -> buff
	//_ = CreateBuffRecord(&ServerBuffRecord{
	//	Uid:   uid,
	//	Level: 0,
	//	Boost: decimal.NewFromInt(0),
	//})
	// uid -> invitation reward static
	//CreateInvitationRewardStatic(uid)
	fmt.Println("[Server] Create address info for address:", address, "uid:", uid)
	return uid
}

func GetNekoSpiritListByIdList(idList []uint64) []ServerNekoSpiritInfo {
	var result []ServerNekoSpiritInfo
	for _, id := range idList {
		if spirit, found := Cache.Get(CacheTagNekoSpirit + strconv.FormatUint(id, 10)); found {
			result = append(result, spirit.(ServerNekoSpiritInfo))
		} else {
			var temp ServerNekoSpiritInfo
			DB.Where("token_id = ?", id).Find(&temp)
			// Cache.Set(CacheTagNekoSpirit+strconv.FormatUint(id, 10), temp, -1)
			result = append(result, temp)
		}
	}
	return result
}

func GetChestConfig() []ServerChestConfig {

	if result, found := Cache.Get(CacheTagChestConfig); found {
		return result.([]ServerChestConfig)
	}
	var config []ServerChestConfig
	DB.Find(&config)
	Cache.Set(CacheTagChestConfig, config, time.Minute*1)
	return config

}

func GetAddressSignatureContext(address string) string {

	// return "123456"

	if result, found := Cache.Get(CacheSignature + address); found {
		fmt.Println("SignatureContext: ", result)
		return result.(string)
	}
	signatureContext := strconv.Itoa(time.Now().Nanosecond())
	fmt.Println("SignatureContext: ", signatureContext)
	Cache.Set(CacheSignature+address, signatureContext, time.Minute*1)
	return signatureContext

}

func ExpireSignatureContext(address string) {
	Cache.Delete(CacheSignature + address)
}
