import * as token from "@solana/spl-token"
import * as web3 from "@solana/web3.js"
import { Keypair, Connection, PublicKey, Signer } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID, AccountLayout } from '@solana/spl-token'
var fs = require('fs');

async function main() {
    const connection = new web3.Connection('http://127.0.0.1:8899/')

    // log init balance 
    let rawdata = fs.readFileSync(`../localnet_owner.key`, 'utf8');  
    let owner_secret = new Uint8Array(JSON.parse(rawdata));
    let owner = web3.Keypair.fromSecretKey(owner_secret);

    // request sol 
    let balance = await connection.getBalance(owner.publicKey) 
    if (balance < 60 * web3.LAMPORTS_PER_SOL) {
        let tx = await connection.requestAirdrop(owner.publicKey, 100 * web3.LAMPORTS_PER_SOL);
        await connection.confirmTransaction(tx)
    }
    // swap to WSOL 
    console.log('getting WSOL...')
    let wsol_mint = token.NATIVE_MINT;
    let ata_pk = (await web3.PublicKey.findProgramAddress(
        [owner.publicKey.toBuffer(), token.TOKEN_PROGRAM_ID.toBuffer(), wsol_mint.toBuffer()],
        token.ASSOCIATED_TOKEN_PROGRAM_ID
    ))[0];

    let exists = (await connection.getAccountInfo(ata_pk)) == null ? false : true;
    let ixs = []
    if (!exists) {
        ixs.push(
            // @ts-ignore
            token.createAssociatedTokenAccountInstruction(
                owner.publicKey,
                ata_pk, 
                owner.publicKey,
                wsol_mint, 
                token.TOKEN_PROGRAM_ID,
                token.ASSOCIATED_TOKEN_PROGRAM_ID, 
            )
        );
    }

    ixs.push(...[web3.SystemProgram.transfer({
            fromPubkey: owner.publicKey,
            toPubkey: ata_pk,
            lamports: 20 * web3.LAMPORTS_PER_SOL, 
        }),    
        // @ts-ignore
        token.createSyncNativeInstruction(ata_pk),
    ])

    let tx = new web3.Transaction()
        .add(...ixs);

    await web3.sendAndConfirmTransaction(connection, tx, [owner]).then(() => {}, (err) => {
        console.log("err:", wsol_mint.toString(), err)
    })
}
main()
