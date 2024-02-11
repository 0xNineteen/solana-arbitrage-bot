#!/bin/bash

rm accounts/* 
npx ts-node new_scrape.ts &&
python scrape_accounts.py &&
python hack_mints.py &&
python setup_validator.py &&
bash start_localnet.sh