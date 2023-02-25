import * as token from "@solana/spl-token"
// import * as web3 from "@solana/web3.js";
import * as web3 from "./solana-web3.js";
import bs58 from 'bs58'
import { Buffer } from 'buffer';
const fs = require('fs');
import * as BufferLayout from 'buffer-layout';

import { AccountLayout } from "@solana/spl-token";

// orcaswap ixs 
let orcaswap_instructions = [
    'Initialize',
    'Swap',
    'DepositAllTokenTypes',
    'WithdrawAllTokenTypes',
    'DepositSingleTokenTypeExactAmountIn',
    'WithdrawSingleTokenTypeExactAmountOut',
]

let tokenprogram_instructions = [
    'InitializeMint',
    'InitializeAccount',
    'InitializeMultisig',
    'Transfer',
    'Approve',
    'Revoke',
    'SetAuthority',
    'MintTo',
    'Burn',
    'CloseAccount',
    'FreezeAccount',
    'ThawAccount',
    'TransferChecked',
    'ApproveChecked',
    'MintToChecked',
    'BurnChecked',
    'InitializeAccount2',
    'SyncNative',
    'InitializeAccount3',
    'InitializeMultisig2',
    'InitializeMint2',
    'GetAccountDataSize',
    'InitializeImmutableOwner',
    'UiAmountToAmount',
]

// constants 
let ORCA_SWAP_PROGRAM_ID = "9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP";
let TOKEN_PROGRAM_ID = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";

