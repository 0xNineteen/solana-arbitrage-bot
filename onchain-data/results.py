#%%
import pathlib
import json

#%%
dir = pathlib.Path("results/")
signer_data = {}
for path in dir.iterdir():
    signer = path.name.split("_")[0]
    with open(path, 'r') as f:
        data = json.load(f)
    signer_data[signer] = data

#%%
signers = []
amount_per_second = []

for k, v in signer_data.items():
    profit = v['total_profit']
    times = v['time_interval'].split('-')
    # [days, hours, minutes, seconds]
    all_times = []
    for i, time in enumerate(times):
        amount = 3 if i != 0 else 2
        all_times.append(int(time[:amount]))
    
    total_time = 0 
    total_time += all_times[0] * 24 * 60 * 60 # seconds
    total_time += all_times[1] * 60 * 60 # seconds
    total_time += all_times[2] * 60 # seconds
    total_time += all_times[3]# seconds
    
    signers.append(k)
    amount_per_second.append(profit / total_time)

#%%
import numpy as np 
largest_idxs = (-np.array(amount_per_second)).argsort()
for count, idx in enumerate(largest_idxs):
    print("#{}".format(count))   
    s = signers[idx] 
    print("\t signer: {}".format(s))    
    print("\t USDC profit/second: {}".format(amount_per_second[idx]))    
    print("\t total USDC profit: {}".format(signer_data[s]['total_profit']))    
    print("\t time interval: {}".format(signer_data[s]['time_interval']))    
    print("\t other: {}".format(signer_data[s]))    

#%
# %%
