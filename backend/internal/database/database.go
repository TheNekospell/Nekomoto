package database

import (
	"backend/internal/env"
	"errors"
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/shopspring/decimal"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func InitDatabase() {
	var err error
	DB, err = gorm.Open(mysql.Open(env.GetEnvValue("DSN")), &gorm.Config{DisableForeignKeyConstraintWhenMigrating: true})
	if err != nil {
		panic(err)
	}
	fmt.Println("Connected to database")
	initTables()
}

func InitDatabaseSn() {
	var err error
	DB, err = gorm.Open(mysql.Open(env.GetEnvValue("DSN_SN")), &gorm.Config{DisableForeignKeyConstraintWhenMigrating: true, Logger: logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags), // io writer
		logger.Config{
			SlowThreshold:             time.Second, // Slow SQL threshold
			LogLevel:                  logger.Warn, // Log level
			IgnoreRecordNotFoundError: true,        // Ignore ErrRecordNotFound error for logger
			// ParameterizedQueries:      true,          // Don't include params in the SQL log
			Colorful: true, // Disable color
		},
	)})
	if err != nil {
		panic(err)
	}
	fmt.Println("Connected to database")
	initTables()
}

func initTables() {
	list := []interface{}{
		&ServerAddress{},
		&ServerClaimRecord{},
		&ServerNekoSpiritInfo{},
		&ServerClaimNekoSpiritRecord{},
		&ServerStarterPack{},
		&ServerRewardPool{},
		&ServerStarterChestConfig{},
		&ServerMintRecord{},
		&ServerBurnStatic{},
		&ServerBurnTemp{},
		&ServerTestCode{},
		&ServerEpoch{},
		&ServerTransactionRecord{},
		&IndexerRecord{},
		&IndexerTransactionRecord{},
		&EventNekoCoinTransfer{},
		&EventPrismTransfer{},
		&EventNekoSpiritTransfer{},
		&EventNekoSpiritUpgrade{},
	}
	err := DB.AutoMigrate(list...)
	if err != nil {
		panic(err)
	}
	fmt.Println("AutoMigrated database:", len(list), "tables")

	if err := DB.First(&ServerEpoch{}).Error; errors.Is(err, gorm.ErrRecordNotFound) {
		DB.Create(&ServerEpoch{Epoch: 1})
	}

	// indexer block height
	if err := DB.First(&IndexerRecord{}).Error; errors.Is(err, gorm.ErrRecordNotFound) {
		blockHeight, err := strconv.ParseUint(env.GetEnvValue("BLOCK_HEIGHT"), 10, 64)
		if err != nil {
			fmt.Println("indexer block height is not set, use default value 0", err)
			blockHeight = 0
		}
		DB.Create(&IndexerRecord{BlockHeight: blockHeight})
	}

	// game reward pool
	// 2000000000 nekocoin limit
	// 60% of nekocoin into two pools in 90 days (180 epochs)
	if err := DB.First(&ServerRewardPool{}).Error; errors.Is(err, gorm.ErrRecordNotFound) {
		amountOfFirstEpoch := decimal.New(2000000000, 18).Div(decimal.New(180, 0))
		DB.Create(&ServerRewardPool{MintPool: amountOfFirstEpoch.Mul(decimal.New(30, -2)), StakePool: amountOfFirstEpoch.Mul(decimal.New(70, -2))})
	}

	// starter chest
	if err := DB.First(&ServerStarterChestConfig{}).Error; errors.Is(err, gorm.ErrRecordNotFound) {
		DB.Create(&ServerStarterChestConfig{
			Limit: 20000,
		})
	}

	// burn record
	if err := DB.First(&ServerBurnStatic{}).Error; errors.Is(err, gorm.ErrRecordNotFound) {
		DB.Create(&ServerBurnStatic{
			Count: decimal.Zero,
		})
	}

}

type ChestType uint8

const (
	AdeptChest ChestType = iota
	MasterChest
)

type RecordType uint16

const (
	None RecordType = iota
	BuyScroll
	Summon
	Stake
	Withdraw
	Upgrade
	Prism
)

