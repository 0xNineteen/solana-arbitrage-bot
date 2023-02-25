import * as token from "@solana/spl-token"
import * as web3 from "@solana/web3.js";
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

let token_list = JSON.parse(fs.readFileSync("token_list.json"))["tokens"]
var mintToToken = function(arr, mint) {
    for (var i in arr) {
      let x = arr[i];
      if (x["address"] == mint.toString()) return x;
    }
};

// analyze a specific swap (what auth got the arbitrage? who else competed for it)
async function main() {
    let connection = new web3.Connection("https://api.mainnet-beta.solana.com")

    let swap_block_idx = 124208114; //og = 123658615;
    let swap_signature = "3jyDtos8win2PfeTsjcCi78xVPxRgu1u5eqNCQpQoy72sG6qrWpXxKKKo531JvNyVukh7S43QLMXWcw1miystpzb";
    
    let i_difference = -5
    let block_number = swap_block_idx + i_difference
    console.log("")
    console.log("searching block #", block_number, "(#diff" + i_difference.toString() + ")")
    
    let block = await connection.getBlock(block_number);
    let arbitrage_count = 0;
    let successful_arbitrage_count = 0;
    let block_txs = block.transactions
    let block_arb_token_accounts = []

    let arb_signers = [] // record for further analysis
    let arb_amount_ins = []
    let arb_tx_sig = []

    for (let tx of block_txs) {
        // await parse_orca_swap_tx(tx, connection);

        let accs = tx.transaction.message.accountKeys;
        let tx_sig = tx.transaction.signatures[0];


        // if (tx_sig != swap_signature) { continue }

        var signer: web3.PublicKey; 
        for (let tx_acc_idx=0; tx_acc_idx < accs.length; tx_acc_idx++) {
            let is_signer = tx.transaction.message.isAccountSigner(tx_acc_idx);
            if (is_signer) {
                signer = accs[tx_acc_idx];
                break 
            }
        }
        
        let start_mint = null; 
        let end_mint = null; 
        var src, dst; 
        let info = []
        let arb_tokens = []

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
                // if auth == signer ?? 
                let auth = accs[ix.accounts[2]]

                
                // byte array -> u64
                let u64_amount = 0
                for (let i=0; i < 8; i++) {
                    let v = rest[i]; 
                    u64_amount += v * 2 ** (8 * i)
                }

                if (start_mint == null) {
                    start_mint = src; 
                }
                
                var src_str = src.toString();
                var dst_str = dst.toString();
                
                var prepend = "";
                if (auth == signer) {
                    prepend = 'SwapIN:\x1b[32m';
                } else {
                    prepend = 'SwapOUT:\x1b[31m';
                }
                arb_tokens.push(src) // record token acocunts to know which are from what mint later 
                arb_tokens.push(dst) // record token acocunts to know which are from what mint later 

                info.push([prepend, src_str, "->", dst_str, u64_amount])
            }
        }
        end_mint = dst;

        if (start_mint == end_mint && info.length > 3) {
            if (info[0][4] < info[info.length-1][4]) {
                console.log("\x1b[36m", "\t PROFITABLE ARB!");
                successful_arbitrage_count += 1
            } 
            // else {
            //     continue
            // }

            arb_amount_ins.push(info[0][4])
            
            // arbitrage! 
            block_arb_token_accounts.push(arb_tokens)
            arbitrage_count += 1 
            arb_signers.push(signer)
            arb_tx_sig.push(tx_sig)
            // for (let [prepend, src_str, t, dst_str, u64_amount] of info) {
            //     console.log(prepend, src_str, t, dst_str, u64_amount)
            // }
            if (tx.meta.err == null) {
                console.log("\x1b[36m", "success!");
            }
         
            console.log("tx signature:", tx_sig)
            console.log('---')
        }
    }
    console.log("(# arbs, # successful arbs)", arbitrage_count, successful_arbitrage_count)

    let specific_arb_mints = [
        "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // usdc
        "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So", // msol 
        "MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey", // MNDE
    ]
    
    // get account infos in 99 chunk sizes 
    let arb_infos = []
    let array = block_arb_token_accounts.flat()
    var i:number ,j, tmp, chunk = 99;
    for (i = 0,j = array.length; i < j; i += chunk) {
        tmp = array.slice(i, i + chunk);
        let chunk_arb_infos = await connection.getMultipleAccountsInfo(tmp)
        arb_infos.push(chunk_arb_infos)
    }
    arb_infos = arb_infos.flat()

    let n_specific_arbs = 0
    var i = 0;
    var block_arb_count = 0 
    var specific_arb_signers = []
    var amount_ins = []
    var spec_tx_sigs = []
    for (let arb of block_arb_token_accounts) {
        let occ_count = [0, 0, 0];
        for(let j=0; j<arb.length; j++) {
            let token_acc = AccountLayout.decode(arb_infos[i].data)
            let token_mint = token_acc.mint.toString()
            let idx = specific_arb_mints.indexOf(token_mint)
            if (idx > -1) {
                occ_count[idx] += 1
            }
            i+=1;
        }

        if (
            occ_count[0] > 0 && 
            occ_count[1] > 0 && 
            occ_count[2] > 0
        ) {
            let specific_arb_signer = arb_signers[block_arb_count].toString()
            amount_ins.push(arb_amount_ins[block_arb_count] / 10**6)
            specific_arb_signers.push(specific_arb_signer)
            spec_tx_sigs.push(arb_tx_sig[block_arb_count])
            n_specific_arbs += 1
        }
        block_arb_count += 1
    }

    console.log("# users targeting specific arb:", n_specific_arbs)
    for(let j=0; j<amount_ins.length; j++) {
        let s = specific_arb_signers[j]
        let a = amount_ins[j]
        let tx_s = spec_tx_sigs[j]
        console.log(`${a} : ${s} : ${tx_s}`)
    }

    // if (specific_arb_signers.length > 0) {
    //     fs.writeFile(`arbitragers/${block_number}_${i_difference}_specific_arb_signers.json`, 
    //         JSON.stringify(specific_arb_signers), 
    //         'utf8', 
    //         ()=>{}
    //     );
    // }
}

main()