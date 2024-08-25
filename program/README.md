# anchor_tokenswap

- upgrade program: `anchor upgrade --program-id <program_id> ./target/deploy/tmp.so --provider.cluster mainnet --provider.wallet ../../mainnet.key`
- note to update program 
    - convert to stable cli: `sh -c "$(curl -sSfL https://release.solana.com/stable/install)"` 
    - convert back for mainnet forking util: `sh -c "$(curl -sSfL https://release.solana.com/v1.9.13/install)"`

- Instructions on how to run fork of mainnet are in [mainnet-fork/README.md](../mainnet-fork/README.md)