async function search_signer(signer) {
    // let connection = new web3.Connection("https://api.mainnet-beta.solana.com")

    let connection = new web3.Connection("https://ssc-dao.genesysgo.net/")
    console.log("searching pubkey: ", signer.toString())

    console.log("retrieving signatures...");
    let all_signatures = [];
    var signatures: string[] = (await connection.getSignaturesForAddress(signer)).map((s) => s.signature)
    all_signatures.push(signatures)
    
    // 5 == 6000 signatures 
    // 0 days - 17 hours - 1028 minutes - 61715 seconds
    // 10 == 1,1000 signatures 
    // 0 days - 17 hours - 1028 minutes - 61715 seconds
    let n_sig_iters = 6 
    for (let i=0; i < n_sig_iters; i++) { 
        let last_sig :string = signatures[signatures.length-1];
        let options: web3.SignaturesForAddressOptions = {
            before: last_sig 
        }
        signatures = (await connection.getSignaturesForAddress(signer, options)).map((s) => s.signature)
        all_signatures.push(signatures)
    }
    signatures = all_signatures.flat()
    console.log(`retrieved ${signatures.length} signatures!`);
    
    // get account infos in 99 chunk sizes 
    console.log("retrieving txs...");
    let txs = []
    let array = signatures.flat()
    var i:number ,j, tmp, chunk_size = 150;
    for (i = 0,j = array.length; i < j; i += chunk_size) {
        tmp = array.slice(i, i + chunk_size);
        let _txs = await connection.getMultipleTransactions(tmp);
        txs.push(_txs)
    }
    txs = txs.flat()

    // signatures are returned *backwards* in time
    let txs_start = new Date(txs[txs.length-1].blockTime * 1000)
    let txs_end = new Date(txs[0].blockTime * 1000)

    console.log("searching over tx dates:")
    console.log(txs_start.toUTCString(), "---", txs_end.toUTCString())
    
    var diffTime = Math.abs(txs_end.getTime() - txs_start.getTime());
    
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
    diffTime = diffTime - (diffDays * (1000 * 60 * 60 * 24))

    const diffHours = Math.floor(diffTime / (1000 * 60 * 60)); 
    diffTime = diffTime - diffHours * (1000 * 60 * 60)
    
    const diffMinutes = Math.floor(diffTime / (1000 * 60)); 
    diffTime = diffTime - diffMinutes * (1000 * 60)

    const diffSeconds = Math.floor(diffTime / (1000)); 

    console.log(`${diffDays} days - ${diffHours} hours - ${diffMinutes} minutes - ${diffSeconds} seconds`)

    console.log("total # txs:", txs.length)

    let num_failed_txs = 0
    let num_success_txs = 0
    let num_profitable_txs = 0
    let profit_amounts = []
    let profit_accs_start = []

    let USDC = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // usdc
    
    for (let tx of txs) {
        if (tx == null) { continue }

        if (tx.meta.err != null) {
            num_failed_txs += 1
            continue
        }
        num_success_txs += 1 

        // only look at successful txs for profit amount 
        let accs = tx.transaction.message.accountKeys;
        let start_mint = null; 
        let end_mint = null; 
        var src, dst; 
        let amounts = []
        
        for (let inner_ixs of tx.meta.innerInstructions) {
            for (let ix of inner_ixs.instructions) {
                let pid = accs[ix.programIdIndex].toString()
                if (pid != TOKEN_PROGRAM_ID) { continue }
                let ix_data = bs58.decode(ix.data) // decode to u8
                let tag = ix_data[0];
                let rest = ix_data.slice(1); // func
                let ix_name = tokenprogram_instructions[tag];
                // only look at transfers 
                if (ix_name != "Transfer") { continue } 

                // [src, dst, authority], amount
                src = accs[ix.accounts[0]]
                dst = accs[ix.accounts[1]]

                if (start_mint == null) {
                    start_mint = src; 
                }

                // byte array -> u64
                let u64_amount = 0
                for (let i=0; i < 8; i++) {
                    let v = rest[i]; 
                    u64_amount += v * 2 ** (8 * i)
                }
                amounts.push(u64_amount)
            }
        }
        end_mint = dst;

        if (start_mint == end_mint && amounts.length > 3) {
            let arb_profit_amount = amounts[amounts.length-1] - amounts[0]
            if (arb_profit_amount > 0) {
                num_profitable_txs += 1 
                profit_amounts.push(arb_profit_amount)
                profit_accs_start.push(new web3.PublicKey(start_mint))
            }
        } 
    }

    // get account infos in 99 chunk sizes 
    console.log("getting account infos...")
    let arb_infos = []
    var i:number ,j, tmp, chunk = 99;
    for (i = 0,j = profit_accs_start.length; i < j; i += chunk) {
        tmp = profit_accs_start.slice(i, i + chunk);
        let chunk_arb_infos = await connection.getMultipleAccountsInfo(tmp)
        arb_infos.push(chunk_arb_infos)
    }
    arb_infos = arb_infos.flat()

    var sum_of_profits = 0
    var n_usdc_arbs = 0 
    for (let i=0; i < profit_amounts.length; i++) {
        let token_acc = AccountLayout.decode(arb_infos[i].data)
        if (token_acc.mint.toString() == USDC) {
            sum_of_profits += profit_amounts[i]
            n_usdc_arbs += 1 
        }
    }
    sum_of_profits = sum_of_profits / 10**6; // scale USDC 

    let SOL_PRICE = 90
    var cost_of_failed_txs = - num_failed_txs * 0.000005 * SOL_PRICE

    let total_profit = sum_of_profits + cost_of_failed_txs

    let result = {
        num_failed_txs : num_failed_txs,
        num_success_txs : num_success_txs,
        num_profitable_txs : num_profitable_txs,
        n_usdc_arbs : n_usdc_arbs,
        sum_of_profits : sum_of_profits,
        cost_of_failed_txs : cost_of_failed_txs,
        total_profit : total_profit,
        SOL_PRICE: SOL_PRICE,
        time_interval: `${diffDays} days - ${diffHours} hours - ${diffMinutes} minutes - ${diffSeconds} seconds`
    }
    
    fs.writeFile(`results/${signer.toString()}_${txs_start.toUTCString()}_${txs_end.toUTCString()}.json`, 
        JSON.stringify(result), 
        'utf8', 
        ()=>{}
    );

    console.log("# failed txs", num_failed_txs)
    console.log("# successful txs", num_success_txs)
    console.log("# profitable txs", num_profitable_txs)
    console.log("# USDC src arbs:", n_usdc_arbs)
    console.log("total amount of USDC profit:", sum_of_profits);
    console.log("total amount of USDC in fees:", cost_of_failed_txs);

    console.log("TOTAL PROFIT:", total_profit);
}

async function read_dir_names(dir_name: string) {
    const dir = fs.opendirSync(dir_name)
    let dirent
    let dirs = []
    while ((dirent = dir.readSync()) !== null) {
        dirs.push(dirent.name)
    }
    dir.closeSync()
    return dirs
}

async function main() {
    let dirs = await read_dir_names('./arbitragers/')
    let searched_signers = (await read_dir_names("./results")).map((path: string) => path.split('_')[0])

    let count = 0 
    for (let dirent_name of dirs) {
        let arb_signers = JSON.parse(fs.readFileSync("./arbitragers/"+dirent_name))
        for (let signer of arb_signers) {
            let idx = searched_signers.indexOf(signer) 
            count += 1 
            // havent search it yet 
            if (idx == -1) {
                await search_signer(new web3.PublicKey(signer))
                searched_signers.push(signer)
            }
        }
    }            

    console.log("total # arbitragers:", count)
    console.log("Scraped", searched_signers.length, "unique arbitragers...")
}
main()