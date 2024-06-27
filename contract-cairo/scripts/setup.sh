# chmod -R +x ../scripts

echo "account address:"
read ADDRESS

# echo "private key:"
# read PRIVATE_KEY

starkli account fetch $ADDRESS --output ./starkli/account
# starkli account fetch $ADDRESS --output ./starkli/account_test

# starkli signer keystore from-key