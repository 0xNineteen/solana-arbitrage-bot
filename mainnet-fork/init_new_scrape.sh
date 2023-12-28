rm accounts/* 
npx ts-node new_scrape.ts &&
python setup_validator.py &&
bash start_localnet.sh