type Model struct {
	ID        uint64 `gorm:"primaryKey"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
}

type ServerAddress struct {
	Model
	Address    string `gorm:"uniqueIndex type:char(66) not null"`
	InviteCode string `gorm:"not null index"`
	IsStarter  bool   `gorm:"not null default:true"`
	Active     bool   `gorm:"not null default:true"`
}

type ServerClaimRecord struct {
	Model
	Uid              uint64          `gorm:"not null index"`
	SpiritAmount     decimal.Decimal `gorm:"not null type:decimal(36,18)"`
	InvitationAmount decimal.Decimal `gorm:"not null type:decimal(36,18)"`
}

type ServerNekoSpiritInfo struct {
	Model
	Epoch              uint64          `gorm:"not null index"`
	TokenId            uint64          `gorm:"uniqueIndex"`
	Rarity             string          `gorm:"not null"`
	Element            string          `gorm:"not null"`
	ATK                decimal.Decimal `gorm:"not null type:decimal(36,18)"`
	Level              uint64          `gorm:"not null default:1 index"`
	StakeFromUid       uint64          `gorm:"index"`
	IsStaked           bool            `gorm:"not null default:false"`
	StakeTime          time.Time       `gorm:""`
	Rewards            decimal.Decimal `gorm:"not null type:decimal(36,18) default:0"`
	ClaimedRewards     decimal.Decimal `gorm:"not null type:decimal(36,18) default:0"`
	MintRewards        decimal.Decimal `gorm:"not null type:decimal(36,18) default:0"`
	ClaimedMintRewards decimal.Decimal `gorm:"not null type:decimal(36,18) default:0"`
}

//type ServerBuffRecord struct {
//	Model
//	Uid uint64 `gorm:"not null index"`
//	// ascend
//	Level uint64          `gorm:"not null default:0"`
//	Boost decimal.Decimal `gorm:"not null default:0 type:decimal(4,4)"`
//	// time freeze
//	StartTime time.Time `gorm:"default:'2000-01-01 00:00:00.000'"`
//	// lucky
//	IsLucky bool `gorm:"not null default:false"`
//}

type ServerClaimNekoSpiritRecord struct {
	Model
	Uid    uint64          `gorm:"not null index"`
	Amount decimal.Decimal `gorm:"not null type:decimal(36,18) default:0"`
}

type ServerInvitationRecord struct {
	Model
	Uid       uint64 `gorm:"not null index"`
	SecondUid uint64 `gorm:"default:0"`
	ThirdUid  uint64 `gorm:"default:0"`
}

type ServerInvitationRewardRecord struct {
	Model
	Uid     uint64          `gorm:"not null index comment:'0 to burn'"`
	FromUid uint64          `gorm:"not null index"`
	Amount  decimal.Decimal `gorm:"not null type:decimal(36,18) default:0"`
}

type ServerInvitationRewardStatic struct {
	Model
	Uid            uint64          `gorm:"not null index"`
	TotalAmount    decimal.Decimal `gorm:"not null type:decimal(36,18) default:0"`
	UnlockedAmount decimal.Decimal `gorm:"not null type:decimal(36,18) default:0"`
	UnlockedCount  uint64          `gorm:"not null default:0"`
	ClaimedAmount  decimal.Decimal `gorm:"not null type:decimal(36,18) default:0"`
}

type ServerChestConfig struct {
	Model
	Version      uint8           `gorm:"not null default:0"`
	ChestType    ChestType       `gorm:"not null default:0"`
	TotalLimit   uint64          `gorm:"not null default:0"`
	Chance       decimal.Decimal `gorm:"not null type:decimal(4,4) default:0"`
	Token1Amount decimal.Decimal `gorm:"not null type:decimal(36,18) default:0"`
	Token2Amount decimal.Decimal `gorm:"not null type:decimal(36,18) default:0"`
	NFTAmount    uint64          `gorm:"not null default:0"`
}

type ServerChest struct {
	Model
	Uid          uint64          `gorm:"not null index"`
	ChestType    ChestType       `gorm:"not null default:0"`
	IsOpen       uint8           `gorm:"not null default:0"`
	Token1Amount decimal.Decimal `gorm:"not null type:decimal(36,18) default:0"`
	Token2Amount decimal.Decimal `gorm:"not null type:decimal(36,18) default:0"`
	NFTAmount    uint64          `gorm:"not null default:0"`
}

type ServerChestEmpowerRecord struct {
	Model
	Uid uint64 `gorm:"not null index"`
	Cid uint64 `gorm:"not null index"`
}

type ServerStarterPack struct {
	Model
	Uid uint64 `gorm:"not null index"`
}

type ServerRewardPool struct {
	Model
	MintPool  decimal.Decimal `gorm:"not null type:decimal(36,18) default:0"`
	StakePool decimal.Decimal `gorm:"not null type:decimal(36,18) default:0"`
}

type ServerWhiteListOfBountyWave struct {
	Model
	// Uid     uint64 `gorm:"not null index"`
	Address string `gorm:"uniqueIndex type:char(66) not null"`
}

type ServerBountyWaveConfig struct {
	Model
	StartTime time.Time       `gorm:"not null"`
	EndTime   time.Time       `gorm:"not null"`
	Boost     decimal.Decimal `gorm:"not null default:0 type:decimal(4,4)"`
}

type ServerTemporalShardRecord struct {
	Model
	TokenId uint64 `gorm:"not null index"`
	Uid     uint64 `gorm:"not null index"`
}

type ServerStarterChestConfig struct {
	Model
	Limit  uint64 `gorm:"not null"`
	Opened uint64 `gorm:"not null default:0"`
}

type ServerMintRecord struct {
	Model
	Address string `gorm:"not null type:char(66) index"`
	Count   uint64 `gorm:"not null"`
	Hash    string `gorm:"not null type:char(66) index"`
}

type ServerBurnStatic struct {
	Model
	Count decimal.Decimal `gorm:"not null type:decimal(36,18) default:0"`
}

type ServerBurnTemp struct {
	Model
	TokenId   uint64          `gorm:"not null"`
	Count     decimal.Decimal `gorm:"not null type:decimal(36,18) default:0"`
	BurnOrNot bool            `gorm:"not null default:false"`
}

type ServerTestCode struct {
	Model
	Code string `gorm:"not null"`
	Uid  uint64 `gorm:"not null default:0"`
}

type ServerTransactionRecord struct {
	Model
	Uid        uint64     `gorm:"not null index"`
	Hash       string     `gorm:"not null type:char(66) index"`
	RecordType RecordType `gorm:"not null"`
	Object     string     `gorm:"not null"`
}

type ServerEpoch struct {
	Model
	Epoch uint64 `gorm:"not null"`
}

type IndexerRecord struct {
	Model
	RecordType  uint8  `gorm:"not null default:0"`
	BlockHeight uint64 `gorm:"not null"`
}

type IndexerTransactionRecord struct {
	Model
	TransactionHash string `gorm:"index type:char(66) not null"`
	BlockNumber     uint64 `gorm:"not null index"`
	BlockHash       string `gorm:"not null type:char(66)"`
	RecordType      uint8  `gorm:"index not null"`
}

// blockchain

type Hash struct {
	TransactionHash string `gorm:"uniqueIndex type:char(66) not null"`
	BlockNumber     uint64 `gorm:"not null index"`
	BlockHash       string `gorm:"not null type:char(66)"`
}

type EventNekoCoinTransfer struct {
	Model
	Hash
	From                 string          `gorm:"not null type:char(66)"`
	To                   string          `gorm:"not null type:char(66)"`
	Amount               decimal.Decimal `gorm:"not null type:decimal(36,18) default:0"`
	TransferOrMintOrBurn uint8           `gorm:"not null default:0 index"`
}

type EventPrismTransfer struct {
	Model
	Hash
	From                 string          `gorm:"not null type:char(66)"`
	To                   string          `gorm:"not null type:char(66)"`
	Amount               decimal.Decimal `gorm:"not null type:decimal(36,18) default:0"`
	TransferOrMintOrBurn uint8           `gorm:"not null default:0 index"`
}

type EventNekoSpiritTransfer struct {
	Model
	Hash
	From                 string `gorm:"not null type:char(66)"`
	To                   string `gorm:"not null type:char(66)"`
	TokenId              uint64 `gorm:"not null"`
	TransferOrMintOrBurn uint8  `gorm:"not null default:0 index"`
}

type EventTemporalShardTransfer struct {
	Model
	Hash
	From                 string `gorm:"not null type:char(66)"`
	To                   string `gorm:"not null type:char(66)"`
	TokenId              uint64 `gorm:"not null"`
	TransferOrMintOrBurn uint8  `gorm:"not null default:0 index"`
}

type EventNekoSpiritUpgrade struct {
	Model
	Hash
	From          string          `gorm:"not null type:char(66) index"`
	TokenId       uint64          `gorm:"not null index"`
	NewLevel      uint64          `gorm:"not null"`
	NekoCoinCount decimal.Decimal `gorm:"not null type:decimal(36,18) default:0"`
	PrismaCount   decimal.Decimal `gorm:"not null type:decimal(36,18) default:0"`
}

type EventTimeFreeze struct {
	Model
	Hash
	From      string    `gorm:"not null type:char(66)"`
	TokenId   uint64    `gorm:"not null"`
	StartTime time.Time `gorm:"not null"`
}

type EventAscendUpgrade struct {
	Model
	Hash
	From          string          `gorm:"not null type:char(66) index"`
	NewLevel      uint64          `gorm:"not null"`
	NekoCoinCount decimal.Decimal `gorm:"not null type:decimal(36,18) default:0"`
	PrismaCount   decimal.Decimal `gorm:"not null type:decimal(36,18) default:0"`
}
