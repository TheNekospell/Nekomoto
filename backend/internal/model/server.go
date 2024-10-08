package model

import (
	"backend/internal/database"

	"backend/starknet/utils"
	"math/big"

	"github.com/shopspring/decimal"
)

type ResponseCode int

const (
	Success             ResponseCode = 0
	WrongParam          ResponseCode = 401
	NotFound            ResponseCode = 404
	InvalidSignature    ResponseCode = 405
	ServerInternalError ResponseCode = 500
)

type ResponseData struct {
	Success bool         `json:"success"`
	Code    ResponseCode `json:"code"`
	Message string       `json:"message"`
	Data    interface{}  `json:"data"`
}

type Message struct {
	Content string `json:"content"`
}

type Types struct {
	StarkNetDomain []Definition `json:"StarkNetDomain" form:"StarkNetDomain"`
	Message        []Definition `json:"Message" form:"Message"`
}

type Definition struct {
	Name string `json:"name" form:"name"`
	Type string `json:"type" form:"type"`
}

type Address struct {
	Address string `json:"address" form:"address"`
}

type TypedData struct {
	Types       Types   `json:"types" form:"types"`
	PrimaryType string  `json:"primaryType" form:"primaryType"`
	Domain      Domain  `json:"domain" form:"domain"`
	Message     Message `json:"message" form:"message"`
}

type Domain struct {
	Name    string `json:"name" form:"name"`
	Version string `json:"version" form:"version"`
	ChainId string `json:"chainId" form:"chainId"`
}

type Signature struct {
	Signature []string  `json:"signature" form:"signature"`
	TypedData TypedData `json:"typedData" form:"typedData"`
}

type AddressAndSignature struct {
	Address   string    `json:"address" form:"address"`
	Signature Signature `json:"signature" form:"signature"`
}

type TwoAddressAndSignature struct {
	Address1  string    `json:"address1" form:"address1"`
	Address2  string    `json:"address2" form:"address2"`
	Signature Signature `json:"signature" form:"signature"`
}

type AddressAndCountAndSignature struct {
	Address   string    `json:"address" form:"address"`
	Count     uint64    `json:"count" form:"count"`
	Signature Signature `json:"signature" form:"signature"`
}

type AddressAndCodeAndSignature struct {
	Address   string    `json:"address" form:"address"`
	Code      string    `json:"code" form:"code"`
	Signature Signature `json:"signature" form:"signature"`
}

type AddressAndCode struct {
	Address string `json:"address" form:"address"`
	Code    string `json:"code" form:"code"`
}

func (message Message) FmtDefinitionEncoding(input string) (result []*big.Int) {
	result = append(result, utils.UTF8StrToBig(message.Content))
	return result
}

type StaticInfo struct {
	TotalRewards     decimal.Decimal             `json:"totalRewards" form:"totalRewards"`
	TreasuryRevenue  []database.ServerMintRecord `json:"treasuryRevenue" form:"treasuryRevenue"`
	ChestCount       uint64                      `json:"chestCount" form:"chestCount"`
	MasterChestCount uint64                      `json:"masterChestCount" form:"masterChestCount"`
	TotalBurn        decimal.Decimal             `json:"totalBurn" form:"totalBurn"`
}
