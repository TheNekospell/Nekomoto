
source ./scripts/.shell_config

echo "test and build..."
scarb --release build

CLASS_HASH_COIN=$(starkli declare --watch ./target/release/nekomoto_Nekocoin.contract_class.json --account ./starkli/account --private-key $PRIVATE_KEY | tail -n 1)

ADDRESS_COIN=$(starkli deploy --watch $CLASS_HASH_COIN u256:2000000000000000000000000000 $HOST --account ./starkli/account --private-key $PRIVATE_KEY | tail -n 1)

CLASS_HASH_PRISM=$(starkli declare --watch ./target/release/nekomoto_Prism.contract_class.json --account ./starkli/account --private-key $PRIVATE_KEY | tail -n 1)

ADDRESS_PRISM=$(starkli deploy --watch $CLASS_HASH_PRISM $HOST --account ./starkli/account --private-key $PRIVATE_KEY | tail -n 1)

CLASS_HASH_MOTO=$(starkli declare --watch ./target/release/nekomoto_Nekomoto.contract_class.json --account ./starkli/account --private-key $PRIVATE_KEY | tail -n 1)

ADDRESS_MOTO=$(starkli deploy --watch $CLASS_HASH_MOTO $ADDRESS_COIN $ADDRESS_PRISM $ADDRESS_SHARD $HOST --account ./starkli/account --private-key $PRIVATE_KEY | tail -n 1)

starkli invoke --watch $ADDRESS_COIN init $ADDRESS_MOTO --account ./starkli/account --private-key $PRIVATE_KEY

starkli invoke --watch $ADDRESS_PRISM init $ADDRESS_MOTO --account ./starkli/account --private-key $PRIVATE_KEY

# 30% initial liquidity
# faucet for now
starkli invoke --watch $ADDRESS_COIN approve $ADDRESS_MOTO u256:300000000000000000000000000 --account ./starkli/account --private-key $PRIVATE_KEY

# 10% airdrop
# starkli invoke --watch $ADDRESS_COIN approve xxx u256:200000000000000000000000000 --account ./starkli/account --private-key $PRIVATE_KEY

echo "BOX: $CLASS_HASH_MOTO"
echo "COIN: $CLASS_HASH_COIN"
echo "PRISM: $CLASS_HASH_PRISM"

echo "BOX_CONTRACT_SN=$ADDRESS_MOTO"
echo "NEKO_CONTRACT_SN=$ADDRESS_COIN"
echo "PRISM_CONTRACT_SN=$ADDRESS_PRISM"
echo "OWNER_ADDRESS_SN=$HOST"
