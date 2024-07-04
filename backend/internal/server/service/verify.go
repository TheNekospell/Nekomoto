package service

import (
	"backend/internal/invoker_sn"
	"backend/internal/model"
	"fmt"
	"github.com/NethermindEth/starknet.go/curve"
	"github.com/NethermindEth/starknet.go/typed"
	"github.com/NethermindEth/starknet.go/utils"
	"math/big"
)

//func ValidSignature(address, message, signature string) error {
//
//	if text := database.GetAddressSignatureContext(address); text != message {
//		return fmt.Errorf("signature expired. expect: %v, actual: %v", text, message)
//	}
//
//	hashedMessage := []byte("\x19Ethereum Signed Message:\n" + strconv.Itoa(len(message)) + message)
//	hash := crypto.Keccak256Hash(hashedMessage)
//	//fmt.Printf("hash: %x\n", hash)
//
//	decodedMessage, err := hexutil.Decode(signature)
//	if err != nil {
//		return err
//	}
//	if decodedMessage[64] == 27 || decodedMessage[64] == 28 {
//		decodedMessage[64] -= 27
//	}
//
//	sigPublicKeyECDSA, err := crypto.SigToPub(hash.Bytes(), decodedMessage)
//	if sigPublicKeyECDSA == nil {
//		err = fmt.Errorf("could not get a public get from the message signature")
//	}
//	if err != nil {
//		return err
//	}
//
//	publicKey := crypto.PubkeyToAddress(*sigPublicKeyECDSA).String()
//	if publicKey != address {
//		return fmt.Errorf("signature not same with expect. expect: %v, actual: %v", address, publicKey)
//	}
//
//	database.ExpireSignatureContext(address)
//
//	return nil
//}

func ValidSignature(address string, typedData model.TypedData, signature []*big.Int) error {

	// typedData.Message.Content == generate

	starknetTypedData, err := typed.NewTypedData(typedData.Types, typedData.PrimaryType, typedData.Domain)
	if err != nil {
		fmt.Println("new typedData error:", err.Error())
	}

	hash, err := starknetTypedData.GetMessageHash(utils.HexToBN(address), typedData.Message, curve.Curve)
	if err != nil {
		return err
	}

	addressFelt, err := utils.HexToFelt(address)
	if err != nil {
		return err
	}

	err = invoker_sn.ValidSignature(addressFelt, utils.BigIntToFelt(hash), utils.BigIntToFelt(signature[0]), utils.BigIntToFelt(signature[0]))
	if err != nil {
		return err
	}
	return nil

}
