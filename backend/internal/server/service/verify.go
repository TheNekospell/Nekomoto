package service

import (
	"backend/internal/invoker_sn"
	"backend/internal/model"
	"backend/starknet/curve"
	"backend/starknet/typed"
	"backend/starknet/utils"
	"fmt"
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

func ValidSignature(address string, typedData model.TypedData, signature []string) error {

	// if text := database.GetAddressSignatureContext(address); text != typedData.Message.Content {
	// 	return fmt.Errorf("signature expired. expect: %v, actual: %v", text, typedData.Message.Content)
	// }

	newTypes := make(map[string]typed.TypeDef)

	var definitions []typed.Definition
	for _, v := range typedData.Types.StarkNetDomain {
		definitions = append(definitions, typed.Definition{
			Name: v.Name,
			Type: v.Type,
		})
	}
	newTypes["StarkNetDomain"] = typed.TypeDef{Definitions: definitions}
	var definitionsM []typed.Definition
	for _, v := range typedData.Types.Message {
		definitions = append(definitions, typed.Definition{
			Name: v.Name,
			Type: v.Type,
		})
	}
	newTypes["Message"] = typed.TypeDef{Definitions: definitionsM}

	starknetTypedData, err := typed.NewTypedData(newTypes, typedData.PrimaryType, typedData.Domain)
	if err != nil {
		fmt.Println("new typedData error:", err.Error())
		return err
	}
	//fmt.Println("new typedData:", starknetTypedData)

	hash, err := starknetTypedData.GetMessageHash(utils.HexToBN(address), typedData.Message, curve.Curve)
	if err != nil {
		return err
	}

	addressFelt, err := utils.HexToFelt(address)
	if err != nil {
		return err
	}

	r, e := new(big.Int).SetString(signature[0], 10)
	if !e {
		fmt.Println("set r error:")
	}
	s, e := new(big.Int).SetString(signature[1], 10)
	if !e {
		fmt.Println("set s error:")
	}
	err = invoker_sn.ValidSignature(addressFelt, utils.BigIntToFelt(hash), utils.BigIntToFelt(r), utils.BigIntToFelt(s))
	if err != nil {
		return err
	}
	return nil

}
