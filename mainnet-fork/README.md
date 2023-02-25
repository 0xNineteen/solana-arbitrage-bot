- `bash init_new_scrape.sh`: start local val with all scrapped accounts 
- `bash setup.sh`: setup + fund all ATAs of owner + deploy and init anchor ARB program

### More Details (maybe outdated)

- `scrape_signature.ts`: scrapes all programs + accounts in signature 
- `setup_validator.py`: downloads all programs + accounts which were scraped + constructs `start_localnet.sh` 
- `start_localnet.sh`: starts `solana-test-validator` with all preloaded things
    - `bash start_localnet.sh`
- `orca_swap.ts`: interact with mainnet orca pools from downloaded signature

- NOTE: need `sh -c "$(curl -sSfL https://release.solana.com/v1.14.13/install)"` 
    - for account dumps + `account-dir` flag for loading large # of accounts

- `get_msol/`: checks msol + another tokens balance -- make sure it == 10 for successful mainnet fork 

## How to fork mainnet with all token balances 
- run `new_scrapte.ts`: scrapes all token accounts + mints of all pools 
    - note: it hacks it and makes `mainnet.key` authority for minting 
- run `setup_validator.py`: loads all accounts and programs which were scrapped 
- run `setup_balances.ts`: mints token balances to ATAs (so we have some of all the tokens)
- run `get_msol/index.ts`: to get some WSOL 
- run `check_ata_balances.ts`: double-check program: should have a balance on all pool tokens :)))))))
- then run the pool quote tests :) 

Note: "`mainnet.key` authority for minting" works whereas hacking to set the token balance > 0 leads to token overflow errors. never figured out why this happens but the mint hack approach works. 