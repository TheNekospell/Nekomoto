package service

import (
	"backend/internal/database"
	// "backend/internal/model"

	"github.com/shopspring/decimal"
)

// func GetStaticInfo() (data model.StaticInfo, code model.ResponseCode, message string) {

// 	return model.StaticInfo{TotalRewards: database.GetRewardPool(), TreasuryRevenue: database.GetTreasuryRevenue(), ChestCount: database.QueryOpenedChest(0), MasterChestCount: database.QueryOpenedChest(1),TotalBurn: database.GetNekoCoinBurn()}, model.Success, "Success"

// }

func RecordNekoCoinBurn(amount decimal.Decimal) {
	database.AddNekoCoinBurn(amount)
}
