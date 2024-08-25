#!/bin/bash

get_absolute_path() {
    local relative_path="$1"
    if command -v realpath > /dev/null 2>&1; then
        realpath "$relative_path"
    else
        echo "$(cd "$(dirname "$relative_path")"; pwd -P)/$(basename "$relative_path")"
    fi
}

# https://docs.solana.com/getstarted/local
# first, start a local validator with `solana-test-validator` command in other terminal.
# then, run this script in this terminal.
#create a new keypair
# if [ ! -d "local_key" ]; then
#     mkdir local_key
# fi
# if [ ! -f "local_key/id.json" ]; then
#     solana-keygen new --outfile local_key/id.json
# fi
solana config set -k ../mainnet-fork/localnet_owner.key
# solana config set --url localhost




# airdrop some lamports to the new keypair
solana airdrop 20

# # deploy the program
anchor deploy --provider.cluster localnet --program-name tmp 
anchor test --skip-deploy --skip-build --skip-local-validator --provider.cluster localnet

