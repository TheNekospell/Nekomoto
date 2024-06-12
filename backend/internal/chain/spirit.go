// Code generated - DO NOT EDIT.
// This file is a generated binding and any manual changes will be lost.

package chain

import (
	"errors"
	"math/big"
	"strings"

	ethereum "github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/event"
)

// Reference imports to suppress errors if they are not otherwise used.
var (
	_ = errors.New
	_ = big.NewInt
	_ = strings.NewReader
	_ = ethereum.NotFound
	_ = bind.Bind
	_ = common.Big1
	_ = types.BloomLookup
	_ = event.NewSubscription
	_ = abi.ConvertType
)

// BoxInfo is an auto generated low-level Go binding around an user-defined struct.
type BoxInfo struct {
	Rarity  string
	Element string
	Name    string
	SPI     *big.Int
	ATK     *big.Int
	DEF     *big.Int
	SPD     *big.Int
	Fade    *big.Int
	Mana    *big.Int
	Level   *big.Int
}

// SpiritMetaData contains all meta data concerning the Spirit contract.
var SpiritMetaData = &bind.MetaData{
	ABI: "[{\"inputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"sender\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"ERC721IncorrectOwner\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"ERC721InsufficientApproval\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"approver\",\"type\":\"address\"}],\"name\":\"ERC721InvalidApprover\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"}],\"name\":\"ERC721InvalidOperator\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"ERC721InvalidOwner\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"receiver\",\"type\":\"address\"}],\"name\":\"ERC721InvalidReceiver\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"sender\",\"type\":\"address\"}],\"name\":\"ERC721InvalidSender\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"ERC721NonexistentToken\",\"type\":\"error\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"approved\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"Approval\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bool\",\"name\":\"approved\",\"type\":\"bool\"}],\"name\":\"ApprovalForAll\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"Reset\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"Summon\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"sender\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"time\",\"type\":\"uint256\"}],\"name\":\"TimeFreeze\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"Transfer\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"sender\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"newLevel\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"nekoCount\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"prismCount\",\"type\":\"uint256\"}],\"name\":\"Upgrade\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"sender\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"newLevel\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"nekoCount\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"prism\",\"type\":\"uint256\"}],\"name\":\"UpgradeAscend\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"name\":\"_openPack\",\"outputs\":[{\"internalType\":\"uint8\",\"name\":\"\",\"type\":\"uint8\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"_tokenId\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"input\",\"type\":\"uint256\"}],\"name\":\"addLimit\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"approve\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"input\",\"type\":\"address\"}],\"name\":\"ascend\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"balanceOf\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"burn\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"internalType\":\"bool\",\"name\":\"origin\",\"type\":\"bool\"}],\"name\":\"generate\",\"outputs\":[{\"components\":[{\"internalType\":\"string\",\"name\":\"rarity\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"element\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"name\",\"type\":\"string\"},{\"internalType\":\"uint256\",\"name\":\"SPI\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"ATK\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"DEF\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"SPD\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"Fade\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"Mana\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"level\",\"type\":\"uint256\"}],\"internalType\":\"structBox.Info\",\"name\":\"\",\"type\":\"tuple\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"getApproved\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256[]\",\"name\":\"tokenId\",\"type\":\"uint256[]\"},{\"internalType\":\"uint256[]\",\"name\":\"amount\",\"type\":\"uint256[]\"},{\"internalType\":\"uint256[]\",\"name\":\"burn\",\"type\":\"uint256[]\"}],\"name\":\"increaseFade\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"neko\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"prisma\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"shard\",\"type\":\"address\"}],\"name\":\"init\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"}],\"name\":\"isApprovedForAll\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"input\",\"type\":\"address\"}],\"name\":\"lucky\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"name\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"ownerOf\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"safeTransferFrom\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"}],\"name\":\"safeTransferFrom\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"internalType\":\"bool\",\"name\":\"approved\",\"type\":\"bool\"}],\"name\":\"setApprovalForAll\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256[]\",\"name\":\"tokenId\",\"type\":\"uint256[]\"}],\"name\":\"stake\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"startTimeFreeze\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"starterPack\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"starterPackLimit\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"count\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"input\",\"type\":\"uint256\"}],\"name\":\"summon\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes4\",\"name\":\"interfaceId\",\"type\":\"bytes4\"}],\"name\":\"supportsInterface\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"symbol\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"input\",\"type\":\"address\"}],\"name\":\"timeFreeze\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"tokenURI\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"transferFrom\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"upgrade\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"upgradeAscend\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256[]\",\"name\":\"tokenId\",\"type\":\"uint256[]\"}],\"name\":\"withdraw\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]",
}

// SpiritABI is the input ABI used to generate the binding from.
// Deprecated: Use SpiritMetaData.ABI instead.
var SpiritABI = SpiritMetaData.ABI

// Spirit is an auto generated Go binding around an Ethereum contract.
type Spirit struct {
	SpiritCaller     // Read-only binding to the contract
	SpiritTransactor // Write-only binding to the contract
	SpiritFilterer   // Log filterer for contract events
}

// SpiritCaller is an auto generated read-only Go binding around an Ethereum contract.
type SpiritCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// SpiritTransactor is an auto generated write-only Go binding around an Ethereum contract.
type SpiritTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// SpiritFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type SpiritFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// SpiritSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type SpiritSession struct {
	Contract     *Spirit           // Generic contract binding to set the session for
	CallOpts     bind.CallOpts     // Call options to use throughout this session
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// SpiritCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type SpiritCallerSession struct {
	Contract *SpiritCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts // Call options to use throughout this session
}

// SpiritTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type SpiritTransactorSession struct {
	Contract     *SpiritTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// SpiritRaw is an auto generated low-level Go binding around an Ethereum contract.
type SpiritRaw struct {
	Contract *Spirit // Generic contract binding to access the raw methods on
}

// SpiritCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type SpiritCallerRaw struct {
	Contract *SpiritCaller // Generic read-only contract binding to access the raw methods on
}

// SpiritTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type SpiritTransactorRaw struct {
	Contract *SpiritTransactor // Generic write-only contract binding to access the raw methods on
}

