package database

import (
	"errors"
	"fmt"
	"strconv"
	"strings"
	"time"

	"gorm.io/gorm"

	"github.com/patrickmn/go-cache"
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
	Uid                 uint64
	Address             string
	IsStarter           bool
	InviteCode          string
	SecondInviter       uint64
	ThirdInviter        uint64
	InvitationReward    ServerInvitationRewardStatic
	Buff                ServerBuffRecord
	NekoSpiritIdList    []uint64
	NekoSpiritList      []ServerNekoSpiritInfo
	TemporalShardIdList []uint64
	LastClaim           time.Time
	TotalClaimed        decimal.Decimal
	TotalMana           decimal.Decimal
	ToClaim             decimal.Decimal
	ChestOpenable       bool
	ChestEmpower        []string
	InviteCount         int64
	IsInBountyWave      bool
}

func calUnlockedAmount(count uint64) decimal.Decimal {
	var result float64
	if count <= 10 {
		result = float64(count) * 3
	} else if count <= 50 {
		result = float64(count-10)*5.5 + 30
	} else if count <= 100 {
		result = float64(count-50)*7 + 250
	} else {
		result = float64(count-100)*8.5 + 600
	}
	return decimal.NewFromFloat(result).Mul(decimal.NewFromInt(2500))
}

func GetAddressDetailByUid(uid uint64) AddressInfo {
	if detail, found := Cache.Get(CacheTagUid + strconv.FormatUint(uid, 10)); found {
		result := detail.(AddressInfo)
		result.NekoSpiritList = GetNekoSpiritListByIdList(result.NekoSpiritIdList)
		return result
	}

	var serverAddress ServerAddress
	DB.Where("id = ?", uid).Find(&serverAddress)

	//fmt.Println("[Server] Rebuild cache for uid:", uid, " address:", serverAddress.Address)

	var invitation ServerInvitationRecord
	DB.Where("uid = ?", uid).Find(&invitation)

	var InviteCount int64
	DB.Model(&ServerInvitationRecord{}).Where("second_uid = ?", uid).Count(&InviteCount)

	var invitationReward ServerInvitationRewardStatic
	DB.Where("uid = ?", uid).Find(&invitationReward)
	invitationReward.UnlockedAmount = calUnlockedAmount(invitationReward.UnlockedCount)

	var lastClaim time.Time
	if err := DB.Model(&ServerClaimNekoSpiritRecord{}).Where("uid = ?", uid).Order("created_at desc").Limit(1).Select("created_at").Find(&lastClaim).Error; err != nil {
		lastClaim = time.Time{}
	}
	var TotalClaimed decimal.Decimal
	if err := DB.Model(&ServerClaimNekoSpiritRecord{}).Where("uid = ?", uid).Select("ifnull(sum(amount),0) as total_claimed").Scan(&TotalClaimed).Error; err != nil {
		TotalClaimed = decimal.NewFromInt(0)
	}

	var Mana decimal.Decimal
	if err := DB.Model(&ServerNekoSpiritInfo{}).Where("stake_from_uid = ?", uid).Where("is_staked = ?", true).Select("ifnull(sum(mana),0) as mana").Scan(&Mana).Error; err != nil {
		Mana = decimal.NewFromInt(0)
	}
	var ToClaim decimal.Decimal
	if err := DB.Model(&ServerNekoSpiritInfo{}).Where("stake_from_uid = ?", uid).Select("(ifnull(sum(rewards),0) - ifnull(sum(claimed_rewards),0)) as to_claim").Scan(&ToClaim).Error; err != nil {
		ToClaim = decimal.NewFromInt(0)
	}

	chest := QueryChest(uid)
	openable := false
	var empower []string
	if chest.ID != 0 {
		openable = chest.IsOpen == 0
		records := QueryEmpowerRecord(chest.ID)
		for _, record := range records {
			add, _ := GetAddressByUid(record.Uid)
			empower = append(empower, add.Address)
		}
	}

	var buff ServerBuffRecord
	DB.Where("uid = ?", uid).Find(&buff)

	isInBountyWave := IsInBountyWave(uid)

	var NekoSpiritList []ServerNekoSpiritInfo
	var idList []uint64
	DB.Model(&ServerNekoSpiritInfo{}).Where("stake_from_uid = ?", uid).Find(&NekoSpiritList)
	for _, NekoSpirit := range NekoSpiritList {
		idList = append(idList, NekoSpirit.TokenId)
		//Cache.Set(CacheTagNekoSpirit+strconv.FormatUint(NekoSpirit.TokenId, 10), NekoSpirit, -1)
	}

	var shardIdList []uint64
	DB.Model(&ServerTemporalShardRecord{}).Where("uid = ?", uid).Select("token_id").Find(&shardIdList)

	result := AddressInfo{
		Uid:                 uid,
		Address:             serverAddress.Address,
		IsStarter:           serverAddress.IsStarter,
		InviteCode:          serverAddress.InviteCode,
		SecondInviter:       invitation.SecondUid,
		ThirdInviter:        invitation.ThirdUid,
		InvitationReward:    invitationReward,
		Buff:                buff,
		NekoSpiritIdList:    idList,
		NekoSpiritList:      NekoSpiritList,
		TemporalShardIdList: shardIdList,
		LastClaim:           lastClaim,
		TotalClaimed:        TotalClaimed,
		TotalMana:           Mana,
		ToClaim:             ToClaim,
		ChestOpenable:       openable,
		ChestEmpower:        empower,
		InviteCount:         InviteCount,
		IsInBountyWave:      isInBountyWave,
	}

	//Cache.Set(CacheTagUid+strconv.FormatUint(uid, 10), result, -1)
	// fmt.Println("Rebuild cache for uid:", uid, "Result:", result)
	return result
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

	if len(address) > 66 {
		address = "0x" + address[len(address)-64:]
	} else if len(address) < 66 {
		address = "0x" + strings.Repeat("0", 66-len(address)) + address[2:]
	}

	// uid -> address
	uid, err := CreateAddress(&ServerAddress{
		Address:    address,
		InviteCode: "neko-" + strconv.Itoa(time.Now().Nanosecond())[:5] + address[len(address)-3:],
		IsStarter:  true,
	})
	if err != nil {
		panic(err)
	}
	// uid -> buff
	_ = CreateBuffRecord(&ServerBuffRecord{
		Uid:   uid,
		Level: 0,
		Boost: decimal.NewFromInt(0),
	})
	// uid -> invitation reward static
	CreateInvitationRewardStatic(uid)
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
