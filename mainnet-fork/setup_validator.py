"""
Set up start_localnet.sh script.
"""
import json
import os

LOCAL_VALIDATOR_COMMAND = "solana-test-validator -r "

LOCAL_VALIDATOR_COMMAND += "--account-dir accounts/"

with open(file="programs.json", mode="r", encoding="utf-8") as f:
    programs = json.load(f)

for prog in programs:
    command = f"solana program dump -u m \
        {prog} \
        programs/{prog}.so"
    os.system(command)
    LOCAL_VALIDATOR_COMMAND += f" --bpf-program {prog} programs/{prog}.so "

with open(file="start_localnet.sh", mode="w", encoding="utf-8") as f:
    f.write("#!/bin/bash\n")
    f.write(LOCAL_VALIDATOR_COMMAND)
