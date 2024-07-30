package database

import (
	"backend/internal/env"
	"errors"
	"fmt"
	"log"
	"math/big"
	"os"
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
		&ServerBuffRecord{},
		&ServerClaimNekoSpiritRecord{},
		&ServerInvitationRecord{},
		&ServerInvitationRewardRecord{},
		&ServerInvitationRewardStatic{},
		&ServerChestConfig{},
		&ServerChest{},
		&ServerChestEmpowerRecord{},
		&ServerStarterPack{},
		&ServerRewardPool{},
		&ServerWhiteListOfBountyWave{},
		&ServerBountyWaveConfig{},
		&ServerTemporalShardRecord{},
		&ServerStarterChestConfig{},
		&ServerMintRecord{},
		&ServerBurnStatic{},
		&ServerBurnTemp{},
		&IndexerRecord{},
		&IndexerTransactionRecord{},
		&EventNekoCoinTransfer{},
		&EventPrismTransfer{},
		&EventNekoSpiritTransfer{},
		&EventTemporalShardTransfer{},
		&EventNekoSpiritUpgrade{},
		&EventTimeFreeze{},
		&EventAscendUpgrade{},
	}
	err := DB.AutoMigrate(list...)
	if err != nil {
		panic(err)
	}
	fmt.Println("AutoMigrated database:", len(list), "tables")

	// chest config
	if (errors.Is(DB.First(&ServerChestConfig{}).Error, gorm.ErrRecordNotFound)) {
		DB.Create([]*ServerChestConfig{
			{
				Version:      0,
				ChestType:    AdeptChest,
				TotalLimit:   10000,
				Chance:       decimal.NewFromBigRat(big.NewRat(5800, 10000), 4),
				Token1Amount: decimal.NewFromUint64(15),
				Token2Amount: decimal.NewFromUint64(0),
				NFTAmount:    0,
			},
			{
				Version:      0,
				ChestType:    AdeptChest,
				TotalLimit:   10000,
				Chance:       decimal.NewFromBigRat(big.NewRat(1750, 10000), 4),
				Token1Amount: decimal.NewFromUint64(30),
				Token2Amount: decimal.NewFromUint64(0),
				NFTAmount:    0,
			},
			{
				Version:      0,
				ChestType:    AdeptChest,
				TotalLimit:   10000,
				Chance:       decimal.NewFromBigRat(big.NewRat(1100, 10000), 4),
				Token1Amount: decimal.NewFromUint64(40),
				Token2Amount: decimal.NewFromUint64(0),
				NFTAmount:    0,
			},
			{
				Version:      0,
				ChestType:    AdeptChest,
				TotalLimit:   10000,
				Chance:       decimal.NewFromBigRat(big.NewRat(750, 10000), 4),
				Token1Amount: decimal.NewFromUint64(0),
				Token2Amount: decimal.NewFromUint64(1),
				NFTAmount:    0,
			},
			{
				Version:      0,
				ChestType:    AdeptChest,
				TotalLimit:   10000,
				Chance:       decimal.NewFromBigRat(big.NewRat(450, 10000), 4),
				Token1Amount: decimal.NewFromUint64(0),
				Token2Amount: decimal.NewFromUint64(2),
				NFTAmount:    0,
			},
			{
				Version:      0,
				ChestType:    AdeptChest,
				TotalLimit:   10000,
				Chance:       decimal.NewFromBigRat(big.NewRat(150, 10000), 4),
				Token1Amount: decimal.NewFromUint64(0),
				Token2Amount: decimal.NewFromUint64(3),
				NFTAmount:    0,
			},
			{
				Version:      0,
				ChestType:    MasterChest,
				TotalLimit:   5000,
				Chance:       decimal.NewFromBigRat(big.NewRat(5600, 10000), 4),
				Token1Amount: decimal.NewFromUint64(40),
				Token2Amount: decimal.NewFromUint64(0),
				NFTAmount:    0,
			},
			{
				Version:      0,
				ChestType:    MasterChest,
				TotalLimit:   5000,
				Chance:       decimal.NewFromBigRat(big.NewRat(1500, 10000), 4),
				Token1Amount: decimal.NewFromUint64(60),
				Token2Amount: decimal.NewFromUint64(0),
				NFTAmount:    0,
			},
			{
				Version:      0,
				ChestType:    MasterChest,
				TotalLimit:   5000,
				Chance:       decimal.NewFromBigRat(big.NewRat(1000, 10000), 4),
				Token1Amount: decimal.NewFromUint64(100),
				Token2Amount: decimal.NewFromUint64(0),
				NFTAmount:    0,
			},
			{
				Version:      0,
				ChestType:    MasterChest,
				TotalLimit:   5000,
				Chance:       decimal.NewFromBigRat(big.NewRat(1100, 10000), 4),
				Token1Amount: decimal.NewFromUint64(0),
				Token2Amount: decimal.NewFromUint64(2),
				NFTAmount:    0,
			},
			{
				Version:      0,
				ChestType:    MasterChest,
				TotalLimit:   5000,
				Chance:       decimal.NewFromBigRat(big.NewRat(500, 10000), 4),
				Token1Amount: decimal.NewFromUint64(0),
				Token2Amount: decimal.NewFromUint64(3),
				NFTAmount:    0,
			},
			{
				Version:      0,
				ChestType:    MasterChest,
				TotalLimit:   5000,
				Chance:       decimal.NewFromBigRat(big.NewRat(200, 10000), 4),
				Token1Amount: decimal.NewFromUint64(0),
				Token2Amount: decimal.NewFromUint64(4),
				NFTAmount:    0,
			},
			{
				Version:      0,
				ChestType:    MasterChest,
				TotalLimit:   5000,
				Chance:       decimal.NewFromBigRat(big.NewRat(100, 10000), 4),
				Token1Amount: decimal.NewFromUint64(0),
				Token2Amount: decimal.NewFromUint64(0),
				NFTAmount:    1,
			},
		})
	}

	// indexer block height
	// DB.FirstOrCreate(&IndexerRecord{}, IndexerRecord{BlockHeight: 0})
	if err := DB.First(&IndexerRecord{}).Error; errors.Is(err, gorm.ErrRecordNotFound) {
		DB.Create(&IndexerRecord{BlockHeight: 0})
	}

	// game reward pool
	// DB.FirstOrCreate(&ServerRewardPool{}, ServerRewardPool{TotalAmount: decimal.New(20, 8).Mul(decimal.New(6667, -4)).Sub(decimal.New(1, 8))})
	if err := DB.First(&ServerRewardPool{}).Error; errors.Is(err, gorm.ErrRecordNotFound) {
		DB.Create(&ServerRewardPool{TotalAmount: decimal.New(20, 8).Mul(decimal.New(6667, -4)).Sub(decimal.New(1, 8))})
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
}

