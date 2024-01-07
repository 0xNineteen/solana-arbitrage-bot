import { getOrca, Network, OrcaPoolConfig } from "@orca-so/sdk";
import * as web3 from "@solana/web3.js";
const fs = require("fs");

async function main() {
  let connection = new web3.Connection("https://api.mainnet-beta.solana.com");

  // Initialize Orca
  const orca = getOrca(connection, Network.MAINNET);

  // Get the list of all pools
  for (let poolKey of Object.keys(OrcaPoolConfig)) {
    const poolConfig = OrcaPoolConfig[poolKey];
    const pool = await orca.getPool(poolConfig);

    fs.writeFile(
      "../pools/orca_new/params_" + poolKey + ".json",
      JSON.stringify(pool["poolParams"]),
      "utf8",
      () => {}
    );
  }
}

main();
