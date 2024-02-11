import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from '@solana/web3.js';
import BN from 'bn.js';
import {
  MintLayout,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  type RawMint,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
///
/// numeric helpers
///
export const U64_MAX_BN = new BN('18446744073709551615');
export const I64_MAX_BN = new BN('9223372036854775807').toTwos(64);
export const QUOTE_DECIMALS = 6;

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

export function nativeToUiDecimalsForQuote(
  nativeAmount: number,
  quoteDecimals = QUOTE_DECIMALS,
): number {
  return toUiDecimals(nativeAmount, QUOTE_DECIMALS);
}

export function nativeToUiDecimalsForBase(
  nativeAmount: number,
  baseDecimals: number,
): number {
  return toUiDecimals(nativeAmount, baseDecimals);
}

export function roundTo5(number): number {
  if (number < 1) {
    const numString = number.toString();
    const nonZeroIndex = numString.search(/[1-9]/);
    if (nonZeroIndex === -1 || nonZeroIndex >= numString.length - 5) {
      return number;
    }
    return Number(numString.slice(0, (nonZeroIndex as number) + 5));
  } else if (number < 10) {
    return (
      Math.floor(number) +
      Number((number % 1).toString().padEnd(10, '0').slice(0, 6))
    );
  } else if (number < 100) {
    return (
      Math.floor(number) +
      Number((number % 1).toString().padEnd(10, '0').slice(0, 5))
    );
  } else if (number < 1000) {
    return (
      Math.floor(number) +
      Number((number % 1).toString().padEnd(10, '0').slice(0, 4))
    );
  } else if (number < 10000) {
    return (
      Math.floor(number) +
      Number((number % 1).toString().padEnd(10, '0').slice(0, 3))
    );
  }
  return Math.round(number);
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

export function decodeMint(data: Buffer): RawMint {
  return MintLayout.decode(data);
}