type ServerClaimRecord struct {
	Model
	Uid              uint64          `gorm:"not null index"`
	SpiritAmount     decimal.Decimal `gorm:"not null type:decimal(36,18)"`
	InvitationAmount decimal.Decimal `gorm:"not null type:decimal(36,18)"`
}

type ServerNekoSpiritInfo struct {
	Model
	TokenId        uint64          `gorm:"uniqueIndex"`
	Rarity         string          `gorm:"not null"`
	Element        string          `gorm:"not null"`
	Name           string          `gorm:"not null"`
	SPI            decimal.Decimal `gorm:"not null type:decimal(36,18)"`
	ATK            decimal.Decimal `gorm:"not null type:decimal(36,18)"`
	DEF            decimal.Decimal `gorm:"not null type:decimal(36,18)"`
	SPD            decimal.Decimal `gorm:"not null type:decimal(36,18)"`
	Fade           decimal.Decimal `gorm:"not null type:decimal(36,18)"`
	Mana           decimal.Decimal `gorm:"not null type:decimal(36,18)"`
	Level          uint64          `gorm:"not null default:1 index"`
	StakeFromUid   uint64          `gorm:"index"`
	IsStaked       bool            `gorm:"not null default:false"`
	StakeTime      time.Time       `gorm:""`
	Rewards        decimal.Decimal `gorm:"not null type:decimal(36,18) default:0"`
	ClaimedRewards decimal.Decimal `gorm:"not null type:decimal(36,18) default:0"`
}

type ServerBuffRecord struct {
	Model
	Uid uint64 `gorm:"not null index"`
	// ascend
	Level uint64          `gorm:"not null default:0"`
	Boost decimal.Decimal `gorm:"not null default:0 type:decimal(4,4)"`
	// time freeze
	StartTime time.Time `gorm:"default:'2000-01-01 00:00:00.000'"`
	// lucky
	IsLucky bool `gorm:"not null default:false"`
}

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
	TotalAmount decimal.Decimal `gorm:"not null type:decimal(36,18) default:0"`
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
