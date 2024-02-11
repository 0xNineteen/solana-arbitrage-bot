import {
  PublicKey,
  type Connection,
  type AccountInfo,
  type Message,
} from '@solana/web3.js';
import {
  type MarketAccount,
  OPENBOOK_PROGRAM_ID,
  getFilteredProgramAccounts,
} from './client';
import {
  utils,
  Program,
  type Provider,
  getProvider,
  BN,
} from '@coral-xyz/anchor';
import { QUOTE_DECIMALS, toNative, toUiDecimals } from './utils/utils';
import Big from 'big.js';
import { IDL, type OpenbookV2 } from './openbook_v2';
const BATCH_TX_SIZE = 50;

export async function findAccountsByMints(
  connection: Connection,
  baseMintAddress: PublicKey,
  quoteMintAddress: PublicKey,
  programId: PublicKey,
): Promise<Array<{ publicKey: PublicKey; accountInfo: AccountInfo<Buffer> }>> {
  const filters = [
    {
      memcmp: {
        offset: 792,
        bytes: baseMintAddress.toBase58(),
      },
    },
    {
      memcmp: {
        offset: 824,
        bytes: quoteMintAddress.toBase58(),
      },
    },
  ];
  return await getFilteredProgramAccounts(connection, programId, filters);
}
interface Market {
  market: string;
  baseMint: string;
  quoteMint: string;
  name: string;
  timestamp: number | null | undefined;
}
export async function findAllMarkets(
  connection: Connection,
  programId: PublicKey = OPENBOOK_PROGRAM_ID,
  provider?: Provider,
): Promise<Market[]> {
  if (provider == null) {
    provider = getProvider();
  }
  const program = new Program<OpenbookV2>(IDL, programId, provider);

  const [eventAuthority] = PublicKey.findProgramAddressSync(
    [Buffer.from('__event_authority')],
    programId,
  );
  const marketsAll: Market[] = [];

  const signatures = (
    await connection.getSignaturesForAddress(eventAuthority)
  ).map((x) => x.signature);
  const batchSignatures: [string[]] = [[]];
  for (let i = 0; i < signatures.length; i += BATCH_TX_SIZE) {
    batchSignatures.push(signatures.slice(0, BATCH_TX_SIZE));
  }
  for (const batch of batchSignatures) {
    const allTxs = await connection.getTransactions(batch, {
      commitment: 'confirmed',
      maxSupportedTransactionVersion: 0,
    });
    for (const tx of allTxs) {
      if (
        tx?.meta?.innerInstructions !== null &&
        tx?.meta?.innerInstructions !== undefined
      ) {
        for (const innerIns of tx.meta.innerInstructions) {
          const innerIx = innerIns.instructions?.[11];
          if (innerIx?.accounts?.[0] !== undefined) {
            // validate key and program key
            const eventAuthorityKey = innerIx.accounts[0];
            const programKey = innerIx.programIdIndex;
            if (
              (tx.transaction.message as Message).staticAccountKeys[
                eventAuthorityKey
              ].toString() !== eventAuthority.toString() ||
              (tx.transaction.message as Message).staticAccountKeys[
                programKey
              ].toString() !== programId.toString()
            ) {
              continue;
            } else {
              const ixData = utils.bytes.bs58.decode(innerIx.data);
              const eventData = utils.bytes.base64.encode(ixData.slice(8));
              const event = program.coder.events.decode(eventData);

              if (event != null) {
                const market: Market = {
                  market: (event.data.market as PublicKey).toString(),
                  baseMint: (event.data.baseMint as PublicKey).toString(),
                  quoteMint: (event.data.quoteMint as PublicKey).toString(),
                  name: event.data.name as string,
                  timestamp: tx.blockTime,
                };
                marketsAll.push(market);
              }
            }
          }
        }
      }
    }
  }
  return marketsAll;
}

function priceLotsToUiConverter(market: MarketAccount): number {
  return new Big(10)
    .pow(market.baseDecimals - QUOTE_DECIMALS)
    .mul(new Big(market.quoteLotSize.toString()))
    .div(new Big(market.baseLotSize.toString()))
    .toNumber();
}

function baseLotsToUiConverter(market: MarketAccount): number {
  return new Big(market.baseLotSize.toString())
    .div(new Big(10).pow(market.baseDecimals))
    .toNumber();
}
function quoteLotsToUiConverter(market: MarketAccount): number {
  return new Big(market.quoteLotSize.toString())
    .div(new Big(10).pow(market.quoteDecimals))
    .toNumber();
}

export function uiPriceToLots(market: MarketAccount, price: number): BN {
  return toNative(price, QUOTE_DECIMALS)
    .mul(market.baseLotSize)
    .div(market.quoteLotSize.mul(new BN(Math.pow(10, market.baseDecimals))));
}

export function uiBaseToLots(market: MarketAccount, quantity: number): BN {
  return toNative(quantity, market.baseDecimals).div(market.baseLotSize);
}

export function uiQuoteToLots(market: MarketAccount, uiQuote: number): BN {
  return toNative(uiQuote, QUOTE_DECIMALS).div(market.quoteLotSize);
}

export function priceLotsToNative(market: MarketAccount, price: BN): BN {
  return price.mul(market.quoteLotSize).div(market.baseLotSize);
}

export function priceLotsToUi(market: MarketAccount, price: BN): number {
  return parseFloat(price.toString()) * priceLotsToUiConverter(market);
}

export function priceNativeToUi(market: MarketAccount, price: number): number {
  return toUiDecimals(price, QUOTE_DECIMALS - market.baseDecimals);
}

export function baseLotsToUi(market: MarketAccount, quantity: BN): number {
  return parseFloat(quantity.toString()) * baseLotsToUiConverter(market);
}

export function quoteLotsToUi(market: MarketAccount, quantity: BN): number {
  return parseFloat(quantity.toString()) * quoteLotsToUiConverter(market);
}

export function quantityToUiBase(
  market: MarketAccount,
  quantity: BN,
  decimals: number,
): number {
  return toUiDecimals(quantity.mul(market.baseLotSize).toNumber(), decimals);
}
