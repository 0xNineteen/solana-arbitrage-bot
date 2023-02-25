import * as token from "@solana/spl-token"
import * as web3 from "@solana/web3.js";
let fs = require('fs');

async function main() {
    let connection = new web3.Connection("http://127.0.0.1:8899");

    let mints = JSON.parse(await fs.readFileSync("saved_mints.json"))
    mints = mints.map(v => new web3.PublicKey(v))
    console.log(mints.length);

    let scales = await Promise.all(mints.map(async mint => {
        let mint_info = await connection.getAccountInfo(mint)
        let m = token.MintLayout.decode(mint_info.data)
        return m.decimals
    }))
    
    // log init balance 
    let rawdata = fs.readFileSync(`./localnet_owner.key`, 'utf8');  
    let owner_secret = new Uint8Array(JSON.parse(rawdata));
    let owner = web3.Keypair.fromSecretKey(owner_secret);
    let wsol_mint = token.NATIVE_MINT;
    console.log("owner:", owner.publicKey.toString())

    // request sol 
    let balance = await connection.getBalance(owner.publicKey) 
    if (balance < 60 * web3.LAMPORTS_PER_SOL) {
        console.log('airdropping sol')
        let tx = await connection.requestAirdrop(owner.publicKey, 100 * web3.LAMPORTS_PER_SOL);
        await connection.confirmTransaction(tx)
    }

    // mint authority ATAs 
    let total = mints.length; 
    for (let i=0; i < total; i ++) {
        let mint = mints[i];
        if (mint.toString() == wsol_mint.toString()) { continue; } // cant mint native tokens 

        // if (mint.toString() != "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v") { continue; }
        // console.log(mint.toString())

        // double check auth is correct 
        let mint_info = await connection.getAccountInfo(mint)
        let mm = token.MintLayout.decode(mint_info.data);
        // console.log("auth:", new web3.PublicKey(mm.mintAuthority).toString())

        let ata_pk = (await web3.PublicKey.findProgramAddress(
          [owner.publicKey.toBuffer(), token.TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
          token.ASSOCIATED_TOKEN_PROGRAM_ID
        ))[0];
        // console.log(ata_pk.toString())

        let exists = (await connection.getAccountInfo(ata_pk)) == null ? false : true;

        let scale = scales[i];
        let mint_amount = 1_000 * 10 ** scale; 

        let tx = new web3.Transaction()
        if (!exists) {
            tx = tx.add(token.Token.createAssociatedTokenAccountInstruction(
                token.ASSOCIATED_TOKEN_PROGRAM_ID, 
                token.TOKEN_PROGRAM_ID,
                mint, 
                ata_pk, 
                owner.publicKey,
                owner.publicKey
            ))
        }
        tx = tx.add(token.Token.createMintToInstruction(
            token.TOKEN_PROGRAM_ID, 
            mint,
            ata_pk, 
            owner.publicKey, [], mint_amount
        ));

        if (exists) {
            let balance = await connection.getTokenAccountBalance(ata_pk);
            console.log("init balance:", balance.value.uiAmountString)
        } else { 
            console.log("missing ata:", mint.toString())
        }

        try {
            web3.sendAndConfirmTransaction(connection, tx, [owner]).then(() => {}, (err) => {
                console.log("err:", mint.toString(), err)
            })
        } catch (err) { }

        // await connection.sendTransaction(tx, [owner]);
        // let balance = await connection.getTokenAccountBalance(ata_pk);
        // console.log("new balance:", balance.value.uiAmountString)
        // console.log("progress:", i, total)
    }

    console.log('waiting...')
}
main()
