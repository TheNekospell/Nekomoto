package service

import "backend/internal/model"

import "backend/internal/database"

func GetStaticInfo() (data model.StaticInfo, code model.ResponseCode, message string) {

	return model.StaticInfo{TotalRewards: database.GetRewardPool(), TreasuryRevenue: database.GetTreasuryRevenue(), ChestCount: database.QueryOpenedChest(0), MasterChestCount: database.QueryOpenedChest(1)}, model.Success, "Success"

}
