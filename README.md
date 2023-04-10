## solana arbitrage bot

happy searching :)

## layout 
- `client/`: off-chain arbitrage bot code 
- `program/`: on-chain swap program
- `pools/`: dex pool metadata
- `onchain-data/`: analysis of other arbitrage swaps
- `mainnet-fork/`: fork mainnet account states to test swap input/output estimates

each folder contains a corresponding `README.md` which explains how it works

## dexs supported 
- serum 
- aldrin 
- saber 
- mercurial 
- orca 

## other notes 
- we use rust unit tests (with mainnet forking) to ensure our swap quotes are correct (quoted swap amount = actual swap amount)
- to figure out how to interface with each dex (most dont have rust sdks or even public ts sdks) we reverse engineer how to interact with them through the jupiter-swap sdk (analyzing the npm package folder bc its also not public) 
- in the client we use a brute-force approach to find arb opportunities instead of negative cycle algos bc its much faster and can find all opportunities
- we also dont calculate the optimal swap input amount for each arb bc its faster to spam multiple decreasing amounts and let the largest one land (this is what the winner of the arbitrage opportunities was doing - eg, send tx with input size N, N/2, N/4, ...) 
- why do we need an on-chain swap program? checkout this [post](https://github.com/0xNineteen/blog.md/blob/8292c9c27b29f7d290f022a097511bb07bda4ea3/contents/rust-macros-arbitrage/index.md) out -- if you swap from A -> B -> C you might get more/less of B than expected which effects the swap instruction to C

## why share this alpha

the life of a lone searcher is a lonely one where you cant share what you find or share your code - while working on this project i realized this is not what im about and thus i open source
