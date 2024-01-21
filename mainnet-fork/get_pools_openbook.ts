import * as openbookv2 from "@openbook-dex/openbook-v2";
import { TOKEN_PROGRAM_ID, Token } from "@solana/spl-token";

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
  const MARKETS = await openbookv2.findAllMarkets(connection);
  for (let marketInfo of MARKETS) {
    console.log(marketInfo);
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
