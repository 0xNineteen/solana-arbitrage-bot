import { Market as SerumMarket } from "@project-serum/serum";
import {
  Connection,
  PublicKey,
  AccountInfo,
  TokenAccountBalancePair,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, getMint } from "@solana/spl-token";
import { quoteLotsToUi } from "@openbook-dex/openbook-v2";
import { seq } from "@solana/buffer-layout";
import { quantityToUiBase } from "./openbook/src";
const fs = require("fs");

const MARKET_ACCOUNT_FLAGS_B58_ENCODED = "W723RTUpoZ";

const OPENBOOK_DEX = "srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX"; // openbook now

// const DEX_PROGRAMS: { [key: string]: string } = {
//   srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX: "Openbook Dex",
//   EoTcMgcDRTJVZDMZWBoU6rhYHZfkNTVEAfz3uUJRcYGj: "Openbook Dex Devnet",
//   "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin": "Serum Dex (Compromised)",
//   DESVgJVGajEgKGXhb6XmqDHGz3VjdgP7rEVESBgxmroY: "Serum Dex V3 Devnet",
// };

const MAX_U128 = "340282366920938463463374607431768211455";

const markets = async (
  connection: Connection,
  programID: string = OPENBOOK_DEX
) =>
  await connection.getParsedProgramAccounts(new PublicKey(programID), {
    filters: [
      {
        memcmp: {
          offset: 5,
          bytes: MARKET_ACCOUNT_FLAGS_B58_ENCODED,
        },
      },
    ],
  });

interface SerumPool {
  ownAddress: string;
  baseMint: string;
  quoteMint: string;
  baseScale: number;
  quoteScale: number;
  baseVault: string;
  quoteVault: string;
  requestQueue: string;
  eventQueue: string;
  bids: string;
  asks: string;
  vaultSigner: string;
  takerFeePct: number;
}
async function getVaultSignerAddress(
  marketAddress: string,
  vaultSignerNonce: number
): Promise<PublicKey | null> {
  try {
    return await PublicKey.createProgramAddressSync(
      [
        Buffer.from("serum"),
        new PublicKey(marketAddress).toBuffer(),
        new Uint8Array([vaultSignerNonce & 0xff]),
      ],
      new PublicKey("srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX")
    );
  } catch (error) {
    console.error("Failed to create vault signer address:", error);
    return null;
  }
}

async function main() {
  const connection = new Connection(
    "https://methodical-soft-card.solana-mainnet.quiknode.pro/91b29303c21bce424386b919f222da4f4358374a/",
    // "https://api.mainnet-beta.solana.com",
    "confirmed"
  );

  const mkts = await markets(connection);
  for (let mkt of mkts) {
    const market = SerumMarket.getLayout(mkt.pubkey).decode(mkt.account.data);
    // console.log("Market: ", market);
    const baseTokenInfo = await getMint(connection, market.baseMint);
    const vaultSignerKey = await getVaultSignerAddress(
      mkt.pubkey.toString(),
      market.vaultSignerNonce
    );
    let seqNum = market.quoteLotSize.toNumber();
    console.log("SeqNum", seqNum);
    if (!vaultSignerKey || seqNum < 1000) {
      continue;
    }
    const quoteTokenInfo = await getMint(connection, market.quoteMint);
    const pool = <SerumPool>{
      ownAddress: market.ownAddress.toString(),
      baseMint: market.baseMint.toString(),
      quoteMint: market.quoteMint.toString(),
      baseScale: baseTokenInfo.decimals,
      quoteScale: quoteTokenInfo.decimals,
      baseVault: market.baseVault.toString(),
      quoteVault: market.quoteVault.toString(),
      requestQueue: market.requestQueue.toString(),
      eventQueue: market.eventQueue.toString(),
      bids: market.bids.toString(),
      asks: market.asks.toString(),
      vaultSigner: vaultSignerKey.toString(),
      takerFeePct: 0.22,
    };

    fs.writeFile(
      "../pools/openbook/" + market.ownAddress.toString() + "_serum_dex.json",
      JSON.stringify(pool),
      "utf8",
      () => {}
    );
    sleep(2000);
  }

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Get the list of all markets

  // process.env.ANCHOR_WALLET = "/Users/ggrigori/.config/solana/id.json";
  // // const MARKETS = await findAllMarkets(connection);
  // let client = new OpenBookV2Client(getProvider(), OPENBOOK_PROGRAM_ID);
  // mkts.forEach(async (marketInfo) => {
  //   const key = new PublicKey(marketInfo.id);
  //   return await client.deserializeMarketAccount(key).then(console.log);
  // });
}

main();
