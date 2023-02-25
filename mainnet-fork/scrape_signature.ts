import * as token from "@solana/spl-token"
import * as web3 from "@solana/web3.js";
import { Buffer } from 'buffer';

const fs = require('fs');
import { AccountLayout } from "@solana/spl-token";

async function main() {
    let connection = new web3.Connection("https://api.mainnet-beta.solana.com")

    // tx to scrape into local 
    
    // // orca_test_signature 
    // let swap_signature = "3jyDtos8win2PfeTsjcCi78xVPxRgu1u5eqNCQpQoy72sG6qrWpXxKKKo531JvNyVukh7S43QLMXWcw1miystpzb";
    
    // lithium signature 
    let swap_signature = "BC82FVG8YN1zEdNmpqWZmPAPqiifBbuMnTUY6ynktE5pHgVNoeC4cktAbC8RzXGBCXnEEFuHW6NN5RxACNtmGim";

    let tx = await connection.getTransaction(swap_signature);
    let tx_acc_keys = tx.transaction.message.accountKeys;
    let account_infos = await connection.getMultipleAccountsInfo(tx_acc_keys);
    
    let accounts = []
    let programs = []
    let wallets = []

    for (let i = 0; i < account_infos.length; i++) {
        let acc = account_infos[i];
        let addr = tx_acc_keys[i].toString();
        if (acc == null) { // wallet
            wallets.push(addr)
        } else { // program or account 
            if (acc.executable) {
                programs.push(addr)
            } else {
                accounts.push(addr)
            }
        }
    }

    fs.writeFile(`accounts.json`, JSON.stringify(accounts, null, "\t"), 'utf8', ()=>{});
    fs.writeFile(`programs.json`, JSON.stringify(programs, null, "\t"), 'utf8', ()=>{});
    fs.writeFile(`wallets.json`, JSON.stringify(wallets, null, "\t"), 'utf8', ()=>{});
}

main()