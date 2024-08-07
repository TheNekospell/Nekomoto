#

## Contracts Solidity

```bash
cd contract-solidity
npm i
npx hardhat compile
npx hardhat run scripts/deploy.ts --network xxx
npx hardhat verify 0xaaaa --network xxx
```

## Contract Cairo

```bash
# check this version
scarb --version
# scarb 2.6.5 (d49f54394 2024-06-11)
# cairo: 2.6.4 (https://crates.io/crates/cairo-lang-compiler/2.6.4)
# sierra: 1.5.0

cd contract-cairo
scarb --release build
# scarb build
scarb test
```

## Server

```bash
cd backend
abigen --abi ./internal/chain/abi/spirit.abi --pkg chain --type spirit --out ./internal/chain/spirit.go
abigen --abi ./internal/chain/abi/neko.abi --pkg chain --type neko --out ./internal/chain/neko.go
abigen --abi ./internal/chain/abi/prism.abi --pkg chain --type prism --out ./internal/chain/prism.go
abigen --abi ./internal/chain/abi/shard.abi --pkg chain --type shard --out ./internal/chain/shard.go
go mod tidy
go run cmd/main.go
```
