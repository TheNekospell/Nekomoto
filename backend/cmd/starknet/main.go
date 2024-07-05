package main

import (
	"backend/internal/database"
	"backend/internal/indexer_sn"
	"backend/internal/server"
	"backend/internal/tick"
)

func main() {
	database.InitDatabaseSn()
	go tick.StartTicker()
	go indexer_sn.StartIndexer()
	server.StartServer()
}
