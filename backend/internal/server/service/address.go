package service

import (
	"backend/internal/database"
	"backend/internal/model"
	"strings"
)

func AddressInfo(address model.Address) (data database.AddressInfo, code model.ResponseCode, message string) {

	if info := database.GetAddressDetailByAddress(address.Address); info.Uid != 0 {
		return info, model.Success, "Success"
	} else {
		return database.GetAddressDetailByUid(database.CreateAddressInfo(address.Address)), model.Success, "Address info created"
	}

}

func GenerateSignature(address string) (data string, code model.ResponseCode, message string) {

	if len(address) > 66 {
		address = "0x" + address[len(address)-64:]
	} else if len(address) < 66 {
		address = "0x" + strings.Repeat("0", 66-len(address)) + address[2:]
	}

	return database.GetAddressSignatureContext(address), model.Success, "Success"
}
