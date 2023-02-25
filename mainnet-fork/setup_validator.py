#%%
import json 
import os 

local_validator_command = "solana-test-validator -r "

local_validator_command += '--account-dir accounts/'

with open("programs.json", 'r') as f:
    programs = json.load(f) 

for prog in programs:
    command = "solana program dump -u m \
        {} \
        programs/{}.so" \
        .format(prog, prog)
    os.system(command)
    local_validator_command += " --bpf-program {} programs/{}.so ".format(prog, prog)

with open('start_localnet.sh', 'w') as f:
    f.write(local_validator_command)
