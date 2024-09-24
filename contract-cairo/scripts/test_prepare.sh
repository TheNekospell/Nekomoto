
source ./scripts/.shell_config


starkli invoke --watch $NEKO_CONTRACT_SN transfer $TEST u256:250000000000000000000000 --account ./starkli/account --private-key $PRIVATE_KEY

starkli invoke --watch $PRISM_CONTRACT_SN mint $TEST u256:1000000000000000000 --account ./starkli/account --private-key $PRIVATE_KEY
