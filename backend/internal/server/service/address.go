package service

import (
	"backend/internal/database"
	"backend/internal/model"
	"backend/internal/util"
)

func AddressInfo(address model.Address) (data database.AddressInfo, code model.ResponseCode, message string) {

	if info := database.GetAddressDetailByAddress(address.Address); info.Uid != 0 {
		return info, model.Success, "Success"
	} else {
		return database.GetAddressDetailByUid(database.CreateAddressInfo(address.Address)), model.Success, "Address info created"
	}

}

func GenerateSignature(address string) (data string, code model.ResponseCode, message string) {

	address = util.CleanAddress(address)

	return database.GetAddressSignatureContext(address), model.Success, "Success"
}

func ActiveAddress(address string, activeCode string) (code model.ResponseCode, message string) {

	testCode := database.QueryActiveCode(activeCode)
	if testCode.ID == 0 {
		return model.NotFound, "Invalid Code"
	}
	if testCode.Uid > 0 {
		return model.WrongParam, "Code has been used"
	}

	addressDetail := database.GetAddressDetailByAddress(address)
	if addressDetail.Active {
		return model.WrongParam, "Already active"
	}

	if err := database.ActiveAddress(addressDetail.Uid, testCode.ID); err != nil {
		return model.ServerInternalError, err.Error()
	}
	return model.Success, "Active success"

}
