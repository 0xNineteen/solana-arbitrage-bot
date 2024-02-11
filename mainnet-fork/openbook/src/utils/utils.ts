import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from '@solana/web3.js';
import BN from 'bn.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

export const Side = {
  Bid: { bid: {} },
  Ask: { ask: {} },
};

export const OrderType = {
  Limit: { limit: {} },
  ImmediateOrCancel: { immediateOrCancel: {} },
  PostOnly: { postOnly: {} },
  Market: { market: {} },
  PostOnlySlide: { postOnlySlide: {} },
};

export const SelfTradeBehavior = {
  DecrementTake: { decrementTake: {} },
  CancelProvide: { cancelProvide: {} },
  AbortTransaction: { abortTransaction: {} },
};

///
/// numeric helpers
///
export const U64_MAX_BN = new BN('18446744073709551615');
export const I64_MAX_BN = new BN('9223372036854775807').toTwos(64);

export function bpsToDecimal(bps: number): number {
  return bps / 10000;
}

export function percentageToDecimal(percentage: number): number {
  return percentage / 100;
}

export function toNative(uiAmount: number, decimals: number): BN {
  return new BN((uiAmount * Math.pow(10, decimals)).toFixed(0));
}

export function toUiDecimals(nativeAmount: number, decimals: number): number {
  return nativeAmount / Math.pow(10, decimals);
}

export const QUOTE_DECIMALS = 6;

export function toUiDecimalsForQuote(nativeAmount: number): number {
  return toUiDecimals(nativeAmount, QUOTE_DECIMALS);
}

///

///
/// web3js extensions
///

/**
 * Get the address of the associated token account for a given mint and owner
 *
 * @param mint                     Token mint account
 * @param owner                    Owner of the new account
 * @param allowOwnerOffCurve       Allow the owner account to be a PDA (Program Derived Address)
 * @param programId                SPL Token program account
 * @param associatedTokenProgramId SPL Associated Token program account
 *
 * @return Address of the associated token account
 */
export async function getAssociatedTokenAddress(
  mint: PublicKey,
  owner: PublicKey,
  allowOwnerOffCurve = true,
  programId = TOKEN_PROGRAM_ID,
  associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID,
): Promise<PublicKey> {
  if (!allowOwnerOffCurve && !PublicKey.isOnCurve(owner.toBuffer()))
    throw new Error('TokenOwnerOffCurve!');

  const [address] = await PublicKey.findProgramAddress(
    [owner.toBuffer(), programId.toBuffer(), mint.toBuffer()],
    associatedTokenProgramId,
  );

  return address;
}

export async function createAssociatedTokenAccountIdempotentInstruction(
  payer: PublicKey,
  owner: PublicKey,
  mint: PublicKey,
): Promise<TransactionInstruction> {
  const account = await getAssociatedTokenAddress(mint, owner);
  return new TransactionInstruction({
    keys: [
      { pubkey: payer, isSigner: true, isWritable: true },
      { pubkey: account, isSigner: false, isWritable: true },
      { pubkey: owner, isSigner: false, isWritable: false },
      { pubkey: mint, isSigner: false, isWritable: false },
      {
        pubkey: SystemProgram.programId,
        isSigner: false,
        isWritable: false,
      },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    programId: ASSOCIATED_TOKEN_PROGRAM_ID,
    data: Buffer.from([0x1]),
  });
}
