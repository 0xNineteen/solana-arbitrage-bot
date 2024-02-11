import json
import os

# os.system("rm -rf accounts")
os.system("mkdir -p accounts")

accounts = json.load(open("saved_accounts.json", "r", -1, "utf-8"))
accounts_size = len(accounts)
mints = json.load(open("saved_mints.json", "r", -1, "utf-8"))
mints_size = len(mints)

# for i, acc in enumerate(accounts):
#     print(f"Processing {i+1}/{accounts_size} accounts")
#     command = f"solana account {acc} -u m \
#         --output json-compact \
#         --output-file \
#         accounts/{acc}.json"
#     os.system(command)

for i, acc in enumerate(mints):
    print(f"Processing {i+1}/{mints_size} mints")
    os.system(f"rm -rf accounts/{acc}.json")
    command = f"solana account {acc} -u m \
        --output json-compact \
        --output-file \
        accounts/{acc}.json"
    os.system(command)
