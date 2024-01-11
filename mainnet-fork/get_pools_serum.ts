import { Market, MARKETS, MarketProxy } from "@project-serum/serum";

import { Connection } from "@solana/web3.js";
const fs = require("fs");

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const connection = new Connection("https://api.mainnet-beta.solana.com");
  // Get the list of all markets
  for (let marketInfo of MARKETS) {
    const market = await Market.load(
      connection,
      marketInfo.address,
      {},
      marketInfo.programId
    );
    console.log(market.decoded);
    fs.writeFile(
      "../pools/serum/" + market.address.toString() + "_serum_dex.json",
      JSON.stringify(market.decoded),
      "utf8",
      () => {}
    );
    await sleep(2000);
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
