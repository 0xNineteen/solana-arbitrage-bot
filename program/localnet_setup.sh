#!/bin/bash

# https://docs.solana.com/getstarted/local
# first, start a local validator with `solana-test-validator` command in other terminal.
# then, run this script in this terminal.
# solana config set --url localhost

# create a new keypair
# if [ ! -d "local_key" ]; then
#     mkdir local_key
# fi

# if [ ! -f "local_key/id.json" ]; then
#     solana-keygen new --outfile local_key/id.json
# fi

# airdrop some lamports to the new keypair
# solana config set -k local_key/id.json
# solana airdrop 20

# # deploy the program
anchor deploy --provider.cluster localnet --program-name tmp 
anchor test --skip-deploy --skip-build --skip-local-validator --provider.cluster localnet