// NewSpirit creates a new instance of Spirit, bound to a specific deployed contract.
func NewSpirit(address common.Address, backend bind.ContractBackend) (*Spirit, error) {
	contract, err := bindSpirit(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &Spirit{SpiritCaller: SpiritCaller{contract: contract}, SpiritTransactor: SpiritTransactor{contract: contract}, SpiritFilterer: SpiritFilterer{contract: contract}}, nil
}

// NewSpiritCaller creates a new read-only instance of Spirit, bound to a specific deployed contract.
func NewSpiritCaller(address common.Address, caller bind.ContractCaller) (*SpiritCaller, error) {
	contract, err := bindSpirit(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &SpiritCaller{contract: contract}, nil
}

// NewSpiritTransactor creates a new write-only instance of Spirit, bound to a specific deployed contract.
func NewSpiritTransactor(address common.Address, transactor bind.ContractTransactor) (*SpiritTransactor, error) {
	contract, err := bindSpirit(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &SpiritTransactor{contract: contract}, nil
}

// NewSpiritFilterer creates a new log filterer instance of Spirit, bound to a specific deployed contract.
func NewSpiritFilterer(address common.Address, filterer bind.ContractFilterer) (*SpiritFilterer, error) {
	contract, err := bindSpirit(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &SpiritFilterer{contract: contract}, nil
}

// bindSpirit binds a generic wrapper to an already deployed contract.
func bindSpirit(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := SpiritMetaData.GetAbi()
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, *parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_Spirit *SpiritRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _Spirit.Contract.SpiritCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_Spirit *SpiritRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Spirit.Contract.SpiritTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_Spirit *SpiritRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _Spirit.Contract.SpiritTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_Spirit *SpiritCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _Spirit.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_Spirit *SpiritTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Spirit.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_Spirit *SpiritTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _Spirit.Contract.contract.Transact(opts, method, params...)
}

// OpenPack is a free data retrieval call binding the contract method 0x63a8d985.
//
// Solidity: function _openPack(address ) view returns(uint8)
func (_Spirit *SpiritCaller) OpenPack(opts *bind.CallOpts, arg0 common.Address) (uint8, error) {
	var out []interface{}
	err := _Spirit.contract.Call(opts, &out, "_openPack", arg0)

	if err != nil {
		return *new(uint8), err
	}

	out0 := *abi.ConvertType(out[0], new(uint8)).(*uint8)

	return out0, err

}

// OpenPack is a free data retrieval call binding the contract method 0x63a8d985.
//
// Solidity: function _openPack(address ) view returns(uint8)
func (_Spirit *SpiritSession) OpenPack(arg0 common.Address) (uint8, error) {
	return _Spirit.Contract.OpenPack(&_Spirit.CallOpts, arg0)
}

// OpenPack is a free data retrieval call binding the contract method 0x63a8d985.
//
// Solidity: function _openPack(address ) view returns(uint8)
func (_Spirit *SpiritCallerSession) OpenPack(arg0 common.Address) (uint8, error) {
	return _Spirit.Contract.OpenPack(&_Spirit.CallOpts, arg0)
}

// TokenId is a free data retrieval call binding the contract method 0x24822514.
//
// Solidity: function _tokenId() view returns(uint256)
func (_Spirit *SpiritCaller) TokenId(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _Spirit.contract.Call(opts, &out, "_tokenId")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// TokenId is a free data retrieval call binding the contract method 0x24822514.
//
// Solidity: function _tokenId() view returns(uint256)
func (_Spirit *SpiritSession) TokenId() (*big.Int, error) {
	return _Spirit.Contract.TokenId(&_Spirit.CallOpts)
}

// TokenId is a free data retrieval call binding the contract method 0x24822514.
//
// Solidity: function _tokenId() view returns(uint256)
func (_Spirit *SpiritCallerSession) TokenId() (*big.Int, error) {
	return _Spirit.Contract.TokenId(&_Spirit.CallOpts)
}

// Ascend is a free data retrieval call binding the contract method 0x6a83dac8.
//
// Solidity: function ascend(address input) view returns(uint256, uint256)
func (_Spirit *SpiritCaller) Ascend(opts *bind.CallOpts, input common.Address) (*big.Int, *big.Int, error) {
	var out []interface{}
	err := _Spirit.contract.Call(opts, &out, "ascend", input)

	if err != nil {
		return *new(*big.Int), *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)
	out1 := *abi.ConvertType(out[1], new(*big.Int)).(**big.Int)

	return out0, out1, err

}

// Ascend is a free data retrieval call binding the contract method 0x6a83dac8.
//
// Solidity: function ascend(address input) view returns(uint256, uint256)
func (_Spirit *SpiritSession) Ascend(input common.Address) (*big.Int, *big.Int, error) {
	return _Spirit.Contract.Ascend(&_Spirit.CallOpts, input)
}

// Ascend is a free data retrieval call binding the contract method 0x6a83dac8.
//
// Solidity: function ascend(address input) view returns(uint256, uint256)
func (_Spirit *SpiritCallerSession) Ascend(input common.Address) (*big.Int, *big.Int, error) {
	return _Spirit.Contract.Ascend(&_Spirit.CallOpts, input)
}

// BalanceOf is a free data retrieval call binding the contract method 0x70a08231.
//
// Solidity: function balanceOf(address owner) view returns(uint256)
func (_Spirit *SpiritCaller) BalanceOf(opts *bind.CallOpts, owner common.Address) (*big.Int, error) {
	var out []interface{}
	err := _Spirit.contract.Call(opts, &out, "balanceOf", owner)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// BalanceOf is a free data retrieval call binding the contract method 0x70a08231.
//
// Solidity: function balanceOf(address owner) view returns(uint256)
func (_Spirit *SpiritSession) BalanceOf(owner common.Address) (*big.Int, error) {
	return _Spirit.Contract.BalanceOf(&_Spirit.CallOpts, owner)
}

// BalanceOf is a free data retrieval call binding the contract method 0x70a08231.
//
// Solidity: function balanceOf(address owner) view returns(uint256)
func (_Spirit *SpiritCallerSession) BalanceOf(owner common.Address) (*big.Int, error) {
	return _Spirit.Contract.BalanceOf(&_Spirit.CallOpts, owner)
}

// Generate is a free data retrieval call binding the contract method 0x5de2cec5.
//
// Solidity: function generate(uint256 tokenId, bool origin) view returns((string,string,string,uint256,uint256,uint256,uint256,uint256,uint256,uint256))
func (_Spirit *SpiritCaller) Generate(opts *bind.CallOpts, tokenId *big.Int, origin bool) (BoxInfo, error) {
	var out []interface{}
	err := _Spirit.contract.Call(opts, &out, "generate", tokenId, origin)

	if err != nil {
		return *new(BoxInfo), err
	}

	out0 := *abi.ConvertType(out[0], new(BoxInfo)).(*BoxInfo)

	return out0, err

}

// Generate is a free data retrieval call binding the contract method 0x5de2cec5.
//
// Solidity: function generate(uint256 tokenId, bool origin) view returns((string,string,string,uint256,uint256,uint256,uint256,uint256,uint256,uint256))
func (_Spirit *SpiritSession) Generate(tokenId *big.Int, origin bool) (BoxInfo, error) {
	return _Spirit.Contract.Generate(&_Spirit.CallOpts, tokenId, origin)
}

// Generate is a free data retrieval call binding the contract method 0x5de2cec5.
//
// Solidity: function generate(uint256 tokenId, bool origin) view returns((string,string,string,uint256,uint256,uint256,uint256,uint256,uint256,uint256))
func (_Spirit *SpiritCallerSession) Generate(tokenId *big.Int, origin bool) (BoxInfo, error) {
	return _Spirit.Contract.Generate(&_Spirit.CallOpts, tokenId, origin)
}

// GetApproved is a free data retrieval call binding the contract method 0x081812fc.
//
// Solidity: function getApproved(uint256 tokenId) view returns(address)
func (_Spirit *SpiritCaller) GetApproved(opts *bind.CallOpts, tokenId *big.Int) (common.Address, error) {
	var out []interface{}
	err := _Spirit.contract.Call(opts, &out, "getApproved", tokenId)

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// GetApproved is a free data retrieval call binding the contract method 0x081812fc.
//
// Solidity: function getApproved(uint256 tokenId) view returns(address)
func (_Spirit *SpiritSession) GetApproved(tokenId *big.Int) (common.Address, error) {
	return _Spirit.Contract.GetApproved(&_Spirit.CallOpts, tokenId)
}

// GetApproved is a free data retrieval call binding the contract method 0x081812fc.
//
// Solidity: function getApproved(uint256 tokenId) view returns(address)
func (_Spirit *SpiritCallerSession) GetApproved(tokenId *big.Int) (common.Address, error) {
	return _Spirit.Contract.GetApproved(&_Spirit.CallOpts, tokenId)
}

// IsApprovedForAll is a free data retrieval call binding the contract method 0xe985e9c5.
//
// Solidity: function isApprovedForAll(address owner, address operator) view returns(bool)
func (_Spirit *SpiritCaller) IsApprovedForAll(opts *bind.CallOpts, owner common.Address, operator common.Address) (bool, error) {
	var out []interface{}
	err := _Spirit.contract.Call(opts, &out, "isApprovedForAll", owner, operator)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// IsApprovedForAll is a free data retrieval call binding the contract method 0xe985e9c5.
//
// Solidity: function isApprovedForAll(address owner, address operator) view returns(bool)
func (_Spirit *SpiritSession) IsApprovedForAll(owner common.Address, operator common.Address) (bool, error) {
	return _Spirit.Contract.IsApprovedForAll(&_Spirit.CallOpts, owner, operator)
}

// IsApprovedForAll is a free data retrieval call binding the contract method 0xe985e9c5.
//
// Solidity: function isApprovedForAll(address owner, address operator) view returns(bool)
func (_Spirit *SpiritCallerSession) IsApprovedForAll(owner common.Address, operator common.Address) (bool, error) {
	return _Spirit.Contract.IsApprovedForAll(&_Spirit.CallOpts, owner, operator)
}

// Lucky is a free data retrieval call binding the contract method 0x1e558390.
//
// Solidity: function lucky(address input) view returns(bool)
func (_Spirit *SpiritCaller) Lucky(opts *bind.CallOpts, input common.Address) (bool, error) {
	var out []interface{}
	err := _Spirit.contract.Call(opts, &out, "lucky", input)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// Lucky is a free data retrieval call binding the contract method 0x1e558390.
//
// Solidity: function lucky(address input) view returns(bool)
func (_Spirit *SpiritSession) Lucky(input common.Address) (bool, error) {
	return _Spirit.Contract.Lucky(&_Spirit.CallOpts, input)
}

// Lucky is a free data retrieval call binding the contract method 0x1e558390.
//
// Solidity: function lucky(address input) view returns(bool)
func (_Spirit *SpiritCallerSession) Lucky(input common.Address) (bool, error) {
	return _Spirit.Contract.Lucky(&_Spirit.CallOpts, input)
}

// Name is a free data retrieval call binding the contract method 0x06fdde03.
//
// Solidity: function name() view returns(string)
func (_Spirit *SpiritCaller) Name(opts *bind.CallOpts) (string, error) {
	var out []interface{}
	err := _Spirit.contract.Call(opts, &out, "name")

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// Name is a free data retrieval call binding the contract method 0x06fdde03.
//
// Solidity: function name() view returns(string)
func (_Spirit *SpiritSession) Name() (string, error) {
	return _Spirit.Contract.Name(&_Spirit.CallOpts)
}

// Name is a free data retrieval call binding the contract method 0x06fdde03.
//
// Solidity: function name() view returns(string)
func (_Spirit *SpiritCallerSession) Name() (string, error) {
	return _Spirit.Contract.Name(&_Spirit.CallOpts)
}

// OwnerOf is a free data retrieval call binding the contract method 0x6352211e.
//
// Solidity: function ownerOf(uint256 tokenId) view returns(address)
func (_Spirit *SpiritCaller) OwnerOf(opts *bind.CallOpts, tokenId *big.Int) (common.Address, error) {
	var out []interface{}
	err := _Spirit.contract.Call(opts, &out, "ownerOf", tokenId)

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// OwnerOf is a free data retrieval call binding the contract method 0x6352211e.
//
// Solidity: function ownerOf(uint256 tokenId) view returns(address)
func (_Spirit *SpiritSession) OwnerOf(tokenId *big.Int) (common.Address, error) {
	return _Spirit.Contract.OwnerOf(&_Spirit.CallOpts, tokenId)
}

// OwnerOf is a free data retrieval call binding the contract method 0x6352211e.
//
// Solidity: function ownerOf(uint256 tokenId) view returns(address)
func (_Spirit *SpiritCallerSession) OwnerOf(tokenId *big.Int) (common.Address, error) {
	return _Spirit.Contract.OwnerOf(&_Spirit.CallOpts, tokenId)
}

// StarterPackLimit is a free data retrieval call binding the contract method 0x0a62186e.
//
// Solidity: function starterPackLimit() view returns(uint256)
func (_Spirit *SpiritCaller) StarterPackLimit(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _Spirit.contract.Call(opts, &out, "starterPackLimit")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// StarterPackLimit is a free data retrieval call binding the contract method 0x0a62186e.
//
// Solidity: function starterPackLimit() view returns(uint256)
func (_Spirit *SpiritSession) StarterPackLimit() (*big.Int, error) {
	return _Spirit.Contract.StarterPackLimit(&_Spirit.CallOpts)
}

// StarterPackLimit is a free data retrieval call binding the contract method 0x0a62186e.
//
// Solidity: function starterPackLimit() view returns(uint256)
func (_Spirit *SpiritCallerSession) StarterPackLimit() (*big.Int, error) {
	return _Spirit.Contract.StarterPackLimit(&_Spirit.CallOpts)
}

// SupportsInterface is a free data retrieval call binding the contract method 0x01ffc9a7.
//
// Solidity: function supportsInterface(bytes4 interfaceId) view returns(bool)
func (_Spirit *SpiritCaller) SupportsInterface(opts *bind.CallOpts, interfaceId [4]byte) (bool, error) {
	var out []interface{}
	err := _Spirit.contract.Call(opts, &out, "supportsInterface", interfaceId)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// SupportsInterface is a free data retrieval call binding the contract method 0x01ffc9a7.
//
// Solidity: function supportsInterface(bytes4 interfaceId) view returns(bool)
func (_Spirit *SpiritSession) SupportsInterface(interfaceId [4]byte) (bool, error) {
	return _Spirit.Contract.SupportsInterface(&_Spirit.CallOpts, interfaceId)
}

// SupportsInterface is a free data retrieval call binding the contract method 0x01ffc9a7.
//
// Solidity: function supportsInterface(bytes4 interfaceId) view returns(bool)
func (_Spirit *SpiritCallerSession) SupportsInterface(interfaceId [4]byte) (bool, error) {
	return _Spirit.Contract.SupportsInterface(&_Spirit.CallOpts, interfaceId)
}

// Symbol is a free data retrieval call binding the contract method 0x95d89b41.
//
// Solidity: function symbol() view returns(string)
func (_Spirit *SpiritCaller) Symbol(opts *bind.CallOpts) (string, error) {
	var out []interface{}
	err := _Spirit.contract.Call(opts, &out, "symbol")

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// Symbol is a free data retrieval call binding the contract method 0x95d89b41.
//
// Solidity: function symbol() view returns(string)
func (_Spirit *SpiritSession) Symbol() (string, error) {
	return _Spirit.Contract.Symbol(&_Spirit.CallOpts)
}

// Symbol is a free data retrieval call binding the contract method 0x95d89b41.
//
// Solidity: function symbol() view returns(string)
func (_Spirit *SpiritCallerSession) Symbol() (string, error) {
	return _Spirit.Contract.Symbol(&_Spirit.CallOpts)
}

// TimeFreeze is a free data retrieval call binding the contract method 0x2bfa30b5.
//
// Solidity: function timeFreeze(address input) view returns(bool)
func (_Spirit *SpiritCaller) TimeFreeze(opts *bind.CallOpts, input common.Address) (bool, error) {
	var out []interface{}
	err := _Spirit.contract.Call(opts, &out, "timeFreeze", input)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// TimeFreeze is a free data retrieval call binding the contract method 0x2bfa30b5.
//
// Solidity: function timeFreeze(address input) view returns(bool)
func (_Spirit *SpiritSession) TimeFreeze(input common.Address) (bool, error) {
	return _Spirit.Contract.TimeFreeze(&_Spirit.CallOpts, input)
}

// TimeFreeze is a free data retrieval call binding the contract method 0x2bfa30b5.
//
// Solidity: function timeFreeze(address input) view returns(bool)
func (_Spirit *SpiritCallerSession) TimeFreeze(input common.Address) (bool, error) {
	return _Spirit.Contract.TimeFreeze(&_Spirit.CallOpts, input)
}

// TokenURI is a free data retrieval call binding the contract method 0xc87b56dd.
//
// Solidity: function tokenURI(uint256 tokenId) view returns(string)
func (_Spirit *SpiritCaller) TokenURI(opts *bind.CallOpts, tokenId *big.Int) (string, error) {
	var out []interface{}
	err := _Spirit.contract.Call(opts, &out, "tokenURI", tokenId)

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// TokenURI is a free data retrieval call binding the contract method 0xc87b56dd.
//
// Solidity: function tokenURI(uint256 tokenId) view returns(string)
func (_Spirit *SpiritSession) TokenURI(tokenId *big.Int) (string, error) {
	return _Spirit.Contract.TokenURI(&_Spirit.CallOpts, tokenId)
}

// TokenURI is a free data retrieval call binding the contract method 0xc87b56dd.
//
// Solidity: function tokenURI(uint256 tokenId) view returns(string)
func (_Spirit *SpiritCallerSession) TokenURI(tokenId *big.Int) (string, error) {
	return _Spirit.Contract.TokenURI(&_Spirit.CallOpts, tokenId)
}

// AddLimit is a paid mutator transaction binding the contract method 0x674094b9.
//
// Solidity: function addLimit(uint256 input) returns()
func (_Spirit *SpiritTransactor) AddLimit(opts *bind.TransactOpts, input *big.Int) (*types.Transaction, error) {
	return _Spirit.contract.Transact(opts, "addLimit", input)
}

// AddLimit is a paid mutator transaction binding the contract method 0x674094b9.
//
// Solidity: function addLimit(uint256 input) returns()
func (_Spirit *SpiritSession) AddLimit(input *big.Int) (*types.Transaction, error) {
	return _Spirit.Contract.AddLimit(&_Spirit.TransactOpts, input)
}

// AddLimit is a paid mutator transaction binding the contract method 0x674094b9.
//
// Solidity: function addLimit(uint256 input) returns()
func (_Spirit *SpiritTransactorSession) AddLimit(input *big.Int) (*types.Transaction, error) {
	return _Spirit.Contract.AddLimit(&_Spirit.TransactOpts, input)
}

// Approve is a paid mutator transaction binding the contract method 0x095ea7b3.
//
// Solidity: function approve(address to, uint256 tokenId) returns()
func (_Spirit *SpiritTransactor) Approve(opts *bind.TransactOpts, to common.Address, tokenId *big.Int) (*types.Transaction, error) {
	return _Spirit.contract.Transact(opts, "approve", to, tokenId)
}

// Approve is a paid mutator transaction binding the contract method 0x095ea7b3.
//
// Solidity: function approve(address to, uint256 tokenId) returns()
func (_Spirit *SpiritSession) Approve(to common.Address, tokenId *big.Int) (*types.Transaction, error) {
	return _Spirit.Contract.Approve(&_Spirit.TransactOpts, to, tokenId)
}

// Approve is a paid mutator transaction binding the contract method 0x095ea7b3.
//
// Solidity: function approve(address to, uint256 tokenId) returns()
func (_Spirit *SpiritTransactorSession) Approve(to common.Address, tokenId *big.Int) (*types.Transaction, error) {
	return _Spirit.Contract.Approve(&_Spirit.TransactOpts, to, tokenId)
}

// Burn is a paid mutator transaction binding the contract method 0x42966c68.
//
// Solidity: function burn(uint256 tokenId) returns()
func (_Spirit *SpiritTransactor) Burn(opts *bind.TransactOpts, tokenId *big.Int) (*types.Transaction, error) {
	return _Spirit.contract.Transact(opts, "burn", tokenId)
}

// Burn is a paid mutator transaction binding the contract method 0x42966c68.
//
// Solidity: function burn(uint256 tokenId) returns()
func (_Spirit *SpiritSession) Burn(tokenId *big.Int) (*types.Transaction, error) {
	return _Spirit.Contract.Burn(&_Spirit.TransactOpts, tokenId)
}

// Burn is a paid mutator transaction binding the contract method 0x42966c68.
//
// Solidity: function burn(uint256 tokenId) returns()
func (_Spirit *SpiritTransactorSession) Burn(tokenId *big.Int) (*types.Transaction, error) {
	return _Spirit.Contract.Burn(&_Spirit.TransactOpts, tokenId)
}

// IncreaseFade is a paid mutator transaction binding the contract method 0x5e0b3562.
//
// Solidity: function increaseFade(uint256[] tokenId, uint256[] amount, uint256[] burn) returns()
func (_Spirit *SpiritTransactor) IncreaseFade(opts *bind.TransactOpts, tokenId []*big.Int, amount []*big.Int, burn []*big.Int) (*types.Transaction, error) {
	return _Spirit.contract.Transact(opts, "increaseFade", tokenId, amount, burn)
}

// IncreaseFade is a paid mutator transaction binding the contract method 0x5e0b3562.
//
// Solidity: function increaseFade(uint256[] tokenId, uint256[] amount, uint256[] burn) returns()
func (_Spirit *SpiritSession) IncreaseFade(tokenId []*big.Int, amount []*big.Int, burn []*big.Int) (*types.Transaction, error) {
	return _Spirit.Contract.IncreaseFade(&_Spirit.TransactOpts, tokenId, amount, burn)
}

// IncreaseFade is a paid mutator transaction binding the contract method 0x5e0b3562.
//
// Solidity: function increaseFade(uint256[] tokenId, uint256[] amount, uint256[] burn) returns()
func (_Spirit *SpiritTransactorSession) IncreaseFade(tokenId []*big.Int, amount []*big.Int, burn []*big.Int) (*types.Transaction, error) {
	return _Spirit.Contract.IncreaseFade(&_Spirit.TransactOpts, tokenId, amount, burn)
}

// Init is a paid mutator transaction binding the contract method 0x184b9559.
//
// Solidity: function init(address neko, address prisma, address shard) returns()
func (_Spirit *SpiritTransactor) Init(opts *bind.TransactOpts, neko common.Address, prisma common.Address, shard common.Address) (*types.Transaction, error) {
	return _Spirit.contract.Transact(opts, "init", neko, prisma, shard)
}

// Init is a paid mutator transaction binding the contract method 0x184b9559.
//
// Solidity: function init(address neko, address prisma, address shard) returns()
func (_Spirit *SpiritSession) Init(neko common.Address, prisma common.Address, shard common.Address) (*types.Transaction, error) {
	return _Spirit.Contract.Init(&_Spirit.TransactOpts, neko, prisma, shard)
}

// Init is a paid mutator transaction binding the contract method 0x184b9559.
//
// Solidity: function init(address neko, address prisma, address shard) returns()
func (_Spirit *SpiritTransactorSession) Init(neko common.Address, prisma common.Address, shard common.Address) (*types.Transaction, error) {
	return _Spirit.Contract.Init(&_Spirit.TransactOpts, neko, prisma, shard)
}

// SafeTransferFrom is a paid mutator transaction binding the contract method 0x42842e0e.
//
// Solidity: function safeTransferFrom(address from, address to, uint256 tokenId) returns()
func (_Spirit *SpiritTransactor) SafeTransferFrom(opts *bind.TransactOpts, from common.Address, to common.Address, tokenId *big.Int) (*types.Transaction, error) {
	return _Spirit.contract.Transact(opts, "safeTransferFrom", from, to, tokenId)
}

// SafeTransferFrom is a paid mutator transaction binding the contract method 0x42842e0e.
//
// Solidity: function safeTransferFrom(address from, address to, uint256 tokenId) returns()
func (_Spirit *SpiritSession) SafeTransferFrom(from common.Address, to common.Address, tokenId *big.Int) (*types.Transaction, error) {
	return _Spirit.Contract.SafeTransferFrom(&_Spirit.TransactOpts, from, to, tokenId)
}

// SafeTransferFrom is a paid mutator transaction binding the contract method 0x42842e0e.
//
// Solidity: function safeTransferFrom(address from, address to, uint256 tokenId) returns()
func (_Spirit *SpiritTransactorSession) SafeTransferFrom(from common.Address, to common.Address, tokenId *big.Int) (*types.Transaction, error) {
	return _Spirit.Contract.SafeTransferFrom(&_Spirit.TransactOpts, from, to, tokenId)
}

// SafeTransferFrom0 is a paid mutator transaction binding the contract method 0xb88d4fde.
//
// Solidity: function safeTransferFrom(address from, address to, uint256 tokenId, bytes data) returns()
func (_Spirit *SpiritTransactor) SafeTransferFrom0(opts *bind.TransactOpts, from common.Address, to common.Address, tokenId *big.Int, data []byte) (*types.Transaction, error) {
	return _Spirit.contract.Transact(opts, "safeTransferFrom0", from, to, tokenId, data)
}

// SafeTransferFrom0 is a paid mutator transaction binding the contract method 0xb88d4fde.
//
// Solidity: function safeTransferFrom(address from, address to, uint256 tokenId, bytes data) returns()
func (_Spirit *SpiritSession) SafeTransferFrom0(from common.Address, to common.Address, tokenId *big.Int, data []byte) (*types.Transaction, error) {
	return _Spirit.Contract.SafeTransferFrom0(&_Spirit.TransactOpts, from, to, tokenId, data)
}

// SafeTransferFrom0 is a paid mutator transaction binding the contract method 0xb88d4fde.
//
// Solidity: function safeTransferFrom(address from, address to, uint256 tokenId, bytes data) returns()
func (_Spirit *SpiritTransactorSession) SafeTransferFrom0(from common.Address, to common.Address, tokenId *big.Int, data []byte) (*types.Transaction, error) {
	return _Spirit.Contract.SafeTransferFrom0(&_Spirit.TransactOpts, from, to, tokenId, data)
}

// SetApprovalForAll is a paid mutator transaction binding the contract method 0xa22cb465.
//
// Solidity: function setApprovalForAll(address operator, bool approved) returns()
func (_Spirit *SpiritTransactor) SetApprovalForAll(opts *bind.TransactOpts, operator common.Address, approved bool) (*types.Transaction, error) {
	return _Spirit.contract.Transact(opts, "setApprovalForAll", operator, approved)
}

// SetApprovalForAll is a paid mutator transaction binding the contract method 0xa22cb465.
//
// Solidity: function setApprovalForAll(address operator, bool approved) returns()
func (_Spirit *SpiritSession) SetApprovalForAll(operator common.Address, approved bool) (*types.Transaction, error) {
	return _Spirit.Contract.SetApprovalForAll(&_Spirit.TransactOpts, operator, approved)
}

// SetApprovalForAll is a paid mutator transaction binding the contract method 0xa22cb465.
//
// Solidity: function setApprovalForAll(address operator, bool approved) returns()
func (_Spirit *SpiritTransactorSession) SetApprovalForAll(operator common.Address, approved bool) (*types.Transaction, error) {
	return _Spirit.Contract.SetApprovalForAll(&_Spirit.TransactOpts, operator, approved)
}

// Stake is a paid mutator transaction binding the contract method 0x0fbf0a93.
//
// Solidity: function stake(uint256[] tokenId) returns()
func (_Spirit *SpiritTransactor) Stake(opts *bind.TransactOpts, tokenId []*big.Int) (*types.Transaction, error) {
	return _Spirit.contract.Transact(opts, "stake", tokenId)
}

// Stake is a paid mutator transaction binding the contract method 0x0fbf0a93.
//
// Solidity: function stake(uint256[] tokenId) returns()
func (_Spirit *SpiritSession) Stake(tokenId []*big.Int) (*types.Transaction, error) {
	return _Spirit.Contract.Stake(&_Spirit.TransactOpts, tokenId)
}

// Stake is a paid mutator transaction binding the contract method 0x0fbf0a93.
//
// Solidity: function stake(uint256[] tokenId) returns()
func (_Spirit *SpiritTransactorSession) Stake(tokenId []*big.Int) (*types.Transaction, error) {
	return _Spirit.Contract.Stake(&_Spirit.TransactOpts, tokenId)
}

// StartTimeFreeze is a paid mutator transaction binding the contract method 0x84ec6d35.
//
// Solidity: function startTimeFreeze(uint256 tokenId) returns()
func (_Spirit *SpiritTransactor) StartTimeFreeze(opts *bind.TransactOpts, tokenId *big.Int) (*types.Transaction, error) {
	return _Spirit.contract.Transact(opts, "startTimeFreeze", tokenId)
}

// StartTimeFreeze is a paid mutator transaction binding the contract method 0x84ec6d35.
//
// Solidity: function startTimeFreeze(uint256 tokenId) returns()
func (_Spirit *SpiritSession) StartTimeFreeze(tokenId *big.Int) (*types.Transaction, error) {
	return _Spirit.Contract.StartTimeFreeze(&_Spirit.TransactOpts, tokenId)
}

// StartTimeFreeze is a paid mutator transaction binding the contract method 0x84ec6d35.
//
// Solidity: function startTimeFreeze(uint256 tokenId) returns()
func (_Spirit *SpiritTransactorSession) StartTimeFreeze(tokenId *big.Int) (*types.Transaction, error) {
	return _Spirit.Contract.StartTimeFreeze(&_Spirit.TransactOpts, tokenId)
}

// StarterPack is a paid mutator transaction binding the contract method 0xa54b3dd0.
//
// Solidity: function starterPack() returns()
func (_Spirit *SpiritTransactor) StarterPack(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Spirit.contract.Transact(opts, "starterPack")
}

// StarterPack is a paid mutator transaction binding the contract method 0xa54b3dd0.
//
// Solidity: function starterPack() returns()
func (_Spirit *SpiritSession) StarterPack() (*types.Transaction, error) {
	return _Spirit.Contract.StarterPack(&_Spirit.TransactOpts)
}

// StarterPack is a paid mutator transaction binding the contract method 0xa54b3dd0.
//
// Solidity: function starterPack() returns()
func (_Spirit *SpiritTransactorSession) StarterPack() (*types.Transaction, error) {
	return _Spirit.Contract.StarterPack(&_Spirit.TransactOpts)
}

// Summon is a paid mutator transaction binding the contract method 0x456abc1f.
//
// Solidity: function summon(address to, uint256 count, uint256 input) returns()
func (_Spirit *SpiritTransactor) Summon(opts *bind.TransactOpts, to common.Address, count *big.Int, input *big.Int) (*types.Transaction, error) {
	return _Spirit.contract.Transact(opts, "summon", to, count, input)
}

// Summon is a paid mutator transaction binding the contract method 0x456abc1f.
//
// Solidity: function summon(address to, uint256 count, uint256 input) returns()
func (_Spirit *SpiritSession) Summon(to common.Address, count *big.Int, input *big.Int) (*types.Transaction, error) {
	return _Spirit.Contract.Summon(&_Spirit.TransactOpts, to, count, input)
}

// Summon is a paid mutator transaction binding the contract method 0x456abc1f.
//
// Solidity: function summon(address to, uint256 count, uint256 input) returns()
func (_Spirit *SpiritTransactorSession) Summon(to common.Address, count *big.Int, input *big.Int) (*types.Transaction, error) {
	return _Spirit.Contract.Summon(&_Spirit.TransactOpts, to, count, input)
}

// TransferFrom is a paid mutator transaction binding the contract method 0x23b872dd.
//
// Solidity: function transferFrom(address from, address to, uint256 tokenId) returns()
func (_Spirit *SpiritTransactor) TransferFrom(opts *bind.TransactOpts, from common.Address, to common.Address, tokenId *big.Int) (*types.Transaction, error) {
	return _Spirit.contract.Transact(opts, "transferFrom", from, to, tokenId)
}

// TransferFrom is a paid mutator transaction binding the contract method 0x23b872dd.
//
// Solidity: function transferFrom(address from, address to, uint256 tokenId) returns()
func (_Spirit *SpiritSession) TransferFrom(from common.Address, to common.Address, tokenId *big.Int) (*types.Transaction, error) {
	return _Spirit.Contract.TransferFrom(&_Spirit.TransactOpts, from, to, tokenId)
}

// TransferFrom is a paid mutator transaction binding the contract method 0x23b872dd.
//
// Solidity: function transferFrom(address from, address to, uint256 tokenId) returns()
func (_Spirit *SpiritTransactorSession) TransferFrom(from common.Address, to common.Address, tokenId *big.Int) (*types.Transaction, error) {
	return _Spirit.Contract.TransferFrom(&_Spirit.TransactOpts, from, to, tokenId)
}

// Upgrade is a paid mutator transaction binding the contract method 0x45977d03.
//
// Solidity: function upgrade(uint256 tokenId) returns()
func (_Spirit *SpiritTransactor) Upgrade(opts *bind.TransactOpts, tokenId *big.Int) (*types.Transaction, error) {
	return _Spirit.contract.Transact(opts, "upgrade", tokenId)
}

// Upgrade is a paid mutator transaction binding the contract method 0x45977d03.
//
// Solidity: function upgrade(uint256 tokenId) returns()
func (_Spirit *SpiritSession) Upgrade(tokenId *big.Int) (*types.Transaction, error) {
	return _Spirit.Contract.Upgrade(&_Spirit.TransactOpts, tokenId)
}

// Upgrade is a paid mutator transaction binding the contract method 0x45977d03.
//
// Solidity: function upgrade(uint256 tokenId) returns()
func (_Spirit *SpiritTransactorSession) Upgrade(tokenId *big.Int) (*types.Transaction, error) {
	return _Spirit.Contract.Upgrade(&_Spirit.TransactOpts, tokenId)
}

// UpgradeAscend is a paid mutator transaction binding the contract method 0x80e4cddf.
//
// Solidity: function upgradeAscend() returns()
func (_Spirit *SpiritTransactor) UpgradeAscend(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Spirit.contract.Transact(opts, "upgradeAscend")
}

// UpgradeAscend is a paid mutator transaction binding the contract method 0x80e4cddf.
//
// Solidity: function upgradeAscend() returns()
func (_Spirit *SpiritSession) UpgradeAscend() (*types.Transaction, error) {
	return _Spirit.Contract.UpgradeAscend(&_Spirit.TransactOpts)
}

// UpgradeAscend is a paid mutator transaction binding the contract method 0x80e4cddf.
//
// Solidity: function upgradeAscend() returns()
func (_Spirit *SpiritTransactorSession) UpgradeAscend() (*types.Transaction, error) {
	return _Spirit.Contract.UpgradeAscend(&_Spirit.TransactOpts)
}

// Withdraw is a paid mutator transaction binding the contract method 0x983d95ce.
//
// Solidity: function withdraw(uint256[] tokenId) returns()
func (_Spirit *SpiritTransactor) Withdraw(opts *bind.TransactOpts, tokenId []*big.Int) (*types.Transaction, error) {
	return _Spirit.contract.Transact(opts, "withdraw", tokenId)
}

// Withdraw is a paid mutator transaction binding the contract method 0x983d95ce.
//
// Solidity: function withdraw(uint256[] tokenId) returns()
func (_Spirit *SpiritSession) Withdraw(tokenId []*big.Int) (*types.Transaction, error) {
	return _Spirit.Contract.Withdraw(&_Spirit.TransactOpts, tokenId)
}

// Withdraw is a paid mutator transaction binding the contract method 0x983d95ce.
//
// Solidity: function withdraw(uint256[] tokenId) returns()
func (_Spirit *SpiritTransactorSession) Withdraw(tokenId []*big.Int) (*types.Transaction, error) {
	return _Spirit.Contract.Withdraw(&_Spirit.TransactOpts, tokenId)
}

// SpiritApprovalIterator is returned from FilterApproval and is used to iterate over the raw logs and unpacked data for Approval events raised by the Spirit contract.
type SpiritApprovalIterator struct {
	Event *SpiritApproval // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *SpiritApprovalIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SpiritApproval)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(SpiritApproval)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *SpiritApprovalIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SpiritApprovalIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SpiritApproval represents a Approval event raised by the Spirit contract.
type SpiritApproval struct {
	Owner    common.Address
	Approved common.Address
	TokenId  *big.Int
	Raw      types.Log // Blockchain specific contextual infos
}

// FilterApproval is a free log retrieval operation binding the contract event 0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925.
//
// Solidity: event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)
func (_Spirit *SpiritFilterer) FilterApproval(opts *bind.FilterOpts, owner []common.Address, approved []common.Address, tokenId []*big.Int) (*SpiritApprovalIterator, error) {

	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}
	var approvedRule []interface{}
	for _, approvedItem := range approved {
		approvedRule = append(approvedRule, approvedItem)
	}
	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}

	logs, sub, err := _Spirit.contract.FilterLogs(opts, "Approval", ownerRule, approvedRule, tokenIdRule)
	if err != nil {
		return nil, err
	}
	return &SpiritApprovalIterator{contract: _Spirit.contract, event: "Approval", logs: logs, sub: sub}, nil
}

// WatchApproval is a free log subscription operation binding the contract event 0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925.
//
// Solidity: event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)
func (_Spirit *SpiritFilterer) WatchApproval(opts *bind.WatchOpts, sink chan<- *SpiritApproval, owner []common.Address, approved []common.Address, tokenId []*big.Int) (event.Subscription, error) {

	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}
	var approvedRule []interface{}
	for _, approvedItem := range approved {
		approvedRule = append(approvedRule, approvedItem)
	}
	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}

	logs, sub, err := _Spirit.contract.WatchLogs(opts, "Approval", ownerRule, approvedRule, tokenIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SpiritApproval)
				if err := _Spirit.contract.UnpackLog(event, "Approval", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseApproval is a log parse operation binding the contract event 0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925.
//
// Solidity: event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)
func (_Spirit *SpiritFilterer) ParseApproval(log types.Log) (*SpiritApproval, error) {
	event := new(SpiritApproval)
	if err := _Spirit.contract.UnpackLog(event, "Approval", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// SpiritApprovalForAllIterator is returned from FilterApprovalForAll and is used to iterate over the raw logs and unpacked data for ApprovalForAll events raised by the Spirit contract.
type SpiritApprovalForAllIterator struct {
	Event *SpiritApprovalForAll // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *SpiritApprovalForAllIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SpiritApprovalForAll)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(SpiritApprovalForAll)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *SpiritApprovalForAllIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SpiritApprovalForAllIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SpiritApprovalForAll represents a ApprovalForAll event raised by the Spirit contract.
type SpiritApprovalForAll struct {
	Owner    common.Address
	Operator common.Address
	Approved bool
	Raw      types.Log // Blockchain specific contextual infos
}

// FilterApprovalForAll is a free log retrieval operation binding the contract event 0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31.
//
// Solidity: event ApprovalForAll(address indexed owner, address indexed operator, bool approved)
func (_Spirit *SpiritFilterer) FilterApprovalForAll(opts *bind.FilterOpts, owner []common.Address, operator []common.Address) (*SpiritApprovalForAllIterator, error) {

	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}
	var operatorRule []interface{}
	for _, operatorItem := range operator {
		operatorRule = append(operatorRule, operatorItem)
	}

	logs, sub, err := _Spirit.contract.FilterLogs(opts, "ApprovalForAll", ownerRule, operatorRule)
	if err != nil {
		return nil, err
	}
	return &SpiritApprovalForAllIterator{contract: _Spirit.contract, event: "ApprovalForAll", logs: logs, sub: sub}, nil
}

// WatchApprovalForAll is a free log subscription operation binding the contract event 0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31.
//
// Solidity: event ApprovalForAll(address indexed owner, address indexed operator, bool approved)
func (_Spirit *SpiritFilterer) WatchApprovalForAll(opts *bind.WatchOpts, sink chan<- *SpiritApprovalForAll, owner []common.Address, operator []common.Address) (event.Subscription, error) {

	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}
	var operatorRule []interface{}
	for _, operatorItem := range operator {
		operatorRule = append(operatorRule, operatorItem)
	}

	logs, sub, err := _Spirit.contract.WatchLogs(opts, "ApprovalForAll", ownerRule, operatorRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SpiritApprovalForAll)
				if err := _Spirit.contract.UnpackLog(event, "ApprovalForAll", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseApprovalForAll is a log parse operation binding the contract event 0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31.
//
// Solidity: event ApprovalForAll(address indexed owner, address indexed operator, bool approved)
func (_Spirit *SpiritFilterer) ParseApprovalForAll(log types.Log) (*SpiritApprovalForAll, error) {
	event := new(SpiritApprovalForAll)
	if err := _Spirit.contract.UnpackLog(event, "ApprovalForAll", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// SpiritResetIterator is returned from FilterReset and is used to iterate over the raw logs and unpacked data for Reset events raised by the Spirit contract.
type SpiritResetIterator struct {
	Event *SpiritReset // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *SpiritResetIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SpiritReset)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(SpiritReset)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *SpiritResetIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SpiritResetIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SpiritReset represents a Reset event raised by the Spirit contract.
type SpiritReset struct {
	TokenId *big.Int
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterReset is a free log retrieval operation binding the contract event 0x01c3cbb0d62726ab09d163873ebf9aed99dd8dc08e57bc938f458132fd178cf6.
//
// Solidity: event Reset(uint256 indexed tokenId)
func (_Spirit *SpiritFilterer) FilterReset(opts *bind.FilterOpts, tokenId []*big.Int) (*SpiritResetIterator, error) {

	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}

	logs, sub, err := _Spirit.contract.FilterLogs(opts, "Reset", tokenIdRule)
	if err != nil {
		return nil, err
	}
	return &SpiritResetIterator{contract: _Spirit.contract, event: "Reset", logs: logs, sub: sub}, nil
}

// WatchReset is a free log subscription operation binding the contract event 0x01c3cbb0d62726ab09d163873ebf9aed99dd8dc08e57bc938f458132fd178cf6.
//
// Solidity: event Reset(uint256 indexed tokenId)
func (_Spirit *SpiritFilterer) WatchReset(opts *bind.WatchOpts, sink chan<- *SpiritReset, tokenId []*big.Int) (event.Subscription, error) {

	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}

	logs, sub, err := _Spirit.contract.WatchLogs(opts, "Reset", tokenIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SpiritReset)
				if err := _Spirit.contract.UnpackLog(event, "Reset", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseReset is a log parse operation binding the contract event 0x01c3cbb0d62726ab09d163873ebf9aed99dd8dc08e57bc938f458132fd178cf6.
//
// Solidity: event Reset(uint256 indexed tokenId)
func (_Spirit *SpiritFilterer) ParseReset(log types.Log) (*SpiritReset, error) {
	event := new(SpiritReset)
	if err := _Spirit.contract.UnpackLog(event, "Reset", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// SpiritSummonIterator is returned from FilterSummon and is used to iterate over the raw logs and unpacked data for Summon events raised by the Spirit contract.
type SpiritSummonIterator struct {
	Event *SpiritSummon // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *SpiritSummonIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SpiritSummon)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(SpiritSummon)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *SpiritSummonIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SpiritSummonIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SpiritSummon represents a Summon event raised by the Spirit contract.
type SpiritSummon struct {
	To      common.Address
	TokenId *big.Int
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterSummon is a free log retrieval operation binding the contract event 0xf2c33f510a56fb8a1a188f0dde2ae413536b05a3d5db693f1881548df8794949.
//
// Solidity: event Summon(address indexed to, uint256 indexed tokenId)
func (_Spirit *SpiritFilterer) FilterSummon(opts *bind.FilterOpts, to []common.Address, tokenId []*big.Int) (*SpiritSummonIterator, error) {

	var toRule []interface{}
	for _, toItem := range to {
		toRule = append(toRule, toItem)
	}
	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}

	logs, sub, err := _Spirit.contract.FilterLogs(opts, "Summon", toRule, tokenIdRule)
	if err != nil {
		return nil, err
	}
	return &SpiritSummonIterator{contract: _Spirit.contract, event: "Summon", logs: logs, sub: sub}, nil
}

// WatchSummon is a free log subscription operation binding the contract event 0xf2c33f510a56fb8a1a188f0dde2ae413536b05a3d5db693f1881548df8794949.
//
// Solidity: event Summon(address indexed to, uint256 indexed tokenId)
func (_Spirit *SpiritFilterer) WatchSummon(opts *bind.WatchOpts, sink chan<- *SpiritSummon, to []common.Address, tokenId []*big.Int) (event.Subscription, error) {

	var toRule []interface{}
	for _, toItem := range to {
		toRule = append(toRule, toItem)
	}
	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}

	logs, sub, err := _Spirit.contract.WatchLogs(opts, "Summon", toRule, tokenIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SpiritSummon)
				if err := _Spirit.contract.UnpackLog(event, "Summon", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseSummon is a log parse operation binding the contract event 0xf2c33f510a56fb8a1a188f0dde2ae413536b05a3d5db693f1881548df8794949.
//
// Solidity: event Summon(address indexed to, uint256 indexed tokenId)
func (_Spirit *SpiritFilterer) ParseSummon(log types.Log) (*SpiritSummon, error) {
	event := new(SpiritSummon)
	if err := _Spirit.contract.UnpackLog(event, "Summon", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// SpiritTimeFreezeIterator is returned from FilterTimeFreeze and is used to iterate over the raw logs and unpacked data for TimeFreeze events raised by the Spirit contract.
type SpiritTimeFreezeIterator struct {
	Event *SpiritTimeFreeze // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *SpiritTimeFreezeIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SpiritTimeFreeze)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(SpiritTimeFreeze)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *SpiritTimeFreezeIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SpiritTimeFreezeIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SpiritTimeFreeze represents a TimeFreeze event raised by the Spirit contract.
type SpiritTimeFreeze struct {
	Sender  common.Address
	TokenId *big.Int
	Time    *big.Int
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterTimeFreeze is a free log retrieval operation binding the contract event 0xe45be87d2d2aa093c931eda59de7d0643b76fdfe8e59f89edf402eacdbdd1384.
//
// Solidity: event TimeFreeze(address indexed sender, uint256 tokenId, uint256 time)
func (_Spirit *SpiritFilterer) FilterTimeFreeze(opts *bind.FilterOpts, sender []common.Address) (*SpiritTimeFreezeIterator, error) {

	var senderRule []interface{}
	for _, senderItem := range sender {
		senderRule = append(senderRule, senderItem)
	}

	logs, sub, err := _Spirit.contract.FilterLogs(opts, "TimeFreeze", senderRule)
	if err != nil {
		return nil, err
	}
	return &SpiritTimeFreezeIterator{contract: _Spirit.contract, event: "TimeFreeze", logs: logs, sub: sub}, nil
}

// WatchTimeFreeze is a free log subscription operation binding the contract event 0xe45be87d2d2aa093c931eda59de7d0643b76fdfe8e59f89edf402eacdbdd1384.
//
// Solidity: event TimeFreeze(address indexed sender, uint256 tokenId, uint256 time)
func (_Spirit *SpiritFilterer) WatchTimeFreeze(opts *bind.WatchOpts, sink chan<- *SpiritTimeFreeze, sender []common.Address) (event.Subscription, error) {

	var senderRule []interface{}
	for _, senderItem := range sender {
		senderRule = append(senderRule, senderItem)
	}

	logs, sub, err := _Spirit.contract.WatchLogs(opts, "TimeFreeze", senderRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SpiritTimeFreeze)
				if err := _Spirit.contract.UnpackLog(event, "TimeFreeze", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseTimeFreeze is a log parse operation binding the contract event 0xe45be87d2d2aa093c931eda59de7d0643b76fdfe8e59f89edf402eacdbdd1384.
//
// Solidity: event TimeFreeze(address indexed sender, uint256 tokenId, uint256 time)
func (_Spirit *SpiritFilterer) ParseTimeFreeze(log types.Log) (*SpiritTimeFreeze, error) {
	event := new(SpiritTimeFreeze)
	if err := _Spirit.contract.UnpackLog(event, "TimeFreeze", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// SpiritTransferIterator is returned from FilterTransfer and is used to iterate over the raw logs and unpacked data for Transfer events raised by the Spirit contract.
type SpiritTransferIterator struct {
	Event *SpiritTransfer // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *SpiritTransferIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SpiritTransfer)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(SpiritTransfer)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *SpiritTransferIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SpiritTransferIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SpiritTransfer represents a Transfer event raised by the Spirit contract.
type SpiritTransfer struct {
	From    common.Address
	To      common.Address
	TokenId *big.Int
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterTransfer is a free log retrieval operation binding the contract event 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef.
//
// Solidity: event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)
func (_Spirit *SpiritFilterer) FilterTransfer(opts *bind.FilterOpts, from []common.Address, to []common.Address, tokenId []*big.Int) (*SpiritTransferIterator, error) {

	var fromRule []interface{}
	for _, fromItem := range from {
		fromRule = append(fromRule, fromItem)
	}
	var toRule []interface{}
	for _, toItem := range to {
		toRule = append(toRule, toItem)
	}
	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}

	logs, sub, err := _Spirit.contract.FilterLogs(opts, "Transfer", fromRule, toRule, tokenIdRule)
	if err != nil {
		return nil, err
	}
	return &SpiritTransferIterator{contract: _Spirit.contract, event: "Transfer", logs: logs, sub: sub}, nil
}

// WatchTransfer is a free log subscription operation binding the contract event 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef.
//
// Solidity: event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)
func (_Spirit *SpiritFilterer) WatchTransfer(opts *bind.WatchOpts, sink chan<- *SpiritTransfer, from []common.Address, to []common.Address, tokenId []*big.Int) (event.Subscription, error) {

	var fromRule []interface{}
	for _, fromItem := range from {
		fromRule = append(fromRule, fromItem)
	}
	var toRule []interface{}
	for _, toItem := range to {
		toRule = append(toRule, toItem)
	}
	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}

	logs, sub, err := _Spirit.contract.WatchLogs(opts, "Transfer", fromRule, toRule, tokenIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SpiritTransfer)
				if err := _Spirit.contract.UnpackLog(event, "Transfer", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseTransfer is a log parse operation binding the contract event 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef.
//
// Solidity: event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)
func (_Spirit *SpiritFilterer) ParseTransfer(log types.Log) (*SpiritTransfer, error) {
	event := new(SpiritTransfer)
	if err := _Spirit.contract.UnpackLog(event, "Transfer", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// SpiritUpgradeIterator is returned from FilterUpgrade and is used to iterate over the raw logs and unpacked data for Upgrade events raised by the Spirit contract.
type SpiritUpgradeIterator struct {
	Event *SpiritUpgrade // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *SpiritUpgradeIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SpiritUpgrade)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(SpiritUpgrade)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *SpiritUpgradeIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SpiritUpgradeIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SpiritUpgrade represents a Upgrade event raised by the Spirit contract.
type SpiritUpgrade struct {
	Sender     common.Address
	TokenId    *big.Int
	NewLevel   *big.Int
	NekoCount  *big.Int
	PrismCount *big.Int
	Raw        types.Log // Blockchain specific contextual infos
}

// FilterUpgrade is a free log retrieval operation binding the contract event 0xa0ad55fd11cc19ae2402e185f0103dc5a70da0930212e8db8d1b5020fa15728c.
//
// Solidity: event Upgrade(address indexed sender, uint256 indexed tokenId, uint256 newLevel, uint256 nekoCount, uint256 prismCount)
func (_Spirit *SpiritFilterer) FilterUpgrade(opts *bind.FilterOpts, sender []common.Address, tokenId []*big.Int) (*SpiritUpgradeIterator, error) {

	var senderRule []interface{}
	for _, senderItem := range sender {
		senderRule = append(senderRule, senderItem)
	}
	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}

	logs, sub, err := _Spirit.contract.FilterLogs(opts, "Upgrade", senderRule, tokenIdRule)
	if err != nil {
		return nil, err
	}
	return &SpiritUpgradeIterator{contract: _Spirit.contract, event: "Upgrade", logs: logs, sub: sub}, nil
}

// WatchUpgrade is a free log subscription operation binding the contract event 0xa0ad55fd11cc19ae2402e185f0103dc5a70da0930212e8db8d1b5020fa15728c.
//
// Solidity: event Upgrade(address indexed sender, uint256 indexed tokenId, uint256 newLevel, uint256 nekoCount, uint256 prismCount)
func (_Spirit *SpiritFilterer) WatchUpgrade(opts *bind.WatchOpts, sink chan<- *SpiritUpgrade, sender []common.Address, tokenId []*big.Int) (event.Subscription, error) {

	var senderRule []interface{}
	for _, senderItem := range sender {
		senderRule = append(senderRule, senderItem)
	}
	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}

	logs, sub, err := _Spirit.contract.WatchLogs(opts, "Upgrade", senderRule, tokenIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SpiritUpgrade)
				if err := _Spirit.contract.UnpackLog(event, "Upgrade", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseUpgrade is a log parse operation binding the contract event 0xa0ad55fd11cc19ae2402e185f0103dc5a70da0930212e8db8d1b5020fa15728c.
//
// Solidity: event Upgrade(address indexed sender, uint256 indexed tokenId, uint256 newLevel, uint256 nekoCount, uint256 prismCount)
func (_Spirit *SpiritFilterer) ParseUpgrade(log types.Log) (*SpiritUpgrade, error) {
	event := new(SpiritUpgrade)
	if err := _Spirit.contract.UnpackLog(event, "Upgrade", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// SpiritUpgradeAscendIterator is returned from FilterUpgradeAscend and is used to iterate over the raw logs and unpacked data for UpgradeAscend events raised by the Spirit contract.
type SpiritUpgradeAscendIterator struct {
	Event *SpiritUpgradeAscend // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *SpiritUpgradeAscendIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(SpiritUpgradeAscend)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(SpiritUpgradeAscend)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *SpiritUpgradeAscendIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *SpiritUpgradeAscendIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// SpiritUpgradeAscend represents a UpgradeAscend event raised by the Spirit contract.
type SpiritUpgradeAscend struct {
	Sender    common.Address
	NewLevel  *big.Int
	NekoCount *big.Int
	Prism     *big.Int
	Raw       types.Log // Blockchain specific contextual infos
}

// FilterUpgradeAscend is a free log retrieval operation binding the contract event 0xf7bcaca06e1a63376378ab09a4c6c9a5ff0eb588f4ac9376c5a5a495d69d086f.
//
// Solidity: event UpgradeAscend(address indexed sender, uint256 newLevel, uint256 nekoCount, uint256 prism)
func (_Spirit *SpiritFilterer) FilterUpgradeAscend(opts *bind.FilterOpts, sender []common.Address) (*SpiritUpgradeAscendIterator, error) {

	var senderRule []interface{}
	for _, senderItem := range sender {
		senderRule = append(senderRule, senderItem)
	}

	logs, sub, err := _Spirit.contract.FilterLogs(opts, "UpgradeAscend", senderRule)
	if err != nil {
		return nil, err
	}
	return &SpiritUpgradeAscendIterator{contract: _Spirit.contract, event: "UpgradeAscend", logs: logs, sub: sub}, nil
}

// WatchUpgradeAscend is a free log subscription operation binding the contract event 0xf7bcaca06e1a63376378ab09a4c6c9a5ff0eb588f4ac9376c5a5a495d69d086f.
//
// Solidity: event UpgradeAscend(address indexed sender, uint256 newLevel, uint256 nekoCount, uint256 prism)
func (_Spirit *SpiritFilterer) WatchUpgradeAscend(opts *bind.WatchOpts, sink chan<- *SpiritUpgradeAscend, sender []common.Address) (event.Subscription, error) {

	var senderRule []interface{}
	for _, senderItem := range sender {
		senderRule = append(senderRule, senderItem)
	}

	logs, sub, err := _Spirit.contract.WatchLogs(opts, "UpgradeAscend", senderRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(SpiritUpgradeAscend)
				if err := _Spirit.contract.UnpackLog(event, "UpgradeAscend", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseUpgradeAscend is a log parse operation binding the contract event 0xf7bcaca06e1a63376378ab09a4c6c9a5ff0eb588f4ac9376c5a5a495d69d086f.
//
// Solidity: event UpgradeAscend(address indexed sender, uint256 newLevel, uint256 nekoCount, uint256 prism)
func (_Spirit *SpiritFilterer) ParseUpgradeAscend(log types.Log) (*SpiritUpgradeAscend, error) {
	event := new(SpiritUpgradeAscend)
	if err := _Spirit.contract.UnpackLog(event, "UpgradeAscend", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}
