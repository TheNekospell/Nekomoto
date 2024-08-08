
source ./scripts/.shell_config

read -p "neko_coin hash:" CLASS_HASH_COIN
ADDRESS_COIN=$(starkli deploy --watch $CLASS_HASH_COIN u256:2000000000000000000000000000 $HOST --account ./starkli/account --private-key $PRIVATE_KEY | tail -n 1)

read -p "prism hash:" CLASS_HASH_PRISM
ADDRESS_PRISM=$(starkli deploy --watch $CLASS_HASH_PRISM $HOST --account ./starkli/account --private-key $PRIVATE_KEY | tail -n 1)

read -p "shard hash:" CLASS_HASH_SHARD
ADDRESS_SHARD=$(starkli deploy --watch $CLASS_HASH_SHARD $HOST --account ./starkli/account --private-key $PRIVATE_KEY | tail -n 1)

read -p "nekomoto hash:" CLASS_HASH_MOTO
ADDRESS_MOTO=$(starkli deploy --watch $CLASS_HASH_MOTO $ADDRESS_COIN $ADDRESS_PRISM $ADDRESS_SHARD $HOST --account ./starkli/account --private-key $PRIVATE_KEY | tail -n 1)

starkli invoke --watch $ADDRESS_COIN init $ADDRESS_MOTO --account ./starkli/account --private-key $PRIVATE_KEY

echo "BOX_CONTRACT_SN=$ADDRESS_MOTO"
echo "NEKO_CONTRACT_SN=$ADDRESS_COIN"
echo "PRISM_CONTRACT_SN=$ADDRESS_PRISM"
echo "SHARD_CONTRACT_SN=$ADDRESS_SHARD"
echo "OWNER_ADDRESS_SN=$HOST"

