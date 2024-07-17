source ./scripts/.shell_config

starkli invoke --watch $BOX_CONTRACT_SN withdraw 0x1 u256:1 --account ./starkli/account_test --private-key $TEST_PRIVATE_KEY

