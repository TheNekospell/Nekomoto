package env

import (
	"fmt"
	"os"

	_ "github.com/joho/godotenv/autoload"
)

func GetEnvValue(key string) string {
	value, exists := os.LookupEnv(key)
	if !exists {
		fmt.Println("[ENV] Environment variable not set: " + key)
		return ""
	}
	return value
}
