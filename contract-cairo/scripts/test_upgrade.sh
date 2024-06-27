source ./scripts/.shell_config

starkli invoke --watch $BOX_CONTRACT_SN stake 0x1 u256:1 --account ./starkli/account_test --private-key $TEST_PRIVATE_KEY

for i in {1..12}
do
starkli invoke --watch $BOX_CONTRACT_SN upgrade u256:1 --account ./starkli/account_test --private-key $TEST_PRIVATE_KEY
done