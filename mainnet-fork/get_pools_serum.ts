import { Market, MARKETS } from "@project-serum/serum";
import { TOKEN_PROGRAM_ID, getMint } from "@solana/spl-token";

import { Connection, PublicKey } from "@solana/web3.js";
const fs = require("fs");

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
    return await PublicKey.createProgramAddress(
      [
        Buffer.from("serum"),
        new PublicKey(marketAddress).toBuffer(),
        new Uint8Array([vaultSignerNonce & 0xff]),
      ],
      new PublicKey("DESVgJVGajEgKGXhb6XmqDHGz3VjdgP7rEVESBgxmroY")
    );
  } catch (error) {
    console.error("Failed to create vault signer address:", error);
    return null;
  }
}

async function main() {
  const connection = new Connection("https://api.mainnet-beta.solana.com");
  // Get the list of all markets
  for (let marketInfo of MARKETS) {
    await sleep(2000);
    const market = await Market.load(
      connection,
      marketInfo.address,
      {},
      marketInfo.programId
    );
    const baseTokenInfo = await getMint(connection, new PublicKey(market.baseMintAddress), "single", TOKEN_PROGRAM_ID);
    const vaultSignerKey = await getVaultSignerAddress(
      marketInfo.address.toString(),
      market.decoded.vaultSignerNonce
    );
    if (!vaultSignerKey) {
      continue;
    }
    const quoteTokenInfo = await getMint(connection, new PublicKey(market.quoteMintAddress), "single", TOKEN_PROGRAM_ID);

    const pool: SerumPool = {
      ownAddress: market.address.toString(),
      baseMint: market.baseMintAddress.toString(),
      quoteMint: market.quoteMintAddress.toString(),
      baseScale: baseTokenInfo.decimals,
      quoteScale: quoteTokenInfo.decimals,
      baseVault: market.bidsAddress.toString(),
      quoteVault: market.asksAddress.toString(),
      requestQueue: market.decoded.requestQueue.toString(),
      eventQueue: market.decoded.eventQueue.toString(),
      bids: market.bidsAddress.toString(),
      asks: market.asksAddress.toString(),
      vaultSigner: vaultSignerKey.toString(),
      takerFeePct: 0.22,
    };

    console.log(pool);
    fs.writeFile(
      "../pools/serum/" + market.address.toString() + "_serum_dex.json",
      JSON.stringify(pool),
      "utf8",
      () => {}
    );
  }
  //   MARKETS.forEach(async (marketInfo, index) => {
  //     const market = await Market.load(
  //       connection,
  //       marketInfo.address,
  //       {},
  //       marketInfo.programId
  //     );
  //     console.log(market);
  //   });
}

main();
