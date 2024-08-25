import json
import os

# os.system("rm -rf accounts")
os.system("mkdir -p accounts")

mints = json.load(open("saved_mints.json", "r", -1, "utf-8"))
mints_size = len(mints)

accounts = json.load(open("saved_accounts.json", "r", -1, "utf-8"))
accounts_size = len(accounts)


def dump_accounts(accs):
    """
    dump accounts to json files
    """
    size = len(accs)
    for i, acc in enumerate(accs):
        print(f"Processing {i+1}/{size} accounts")
        # if account exists, skip
        if os.path.exists(f"accounts/{acc}.json"):
            print(f"Skipping {acc}, already exists")
            continue
        command = f"solana account {acc} -u m \
            --output json-compact \
            --output-file \
            accounts/{acc}.json"
        os.system(command)


dump_accounts(mints)
dump_accounts(accounts)
