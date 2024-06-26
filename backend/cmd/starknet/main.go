package main

import (
	"backend/internal/database"
	_ "backend/internal/database"
	_ "backend/internal/invoker_sn"
	"backend/internal/tick"
)

func main() {
	database.InitDatabaseSn()
	go tick.StartTicker()
	// go indexer.StartIndexer()
	// server.StartServer()
}
