package service

import (
	"backend/internal/database"
	"backend/internal/model"
)

func AcceptInvitation(req model.AddressAndCodeAndSignature) (code model.ResponseCode, message string) {

	detail := database.GetAddressDetailByAddress(req.Address)
	if detail.InviteCode == req.Code {
		return model.Success, "Can't invite yourself"
	}

	var record database.ServerInvitationRecord
	if err := database.DB.Where("uid = ?", detail.Uid).Find(&record); err == nil {
		// has record already
		return model.Success, "Can't accept invitation twice"
	}

	inviter := database.GetAddressDetailByInviteCode(req.Code).Uid
	if inviter == 0 {
		return model.NotFound, "Invalid Code"
	}
	record.SecondUid = inviter

	record.Uid = database.GetAddressDetailByAddress(req.Address).Uid

	inviterOfInviter := database.QueryInviterOfInviter(inviter)
	if inviterOfInviter != 0 {
		record.ThirdUid = inviterOfInviter
	}

	if err := database.CreateInvitationRecord(record); err != nil {
		return model.ServerInternalError, err.Error()
	}
	return model.Success, "Accept invitation success"

}
