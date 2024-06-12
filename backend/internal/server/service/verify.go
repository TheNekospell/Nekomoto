package service

import (
	"backend/internal/database"
	"fmt"
	"strconv"

	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/crypto"
)

func ValidSignature(address, message, signature string) error {

	if text := database.GetAddressSignatureContext(address); text != message {
		return fmt.Errorf("signature expired. expect: %v, actual: %v", text, message)
	}

	hashedMessage := []byte("\x19Ethereum Signed Message:\n" + strconv.Itoa(len(message)) + message)
	hash := crypto.Keccak256Hash(hashedMessage)
	//fmt.Printf("hash: %x\n", hash)

	decodedMessage, err := hexutil.Decode(signature)
	if err != nil {
		return err
	}
	if decodedMessage[64] == 27 || decodedMessage[64] == 28 {
		decodedMessage[64] -= 27
	}

	sigPublicKeyECDSA, err := crypto.SigToPub(hash.Bytes(), decodedMessage)
	if sigPublicKeyECDSA == nil {
		err = fmt.Errorf("could not get a public get from the message signature")
	}
	if err != nil {
		return err
	}

	publicKey := crypto.PubkeyToAddress(*sigPublicKeyECDSA).String()
	if publicKey != address {
		return fmt.Errorf("signature not same with expect. expect: %v, actual: %v", address, publicKey)
	}

	database.ExpireSignatureContext(address)

	return nil
}
