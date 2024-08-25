#!/bin/bash

# only remove accounts dir if the --reset flag is passed
if [ "$1" == "--reset" ]; then
    rm -rf accounts/*
fi

npx ts-node new_scrape.ts &&
python scrape_accounts.py &&
python hack_mints.py &&
python setup_validator.py &&
bash start_localnet.sh