package model

import (
	"github.com/NethermindEth/starknet.go/typed"
	"github.com/NethermindEth/starknet.go/utils"
	"math/big"
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

type Address struct {
	Address string `json:"address" form:"address"`
}

type TypedData struct {
	Types       map[string]typed.TypeDef
	PrimaryType string
	Domain      typed.Domain
	Message     Message
}

type Signature struct {
	Signature []*big.Int `json:"signature" form:"signature"`
	TypedData TypedData  `json:"typedData" form:"typedData"`
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

func (message Message) FmtDefinitionEncoding(input string) (result []*big.Int) {
	result = append(result, utils.UTF8StrToBig(message.Content))
	return result
}
