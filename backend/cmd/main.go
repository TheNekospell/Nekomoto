package main

import (
	_ "backend/internal/database"
	"backend/internal/indexer"
	"backend/internal/server"
	"backend/internal/tick"
)

func main() {
	go tick.StartTicker()
	go indexer.StartIndexer()
	server.StartServer()
}
