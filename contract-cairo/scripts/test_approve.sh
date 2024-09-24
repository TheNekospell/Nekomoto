
source ./scripts/.shell_config

starkli invoke --watch $NEKO_CONTRACT_SN approve $BOX_CONTRACT_SN u256:20000000000000000000000000 --account ./starkli/account_test --private-key $TEST_PRIVATE_KEY

starkli invoke --watch $PRISM_CONTRACT_SN approve $BOX_CONTRACT_SN u256:20000000000000000000000000 --account ./starkli/account_test --private-key $TEST_PRIVATE_KEY
