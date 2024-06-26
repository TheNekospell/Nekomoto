package main

import (
	"backend/internal/database"
	_ "backend/internal/database"
	"backend/internal/indexer"
	"backend/internal/server"
	"backend/internal/tick"
)

func main() {
	database.InitDatabase()
	go tick.StartTicker()
	go indexer.StartIndexer()
	server.StartServer()
}
