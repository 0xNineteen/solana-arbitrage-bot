solana config set -u l && # change to localnet 
solana airdrop 100000 $(solana-keygen pubkey localnet_owner.key) &&
echo "setting up owner ATAs" &&
npx ts-node setup_owner.ts &&
cd get_wsol &&
npx ts-node index.ts && 
cd ../../program/ && 
bash local_setup.sh &&
echo "testing arb client" &&
cd ../client && 
cargo test 