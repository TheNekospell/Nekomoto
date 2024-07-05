package database

import (
	"errors"
	"fmt"
	"gorm.io/gorm"
	"strconv"
	"time"

	"github.com/ethereum/go-ethereum/common"
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
	Uid     uint64
	Address string
	// IsStarter           bool
	InviteCode          string
	SecondInviter       uint64
	ThirdInviter        uint64
	InvitationReward    ServerInvitationRewardStatic
	Buff                ServerBuffRecord
	NekoSpiritIdList    []uint64
	NekoSpiritList      []ServerNekoSpiritInfo
	TemporalShardIdList []uint64
	LastClaim           time.Time
}

func GetAddressDetailByUid(uid uint64) AddressInfo {
	if detail, found := Cache.Get(CacheTagUid + strconv.FormatUint(uid, 10)); found {
		result := detail.(AddressInfo)
		result.NekoSpiritList = GetNekoSpiritListByIdList(result.NekoSpiritIdList)
		return result
	}

	var serverAddress ServerAddress
	DB.Where("id = ?", uid).Find(&serverAddress)

	fmt.Println("[Server] Rebuild cache for uid:", uid, " address:", serverAddress.Address)

	var invitation ServerInvitationRecord
	if err := DB.Where("uid = ?", uid).Find(&invitation); err != nil {
		invitation = ServerInvitationRecord{}
	}

	var invitationReward ServerInvitationRewardStatic
	if err := DB.Where("uid = ?", uid).Find(&invitationReward); err != nil {
		invitationReward = ServerInvitationRewardStatic{}
	}

	var lastClaim time.Time
	if err := DB.Model(&ServerClaimNekoSpiritRecord{}).Where("uid = ?", uid).Order("created_at desc").Limit(1).Find(&lastClaim).Error; err != nil {
		lastClaim = time.Time{}
	}

	var buff ServerBuffRecord
	DB.Where("uid = ?", uid).Find(&buff)

	var NekoSpiritList []ServerNekoSpiritInfo
	var idList []uint64
	DB.Model(&ServerNekoSpiritInfo{}).Where("stake_from_uid = ?", uid).Find(&NekoSpiritList)
	for _, NekoSpirit := range NekoSpiritList {
		idList = append(idList, NekoSpirit.TokenId)
		Cache.Set(CacheTagNekoSpirit+strconv.FormatUint(NekoSpirit.TokenId, 10), NekoSpirit, -1)
	}

	var shardIdList []uint64
	DB.Model(&ServerTemporalShardRecord{}).Where("uid = ?", uid).Select("token_id").Find(&shardIdList)

	result := AddressInfo{
		Uid:     uid,
		Address: serverAddress.Address,
		// IsStarter:           serverAddress.IsStarter,
		InviteCode:          serverAddress.InviteCode,
		SecondInviter:       invitation.SecondUid,
		ThirdInviter:        invitation.ThirdUid,
		InvitationReward:    invitationReward,
		Buff:                buff,
		NekoSpiritIdList:    idList,
		NekoSpiritList:      NekoSpiritList,
		TemporalShardIdList: shardIdList,
		LastClaim:           lastClaim,
	}
	Cache.Set(CacheTagUid+strconv.FormatUint(uid, 10), result, -1)
	// fmt.Println("Rebuild cache for uid:", uid, "Result:", result)
	return result
}

func GetAddressDetailByAddress(address string) AddressInfo {
	if uid, found := Cache.Get(CacheTagAddress + address); found {
		return GetAddressDetailByUid(uid.(uint64))
	}
	if uid, err := GetUidByAddress(common.HexToAddress(address)); err == nil {
		Cache.Set(CacheTagAddress+address, uid, -1)
		return GetAddressDetailByUid(uid)
	} else if errors.Is(err, gorm.ErrRecordNotFound) {
		return GetAddressDetailByUid(CreateAddressInfo(common.HexToAddress(address)))
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

func CreateAddressInfo(address common.Address) uint64 {
	// uid -> address
	uid, err := CreateAddress(&ServerAddress{
		Address:    address.Hex(),
		InviteCode: "neko-" + strconv.Itoa(time.Now().Nanosecond())[:5] + address.Hex()[len(address.Hex())-3:],
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
	fmt.Println("[Server] Create address info for address:", address.Hex(), "uid:", uid)
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
			Cache.Set(CacheTagNekoSpirit+strconv.FormatUint(id, 10), temp, -1)
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
