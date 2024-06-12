package service

import (
	"backend/internal/database"
	"backend/internal/model"

	"github.com/ethereum/go-ethereum/common"
)

func AddressInfo(address model.Address) (data database.AddressInfo, code model.ResponseCode, message string) {

	if info := database.GetAddressDetailByAddress(address.Address); info.Uid != 0 {
		return info, model.Success, "Success"
	} else {
		return database.GetAddressDetailByUid(database.CreateAddressInfo(common.HexToAddress(address.Address))), model.Success, "Address info created"
	}

}

func GenerateSignature(address string) (data string, code model.ResponseCode, message string) {
	return database.GetAddressSignatureContext(address), model.Success, "Success"
}
