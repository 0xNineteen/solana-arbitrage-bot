import axios from "axios";
import * as web3 from "@solana/web3.js";
import { Raydium } from "@raydium-io/raydium-sdk-v2";
import BN from "bn.js";
const fs = require("fs");

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// Define the type for the pool data
interface Pool {
  name: string;
  ammId: web3.PublicKey;
  lpMint: web3.PublicKey;
  baseMint: web3.PublicKey;
  quoteMint: web3.PublicKey;
  market: web3.PublicKey;
  liquidity: bigint;
  volume24h: bigint;
  volume24hQuote: bigint;
  fee24h: bigint;
  fee24hQuote: bigint;
  volume7d: bigint;
  volume7dQuote: bigint;
  fee7d: bigint;
  fee7dQuote: bigint;
  volume30d: bigint;
  volume30dQuote: bigint;
  fee30d: bigint;
  fee30dQuote: bigint;
  price: bigint;
  lpPrice: BN;
  tokenAmountCoin: BN;
  tokenAmountPc: BN;
  tokenAmountLp: BN;
  apr24h: bigint;
  apr7d: bigint;
  apr30d: bigint;
}
interface RaydiumPool {
  type: string;
  programId: web3.PublicKey;
  id: web3.PublicKey;
  mintA: {
    chainId: number;
    address: web3.PublicKey;
    programId: web3.PublicKey;
    symbol: string;
    name: string;
    decimals: number;
  };
  mintB: {
    chainId: number;
    address: web3.PublicKey;
    programId: web3.PublicKey;
    symbol: string;
    name: string;
    decimals: number;
  };
  price: BN;
  mintAmountA: BN;
  mintAmountB: BN;
  feeRate: number;
  pooltype: [string];
  marketId: web3.PublicKey;
}

// Function to fetch the list of pools
async function fetchRaydiumPools(): Promise<Pool[]> {
  try {
    const url = "https://api.raydium.io/v2/main/pairs";
    const response = await axios.get<Pool[]>(url);
    const pools: Pool[] = response.data;

    // Log the pools to the console
    return pools;
  } catch (error) {
    console.error("Error fetching Raydium pools:", error);
    throw error;
  }
}

async function main() {
  const connection = new web3.Connection("https://api.mainnet-beta.solana.com");
  const raydium = await Raydium.load({ connection });
  // Example usage of the fetchRaydiumPools function
  await fetchRaydiumPools().then(async (pools) => {
    for (let pool of pools) {
      if (pool.volume24h <= 0) {
        continue;
      }
      const poolData = await raydium.api.fetchPoolById({
        ids: pool.ammId.toString(),
      });
      poolData.forEach((pd) => {
        console.log(`Saving pool ${pd.id.toString()}`);
        fs.writeFile(
          "../pools/raydium/" + pd.id.toString() + "_raydium_dex.json",
          JSON.stringify(pd),
          "utf8",
          () => {}
        );
      });
      sleep(2000);
      // console.log(`Pool ID: ${pool.name}`);
      // console.log(`Pool Address: ${pool.market}`);
      // console.log(`Base Mint: ${pool.baseMint}`);
      // console.log(`Quote Mint: ${pool.quoteMint}`);
      // console.log(`Price: ${pool.price}`);
      // console.log(`Volume7d: ${pool.volume7d}`);
      // console.log("-----------------------");
    }
    // pools
    //   .filter((pool) => pool.volume24h > 0)
    //   .sort((a, b) => (a.volume7d > b.volume7d ? 1 : -1))
    //   .map(async (pool) => {
    //     const poolData = await raydium.api.fetchPoolById({
    //       ids: pool.ammId.toString(),
    //     });
    //     poolData.forEach((pd) => {
    //       fs.writeFile(
    //         "../pools/raydium/" + pd.id.toString() + "_raydium_dex.json",
    //         JSON.stringify(pd),
    //         "utf8",
    //         () => {}
    //       );
    //     });
    //     sleep(2000);
    //     // console.log(`Pool ID: ${pool.name}`);
    //     // console.log(`Pool Address: ${pool.market}`);
    //     // console.log(`Base Mint: ${pool.baseMint}`);
    //     // console.log(`Quote Mint: ${pool.quoteMint}`);
    //     // console.log(`Price: ${pool.price}`);
    //     // console.log(`Volume7d: ${pool.volume7d}`);
    //     // console.log("-----------------------");
    //   });
  });
}

main().then(
  () => process.exit(),
  (err) => {
    console.error(err);
    process.exit(-1);
  }
);
