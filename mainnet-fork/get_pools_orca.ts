import { getOrca, Network, OrcaPoolConfig } from "@orca-so/sdk";
import * as web3 from "@solana/web3.js";
const fs = require("fs");

interface PoolParams {
  address: string;
  nonce: number;
  authority: string;
  poolTokenMint: string;
  poolTokenDecimals: number;
  feeAccount: string;
  tokenIds: string[];
  tokens: {
    [tokenId: string]: {
      tag: string;
      name: string;
      mint: string;
      scale: number;
      addr: string;
    };
  };
  curveType: number;
  feeStructure: {
    traderFee: {
      numerator: number;
      denominator: number;
    };
    ownerFee: {
      numerator: number;
      denominator: number;
    };
  };
}

async function main() {
  let connection = new web3.Connection("https://api.mainnet-beta.solana.com");

  // Initialize Orca
  const orca = getOrca(connection, Network.MAINNET);

  // Get the list of all pools
  for (let poolKey of Object.keys(OrcaPoolConfig)) {
    const poolConfig = OrcaPoolConfig[poolKey];
    const pool = await orca.getPool(poolConfig);

    const poolParamsUntyped = pool["poolParams"];
    const tokenIds = Object.keys(poolParamsUntyped.tokens);
    let poolParams = <PoolParams>{
      address: poolParamsUntyped.address.toString(),
      nonce: poolParamsUntyped.nonce,
      authority: poolParamsUntyped.authority.toString(),
      poolTokenMint: poolParamsUntyped.poolTokenMint.toString(),
      poolTokenDecimals: poolParamsUntyped.poolTokenDecimals,
      feeAccount: poolParamsUntyped.feeAccount.toString(),
      tokenIds: tokenIds.map((x) => x.toString()),
      tokens: {
        [tokenIds[0].toString()]: {
          tag: poolParamsUntyped.tokens[tokenIds[0]].tag,
          name: poolParamsUntyped.tokens[tokenIds[0]].name,
          mint: poolParamsUntyped.tokens[tokenIds[0]].mint.toString(),
          scale: poolParamsUntyped.tokens[tokenIds[0]].scale,
          addr: poolParamsUntyped.tokens[tokenIds[0]].addr.toString(),
        },
        [tokenIds[1].toString()]: {
          tag: poolParamsUntyped.tokens[tokenIds[1]].tag,
          name: poolParamsUntyped.tokens[tokenIds[1]].name,
          mint: poolParamsUntyped.tokens[tokenIds[1]].mint.toString(),
          scale: poolParamsUntyped.tokens[tokenIds[1]].scale,
          addr: poolParamsUntyped.tokens[tokenIds[1]].addr.toString(),
        },
      },
      curveType: poolParamsUntyped.curveType,
      feeStructure: {
        traderFee: {
          numerator: parseInt(
            poolParamsUntyped.feeStructure.traderFee.numerator
          ),
          denominator: parseInt(
            poolParamsUntyped.feeStructure.traderFee.denominator
          ),
        },
        ownerFee: {
          numerator: parseInt(
            poolParamsUntyped.feeStructure.ownerFee.numerator
          ),
          denominator: parseInt(
            poolParamsUntyped.feeStructure.ownerFee.denominator
          ),
        },
      },
    };

    fs.writeFile(
      "../pools/orca/params_" + poolKey + ".json",
      JSON.stringify(poolParams),
      "utf8",
      () => {}
    );
  }
}

main();
