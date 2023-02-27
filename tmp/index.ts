import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";
import * as fs from 'fs';
import { getOrca, OrcaFarmConfig, OrcaPoolConfig } from "@orca-so/sdk";
import Decimal from "decimal.js";

import * as bip39 from "bip39";

async function main() {
    // // only run once
    // let wallet = web3.Keypair.generate();
    // fs.writeFile(`devnet_wallet.key`, 
    //     '[' + wallet.secretKey.toString() +']', 
    //     console.log);  

    // let url = "https://api.devnet.solana.com"
    // let rawdata = fs.readFileSync(`devnet_wallet.key`, 'utf8');  
    // let owner_secret = new Uint8Array(JSON.parse(rawdata));
    // let wallet = web3.Keypair.fromSecretKey(owner_secret);
    // console.log(wallet.publicKey.toString());
    
    let url = 'https://api.mainnet-beta.solana.com'
    let connection = new web3.Connection(url);

    var rawdata = fs.readFileSync(`../../mainnet.key`, 'utf8');  
    var owner_secret = new Uint8Array(JSON.parse(rawdata));
    var wallet = web3.Keypair.fromSecretKey(owner_secret);
    console.log(wallet.publicKey.toString());

    var rawdata = fs.readFileSync(`../../sollet_key.txt`, 'utf8');  
    var owner_secret = new Uint8Array(JSON.parse(rawdata));
    var dst_wallet = web3.Keypair.fromSecretKey(owner_secret);
    console.log(dst_wallet.publicKey.toString());

    let lamports_amount = 0.1 * web3.LAMPORTS_PER_SOL; // 1 SOL / 5 = 0.2 SOL ~= 90$ / 5 = 18$  
    
    const tx = new web3.Transaction()
        .add(web3.SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: dst_wallet.publicKey,
            lamports: lamports_amount
        }))
    await web3.sendAndConfirmTransaction(connection, tx, [wallet]);

    // let balance = await connection.getBalance(wallet.publicKey);
    // console.log(balance / web3.LAMPORTS_PER_SOL);

    // // 2. Initialzie Orca object with mainnet connection
    // const orca = getOrca(connection);
    
}

main();