import * as token from "@solana/spl-token"
import * as web3 from "@solana/web3.js";
import { Buffer } from 'buffer';

import { publicKey, struct, u32, u64, u8, option, vec } from '@project-serum/borsh';
let fs = require('fs');

/** Token account state as stored by the program */
export enum AccountState {
    Uninitialized = 0,
    Initialized = 1,
    Frozen = 2,
}

/** Token account as stored by the program */
export interface RawAccount {
    mint: web3.PublicKey;
    owner: web3.PublicKey;
    amount: bigint;
    delegateOption: 1 | 0;
    delegate: web3.PublicKey;
    state: AccountState;
    isNativeOption: 1 | 0;
    isNative: bigint;
    delegatedAmount: bigint;
    closeAuthorityOption: 1 | 0;
    closeAuthority: web3.PublicKey;
}

/** Buffer layout for de/serializing a token account */
export const AccountLayout = struct<RawAccount>([
    publicKey('mint'),
    publicKey('owner'),
    u64('amount'),
    u32('delegateOption'),
    publicKey('delegate'),
    u8('state'),
    u32('isNativeOption'),
    u64('isNative'),
    u64('delegatedAmount'),
    u32('closeAuthorityOption'),
    publicKey('closeAuthority'),
]);


function chunk(array, chunkSize) {
    var R = [];
    for (var i = 0; i < array.length; i += chunkSize) {
        R.push(array.slice(i, i + chunkSize));
    }
    return R;
}

async function main() {
    //  my ATAs
    let connection = new web3.Connection("http://127.0.0.1:8899");
    
    let rawdata = fs.readFileSync(`./localnet_owner.key`, 'utf8');  
    let owner_secret = new Uint8Array(JSON.parse(rawdata));
    let owner = web3.Keypair.fromSecretKey(owner_secret);
    let my_pubkey = owner.publicKey;

    let mints = JSON.parse(await fs.readFileSync("saved_mints.json"))
    mints = mints.map(v => new web3.PublicKey(v))
    console.log(mints.length);

    let ata_pks = await Promise.all(mints.map(async m => {
        let ata_pk = (await web3.PublicKey.findProgramAddress(
            [owner.publicKey.toBuffer(), token.TOKEN_PROGRAM_ID.toBuffer(), m.toBuffer()],
            token.ASSOCIATED_TOKEN_PROGRAM_ID
        ))[0];
        return ata_pk 
    }))

    let count = 0;

    for (let pk_chunk of chunk(ata_pks, 99)) {

        let acc_data = await connection.getMultipleAccountsInfo(pk_chunk)
        console.log(acc_data)
        acc_data.forEach(v => {
            if (v == null) { 
                return 
            } 
            let data = v.data;
            let token_acc: token.AccountInfo = AccountLayout.decode(data);
            let balance = new token.u64(token_acc.amount); 
            let mint = new web3.PublicKey(token_acc.mint)

            // EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v = USDC
            if (balance > new token.u64(0)) {
                console.log("mint:", mint.toString(), "balance:", balance.toString());
                count += 1 
            } else {
                console.log("mint:", mint.toString(), "balance:", balance.toString());
            }
        })
    }
    
    // DOGE is missing but we dont trade it bc of quote erros so its fine 
    console.log(count, ata_pks.length)
}
main()