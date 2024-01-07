const fs = require("fs");

interface Token {
  name: string;
  symbol: string;
  logoURI: string;
  decimals: number;
  address: string;
  chainId: number;
  tags: string[];
  extensions: {
    website?: string;
    twitter?: string;
    coingeckoId?: string;
    source?: string;
    currency: string;
    sourceUrl?: string;
    serumV3Usdt?: string;
    serumV3Usdc?: string;
  };
}

interface LPToken {
  symbol: string;
  name: string;
  logoURI: string;
  decimals: number;
  address: string;
  chainId: number;
  tags: string[];
  extensions: {
    website: string;
    underlyingTokens: string[];
    source: string;
  };
}

interface Fees {
  isFraction: boolean;
  numeratorStr: string;
  denominatorStr: string;
  isPercent: boolean;
}

interface SwapState {
  isInitialized: boolean;
  isPaused: boolean;
  nonce: number;
  futureAdminDeadline: number;
  futureAdminAccount: string;
  poolTokenMint: string;
  adminAccount: string;
  tokenA: {
    adminFeeAccount: string;
    mint: string;
    reserve: string;
  };
  tokenB: {
    adminFeeAccount: string;
    mint: string;
    reserve: string;
  };
  initialAmpFactor: string;
  targetAmpFactor: string;
  startRampTimestamp: number;
  stopRampTimestamp: number;
  fees: {
    trade: Fees;
    adminTrade: Fees;
    withdraw: Fees;
    adminWithdraw: Fees;
  };
}

interface SwapConfig {
  swapAccount: string;
  authority: string;
  swapProgramID: string;
  tokenProgramID: string;
}

interface Swap {
  config: SwapConfig;
  state: SwapState;
}

interface Pool {
  id: string;
  name: string;
  tokens: Token[];
  tokenIcons: Token[];
  underlyingIcons: Token[];
  currency: string;
  lpToken: LPToken;
  plotKey: string;
  swap: Swap;
  quarry: string;
}

interface Root {
  pools: Pool[];
}

interface SaberPool {
  pool_account: string;
  authority: string;
  pool_token_mint: string;
  token_ids: string[];
  tokens: {
    [token_id: string]: {
      tag: string;
      name: string;
      mint: string;
      addr: string;
      scale: number;
    };
  };
  target_amp: number;
  fee_numerator: number;
  fee_denominator: number;
  fee_accounts: {
    [token_id: string]: string;
  };
}

async function main() {
  await fetch("https://registry.saber.so/data/pools-info.mainnet.json")
    .then((response) => response.json())
    .then((data) => {
      // Process the JSON data here
      let dataTyped = data as Root;

      dataTyped.pools.forEach((pool) => {
        console.log(pool.id);
        let saberPool = <SaberPool>{};
        saberPool.authority = pool.swap.config.authority;
        saberPool.pool_account = pool.swap.config.swapAccount;
        saberPool.pool_token_mint = pool.swap.state.poolTokenMint;
        saberPool.token_ids = [];
        saberPool.token_ids.push(pool.swap.state.tokenA.mint);
        saberPool.token_ids.push(pool.swap.state.tokenB.mint);
        saberPool.tokens = {};
        saberPool.tokens[pool.swap.state.tokenA.mint] = {
          tag: "",
          name: pool.tokens[0].symbol,
          mint: pool.swap.state.tokenA.mint,
          addr: pool.swap.state.tokenA.reserve,
          scale: pool.tokens[0].decimals,
        };
        saberPool.tokens[pool.swap.state.tokenB.mint] = {
          tag: "",
          name: pool.tokens[1].symbol,
          mint: pool.swap.state.tokenB.mint,
          addr: pool.swap.state.tokenB.reserve,
          scale: pool.tokens[1].decimals,
        };
        saberPool.target_amp = parseFloat(pool.swap.state.targetAmpFactor);
        saberPool.fee_numerator = parseInt(
          pool.swap.state.fees.trade.numeratorStr
        );
        saberPool.fee_denominator = parseInt(
          pool.swap.state.fees.trade.denominatorStr
        );
        saberPool.fee_accounts = {};
        saberPool.fee_accounts[pool.swap.state.tokenA.mint] =
          pool.swap.state.tokenA.adminFeeAccount;
        saberPool.fee_accounts[pool.swap.state.tokenB.mint] =
          pool.swap.state.tokenB.adminFeeAccount;
        fs.writeFile(
          "../pools/saber_new/" +
            pool.swap.config.swapAccount +
            "_saber_pool.json",
          JSON.stringify(saberPool),
          "utf8",
          () => {}
        );
      });
    })
    .catch((error) => {
      // Handle any errors that occur during the fetch request
      console.error(error);
    });
}

main();

export {};
