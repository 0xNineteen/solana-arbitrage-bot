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

async function parse_orca_swap_tx(connection, tx) {
    let accs = tx.transaction.message.accountKeys;
    let count = 0; 
    for (let inner_ixs of tx.meta.innerInstructions) {
        let first_ix = inner_ixs.instructions[0]
        let rest_ixs = inner_ixs.instructions.slice(1)
        let program_id = accs[first_ix.programIdIndex].toString();
            
        if (program_id != ORCA_SWAP_PROGRAM_ID) { continue }
        if (count == 0) {
            console.log('\x1b[33m', '\t orca swap tx START')
            console.log('\x1b[32m', tx.transaction.signatures[0])

            if (tx.meta.err != null) {
                console.log("\x1b[31m", "error:", tx.meta.err);
            }
            console.log("\t")
            count += 1
        }
        let ix_data = bs58.decode(first_ix.data)
        let ix_name = orcaswap_instructions[ix_data[0]];
        
        if (ix_name.toUpperCase() == "SWAP") { continue }
        // IXS: [transfer, mint, transfer]
        if (rest_ixs.length != 3) { continue } // errored out and didnt finish 

        let transfer_in_ix = rest_ixs[0];
        let transfer_out_ix = rest_ixs[2];
        let transfer_names = [];
        let transfer_amounts = [];

        for (let ix of [transfer_in_ix, transfer_out_ix]) {
            let ix_data = bs58.decode(ix.data) // decode to u8
            let tag = ix_data[0];
            let rest = ix_data.slice(1);

            let pid = accs[ix.programIdIndex].toString()
            if (pid != TOKEN_PROGRAM_ID) { throw Error } // should be a token program id 
            let ix_name = tokenprogram_instructions[tag];
            if (ix_name != "Transfer") { throw Error } // should be a transfer instruction here 
            
            // [src, dst, authority], amount
            let src = accs[ix.accounts[0]]
            let src_acc = await token.getAccount(connection, src);
            let src_token = mintToToken(token_list, src_acc.mint)
            let src_name = src_token["symbol"]
            let src_decimals = src_token["decimals"]
            
            let u64_value = 0
            for (let i=0; i < 8; i++) {
                let v = rest[i]; 
                u64_value += v * 2 ** (8 * i)
            }
            
            // console.log("amount of", src_name, " : ", u64_value);
            transfer_names.push(src_name)
            transfer_amounts.push(u64_value / (10 ** src_decimals))
        }

        console.log(`${transfer_amounts[0]} ${transfer_names[0]} -> ${transfer_amounts[1]} ${transfer_names[1]}`)
    }
}