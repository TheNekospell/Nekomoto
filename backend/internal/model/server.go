package model

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

type Address struct {
	Address string `json:"address" form:"address"`
}

type Signature struct {
	Signature string `json:"signature" form:"signature"`
	SignText  string `json:"text" form:"text"`
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
