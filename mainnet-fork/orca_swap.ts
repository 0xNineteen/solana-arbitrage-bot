import { Connection, PublicKey } from "@solana/web3.js";
import * as web3 from "@solana/web3.js"
// import * as token from "@solana/spl-token";
import Decimal from "decimal.js";

import { getOrca, getTokens, getTokenCount } from "../orca_pools/typescript-sdk/src";
import { OrcaPoolConfig } from "../orca_pools/mainnet_pools/config";
import { orcaPoolConfigs } from "../orca_pools/mainnet_pools/pools";

let fs = require('fs');

async function main() {

    // 2. Initialzie Orca object with mainnet connection
    const orca_program_id = new PublicKey('9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP');
    const connection = new Connection("http://localhost:8899/", "singleGossip");
    const orca = getOrca(connection, orca_program_id);

    // 3. We will be swapping 0.1 SOL for some ORCA
    let params = orcaPoolConfigs[OrcaPoolConfig.SOL_USDC];
    const orcaSolPool = orca.getPool(params);
    
    let solToken = orcaSolPool.getTokenA(); // SOL 
    const usdcToken = orcaSolPool.getTokenB(); // USDC

    // custom 
    let inputToken = usdcToken;
    const { inputPoolToken, outputPoolToken } = getTokens(
      params,
      inputToken.mint.toString()
    );
    console.log(inputPoolToken, outputPoolToken);

    const { inputTokenCount, outputTokenCount } = await getTokenCount(
      connection,
      params,
      inputPoolToken,
      outputPoolToken
    );
    console.log(`${inputPoolToken.name} token amount = ${inputTokenCount.toNumber()}`);
    console.log(`${outputPoolToken.name} token amount = ${outputTokenCount.toNumber()}`);

    // get quote with pool amounts 
    let amount_in = new Decimal(1);

    // using SDK 
    console.log(`tokenA = ${solToken.tag} tokenB = ${usdcToken.tag}`);
    var quote_in = await orcaSolPool.getQuote(usdcToken, amount_in);
    var orcaAmount = quote_in.getExpectedOutputAmount();
    console.log(`Swap ${amount_in.toString()} ${usdcToken.tag} for at least ${orcaAmount.toNumber()} ${solToken.tag}`);

    // log init balance 
    let rawdata = fs.readFileSync(`../../mainnet.key`, 'utf8');  
    let owner_secret = new Uint8Array(JSON.parse(rawdata));
    let owner = web3.Keypair.fromSecretKey(owner_secret);

    let input_token = solToken; 
    let output_token = input_token == usdcToken ? solToken : usdcToken;

    let swap = await orcaSolPool.swap(
      owner, input_token, amount_in, new Decimal(0)
    );

    let TOKEN_PROGRAM_ID = new web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
    let ASSOCIATED_TOKEN_PROGRAM_ID = new web3.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");

    let src_token_account = (await web3.PublicKey.findProgramAddress(
      [owner.publicKey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), input_token.mint.toBuffer()],
      ASSOCIATED_TOKEN_PROGRAM_ID
    ))[0];
    let dst_token_account = (await web3.PublicKey.findProgramAddress(
        [owner.publicKey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), output_token.mint.toBuffer()],
        ASSOCIATED_TOKEN_PROGRAM_ID
    ))[0];

    console.log((await connection.getTokenAccountBalance(src_token_account)).value.uiAmountString);
    console.log((await connection.getTokenAccountBalance(dst_token_account)).value.uiAmountString);
    let signature = await swap.execute()
    let status = await connection.getSignatureStatus(signature);
    console.log(status)
    console.log((await connection.getTokenAccountBalance(src_token_account)).value.uiAmountString);
    console.log((await connection.getTokenAccountBalance(dst_token_account)).value.uiAmountString);



    // let response = await connection.simulateTransaction(swap.transaction, swap.signers);
    // console.log(response)

};

main()