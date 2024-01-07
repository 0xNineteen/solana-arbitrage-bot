import * as web3 from "@solana/web3.js";
import {
  PERMISSIONLESS_POOLS,
  AUTHORIZED_POOLS,
  PoolClient,
} from "@aldrin_exchange/sdk";

export async function getPools() {
  let connection = new web3.Connection("https://api.mainnet-beta.solana.com");
  const poolClient = new PoolClient(connection);

  console.log("Predefined authorized pools: ", AUTHORIZED_POOLS);
  console.log("Predefined permissionless pools: ", PERMISSIONLESS_POOLS);
  try {
    console.log("Getting all Aldrin pools...");
    const pools = await poolClient.getPools();
    console.log("All Aldrin pools: ", pools);
  } catch (e) {
    console.log(e);
  }

  try {
    console.log("Getting all Aldrin pools V2...");
    const v2pools = await poolClient.getV2Pools();
    console.log("All Aldrin v2 pools: ", v2pools);
  } catch (e) {
    console.log(e);
  }
}

getPools();
