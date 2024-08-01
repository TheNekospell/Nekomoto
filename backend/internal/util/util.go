package util

import "strings"

func CleanAddress(address string) string {
	if len(address) > 66 {
		address = "0x" + address[len(address)-64:]
	} else if len(address) < 66 {
		address = "0x" + strings.Repeat("0", 66-len(address)) + address[2:]
	}
	return address
}
