source ./scripts/.shell_config

starkli invoke --watch $BOX_CONTRACT_SN summon $TEST u256:20 u256:7777 --account ./starkli/account --private-key $PRIVATE_KEY