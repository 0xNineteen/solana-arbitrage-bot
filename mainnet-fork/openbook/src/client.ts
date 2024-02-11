import {
  type AnchorProvider,
  BN,
  Program,
  type IdlTypes,
  type IdlAccounts,
  Provider,
} from "@coral-xyz/anchor";
import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import {
  NATIVE_MINT,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  createCloseAccountInstruction,
  createInitializeAccount3Instruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import {
  type AccountInfo,
  type Commitment,
  type Connection,
  Keypair,
  PublicKey,
  type Signer,
  SystemProgram,
  type TransactionInstruction,
  type TransactionSignature,
  Transaction,
  type AccountMeta,
} from "@solana/web3.js";
import { IDL, type OpenbookV2 } from "./openbook_v2";
import { sendTransaction } from "./utils/rpc";
import { Side } from "./utils/utils";

export type IdsSource = "api" | "static" | "get-program-accounts";
export type PlaceOrderArgs = IdlTypes<OpenbookV2>["PlaceOrderArgs"];
export type PlaceOrderType = IdlTypes<OpenbookV2>["PlaceOrderType"];
export type PlaceOrderPeggedArgs = IdlTypes<OpenbookV2>["PlaceOrderPeggedArgs"];
export type PlaceMultipleOrdersArgs =
  IdlTypes<OpenbookV2>["PlaceMultipleOrdersArgs"];
export type OracleConfigParams = IdlTypes<OpenbookV2>["OracleConfigParams"];
export type OracleConfig = IdlTypes<OpenbookV2>["OracleConfig"];
export type MarketAccount = IdlAccounts<OpenbookV2>["market"];
export type OpenOrdersAccount = IdlAccounts<OpenbookV2>["openOrdersAccount"];
export type OpenOrdersIndexerAccount =
  IdlAccounts<OpenbookV2>["openOrdersIndexer"];
export type EventHeapAccount = IdlAccounts<OpenbookV2>["eventHeap"];
export type BookSideAccount = IdlAccounts<OpenbookV2>["bookSide"];
export type LeafNode = IdlTypes<OpenbookV2>["LeafNode"];
export type AnyNode = IdlTypes<OpenbookV2>["AnyNode"];
export type FillEvent = IdlTypes<OpenbookV2>["FillEvent"];
export type OutEvent = IdlTypes<OpenbookV2>["OutEvent"];

export interface OpenBookClientOptions {
  idsSource?: IdsSource;
  postSendTxCallback?: ({ txid }: { txid: string }) => void;
  prioritizationFee?: number;
  txConfirmationCommitment?: Commitment;
}

export function nameToString(name: number[]): string {
  return utf8.decode(new Uint8Array(name)).split("\x00")[0];
}

const BooksideSpace = 90944 + 8;
const EventHeapSpace = 91280 + 8;

export const OPENBOOK_PROGRAM_ID = new PublicKey(
  "opnb2LAfJYbRMAHHvqjCwQxanZn7ReEHp1k81EohpZb"
);

export class OpenBookV2Client {
  public program: Program<OpenbookV2>;

  private readonly idsSource: IdsSource;
  private readonly postSendTxCallback?: ({ txid }) => void;
  private readonly prioritizationFee: number;
  private readonly txConfirmationCommitment: Commitment;

  constructor(
    public provider: Provider,
    public programId: PublicKey = OPENBOOK_PROGRAM_ID,
    public opts: OpenBookClientOptions = {}
  ) {
    this.program = new Program<OpenbookV2>(IDL, programId, provider);
    this.idsSource = opts.idsSource ?? "get-program-accounts";
    this.prioritizationFee = opts?.prioritizationFee ?? 0;
    this.postSendTxCallback = opts?.postSendTxCallback;
    this.txConfirmationCommitment =
      opts?.txConfirmationCommitment ??
      ((this.program.provider as AnchorProvider).opts !== undefined
        ? (this.program.provider as AnchorProvider).opts.commitment
        : undefined) ??
      "processed";
    // TODO: evil side effect, but limited backtraces are a nightmare
    Error.stackTraceLimit = 1000;
  }

  /// Convenience accessors
  public get connection(): Connection {
    return this.program.provider.connection;
  }

  public get walletPk(): PublicKey {
    return (this.program.provider as AnchorProvider).wallet.publicKey;
  }

  public setProvider(provider: AnchorProvider): void {
    this.program = new Program<OpenbookV2>(IDL, this.programId, provider);
  }

  /// Transactions
  public async sendAndConfirmTransaction(
    ixs: TransactionInstruction[],
    opts: any = {}
  ): Promise<string> {
    return await sendTransaction(
      this.program.provider as AnchorProvider,
      ixs,
      opts.alts ?? [],
      {
        postSendTxCallback: this.postSendTxCallback,
        prioritizationFee: this.prioritizationFee,
        txConfirmationCommitment: this.txConfirmationCommitment,
        ...opts,
      }
    );
  }

  public async createProgramAccount(
    authority: Keypair,
    size: number
  ): Promise<PublicKey> {
    const lamports = await this.connection.getMinimumBalanceForRentExemption(
      size
    );
    const address = Keypair.generate();

    const tx = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: authority.publicKey,
        newAccountPubkey: address.publicKey,
        lamports,
        space: size,
        programId: this.programId,
      })
    ).instructions;

    await this.sendAndConfirmTransaction(tx, {
      additionalSigners: [authority, address],
    });
    return address.publicKey;
  }

  public async createProgramAccountIx(
    authority: PublicKey,
    size: number
  ): Promise<[TransactionInstruction, Signer]> {
    const lamports = await this.connection.getMinimumBalanceForRentExemption(
      size
    );
    const address = Keypair.generate();

    const ix = SystemProgram.createAccount({
      fromPubkey: authority,
      newAccountPubkey: address.publicKey,
      lamports,
      space: size,
      programId: this.programId,
    });
    return [ix, address];
  }

  // Get the MarketAccount from the market publicKey
  public async deserializeMarketAccount(
    publicKey: PublicKey
  ): Promise<MarketAccount | null> {
    try {
      return await this.program.account.market.fetch(publicKey);
    } catch (e) {
      throw e;
    }
  }

  public async deserializeOpenOrderAccount(
    publicKey: PublicKey
  ): Promise<OpenOrdersAccount | null> {
    try {
      return await this.program.account.openOrdersAccount.fetch(publicKey);
    } catch {
      return null;
    }
  }

  public async deserializeOpenOrdersIndexerAccount(
    publicKey: PublicKey
  ): Promise<OpenOrdersIndexerAccount | null> {
    try {
      return await this.program.account.openOrdersIndexer.fetch(publicKey);
    } catch {
      return null;
    }
  }

  public async deserializeEventHeapAccount(
    publicKey: PublicKey
  ): Promise<EventHeapAccount | null> {
    try {
      return await this.program.account.eventHeap.fetch(publicKey);
    } catch {
      return null;
    }
  }

  public async deserializeBookSide(
    publicKey: PublicKey
  ): Promise<BookSideAccount | null> {
    try {
      return await this.program.account.bookSide.fetch(publicKey);
    } catch {
      return null;
    }
  }

  public priceData(key: BN): number {
    const shiftedValue = key.shrn(64); // Shift right by 64 bits
    return shiftedValue.toNumber(); // Convert BN to a regular number
  }

  // Get bids or asks from a bookside account
  public getLeafNodes(bookside: BookSideAccount): LeafNode[] {
    const leafNodesData = bookside.nodes.nodes.filter(
      (x: AnyNode) => x.tag === 2
    );
    const leafNodes: LeafNode[] = [];
    for (const x of leafNodesData) {
      const leafNode: LeafNode = this.program.coder.types.decode(
        "LeafNode",
        Buffer.from([0, ...x.data])
      );
      leafNodes.push(leafNode);
    }
    return leafNodes;
  }

  public async createMarketIx(
    payer: PublicKey,
    name: string,
    quoteMint: PublicKey,
    baseMint: PublicKey,
    quoteLotSize: BN,
    baseLotSize: BN,
    makerFee: BN,
    takerFee: BN,
    timeExpiry: BN,
    oracleA: PublicKey | null,
    oracleB: PublicKey | null,
    openOrdersAdmin: PublicKey | null,
    consumeEventsAdmin: PublicKey | null,
    closeMarketAdmin: PublicKey | null,
    oracleConfigParams: OracleConfigParams = {
      confFilter: 0.1,
      maxStalenessSlots: 100,
    },
    market = Keypair.generate(),
    collectFeeAdmin?: PublicKey
  ): Promise<[TransactionInstruction[], Signer[]]> {
    const [bidIx, bidsKeypair] = await this.createProgramAccountIx(
      payer,
      BooksideSpace
    );
    const [askIx, askKeypair] = await this.createProgramAccountIx(
      payer,
      BooksideSpace
    );
    const [eventHeapIx, eventHeapKeypair] = await this.createProgramAccountIx(
      payer,
      EventHeapSpace
    );

    const [marketAuthority] = PublicKey.findProgramAddressSync(
      [Buffer.from("Market"), market.publicKey.toBuffer()],
      this.program.programId
    );

    const baseVault = getAssociatedTokenAddressSync(
      baseMint,
      marketAuthority,
      true
    );

    const quoteVault = getAssociatedTokenAddressSync(
      quoteMint,
      marketAuthority,
      true
    );

    const [eventAuthority] = PublicKey.findProgramAddressSync(
      [Buffer.from("__event_authority")],
      this.program.programId
    );

    const ix = await this.program.methods
      .createMarket(
        name,
        oracleConfigParams,
        quoteLotSize,
        baseLotSize,
        makerFee,
        takerFee,
        timeExpiry
      )
      .accounts({
        market: market.publicKey,
        marketAuthority,
        bids: bidsKeypair.publicKey,
        asks: askKeypair.publicKey,
        eventHeap: eventHeapKeypair.publicKey,
        payer,
        marketBaseVault: baseVault,
        marketQuoteVault: quoteVault,
        baseMint,
        quoteMint,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        oracleA,
        oracleB,
        collectFeeAdmin: collectFeeAdmin != null ? collectFeeAdmin : payer,
        openOrdersAdmin,
        consumeEventsAdmin,
        closeMarketAdmin,
        eventAuthority,
        program: this.programId,
      })
      .instruction();

    return [
      [bidIx, askIx, eventHeapIx, ix],
      [market, bidsKeypair, askKeypair, eventHeapKeypair],
    ];
  }

  // Book and EventHeap must be empty before closing a market.
  // Make sure to call consumeEvents and pruneOrders before closing the market.
  public async closeMarketIx(
    marketPublicKey: PublicKey,
    market: MarketAccount,
    solDestination: PublicKey,
    closeMarketAdmin: Keypair | null = null
  ): Promise<[TransactionInstruction, Signer[]]> {
    const ix = await this.program.methods
      .closeMarket()
      .accounts({
        closeMarketAdmin: market.closeMarketAdmin.key,
        market: marketPublicKey,
        asks: market.asks,
        bids: market.bids,
        eventHeap: market.eventHeap,
        solDestination: solDestination,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .instruction();
    const signers: Signer[] = [];
    if (
      this.walletPk !== market.closeMarketAdmin.key &&
      closeMarketAdmin !== null
    ) {
      signers.push(closeMarketAdmin);
    }

    return [ix, signers];
  }

  // Each owner has one open order indexer
  public findOpenOrdersIndexer(owner: PublicKey = this.walletPk): PublicKey {
    const [openOrdersIndexer] = PublicKey.findProgramAddressSync(
      [Buffer.from("OpenOrdersIndexer"), owner.toBuffer()],
      this.programId
    );
    return openOrdersIndexer;
  }

  public async createOpenOrdersIndexer(
    openOrdersIndexer: PublicKey
  ): Promise<TransactionSignature> {
    const ix = await this.program.methods
      .createOpenOrdersIndexer()
      .accounts({
        openOrdersIndexer,
        owner: this.walletPk,
        payer: this.walletPk,
        systemProgram: SystemProgram.programId,
      })
      .instruction();

    return await this.sendAndConfirmTransaction([ix]);
  }

  public async createOpenOrdersIndexerIx(
    openOrdersIndexer: PublicKey,
    owner: PublicKey = this.walletPk
  ): Promise<TransactionInstruction> {
    return await this.program.methods
      .createOpenOrdersIndexer()
      .accounts({
        openOrdersIndexer,
        owner,
        payer: this.walletPk,
      })
      .instruction();
  }

  public async findAllOpenOrders(
    owner: PublicKey = this.walletPk
  ): Promise<PublicKey[]> {
    const indexer = this.findOpenOrdersIndexer(owner);
    const indexerAccount = await this.deserializeOpenOrdersIndexerAccount(
      indexer
    );
    return indexerAccount?.addresses ?? [];
  }

  public findOpenOrderAtIndex(
    owner: PublicKey = this.walletPk,
    accountIndex: BN
  ): PublicKey {
    const [openOrders] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("OpenOrders"),
        owner.toBuffer(),
        accountIndex.toArrayLike(Buffer, "le", 4),
      ],
      this.programId
    );
    return openOrders;
  }

  public async findOpenOrdersForMarket(
    owner: PublicKey = this.walletPk,
    market: PublicKey
  ): Promise<PublicKey[]> {
    const openOrdersForMarket: PublicKey[] = [];
    const allOpenOrders = await this.findAllOpenOrders(owner);

    for await (const openOrders of allOpenOrders) {
      const openOrdersAccount = await this.deserializeOpenOrderAccount(
        openOrders
      );
      if (openOrdersAccount?.market.toString() === market.toString()) {
        openOrdersForMarket.push(openOrders);
      }
    }
    return openOrdersForMarket;
  }

  // If the owner doesn't have an open order indexer, this ix will also add the creation of it.
  // An open order indexer is needed before creating an open orders account.
  public async createOpenOrdersIx(
    market: PublicKey,
    name: string,
    owner: PublicKey = this.walletPk,
    delegateAccount: PublicKey | null,
    openOrdersIndexer?: PublicKey | null
  ): Promise<[TransactionInstruction[], PublicKey]> {
    const ixs: TransactionInstruction[] = [];
    let accountIndex = new BN(1);

    if (openOrdersIndexer == null) {
      openOrdersIndexer = this.findOpenOrdersIndexer(owner);
      try {
        const storedIndexer = await this.deserializeOpenOrdersIndexerAccount(
          openOrdersIndexer
        );
        if (storedIndexer == null) {
          ixs.push(
            await this.createOpenOrdersIndexerIx(openOrdersIndexer, owner)
          );
        } else {
          accountIndex = new BN(storedIndexer.createdCounter + 1);
        }
      } catch {
        ixs.push(
          await this.createOpenOrdersIndexerIx(openOrdersIndexer, owner)
        );
      }
    }

    const openOrdersAccount = this.findOpenOrderAtIndex(owner, accountIndex);

    ixs.push(
      await this.program.methods
        .createOpenOrdersAccount(name)
        .accounts({
          openOrdersIndexer,
          openOrdersAccount,
          market,
          owner,
          delegateAccount,
          payer: this.walletPk,
          // systemProgram: SystemProgram.programId,
        })
        .instruction()
    );

    return [ixs, openOrdersAccount];
  }

  public async createOpenOrders(
    payer: Keypair,
    market: PublicKey,
    name: string,
    owner: Keypair = payer,
    delegateAccount: PublicKey | null = null
  ): Promise<PublicKey> {
    const [ixs, openOrdersAccount] = await this.createOpenOrdersIx(
      market,
      name,
      owner.publicKey,
      delegateAccount
    );
    const additionalSigners = [payer];
    if (owner !== payer) {
      additionalSigners.push(owner);
    }

    await this.sendAndConfirmTransaction(ixs, {
      additionalSigners,
    });

    return openOrdersAccount;
  }

  public async depositIx(
    openOrdersPublicKey: PublicKey,
    openOrdersAccount: OpenOrdersAccount,
    market: MarketAccount,
    userBaseAccount: PublicKey,
    userQuoteAccount: PublicKey,
    baseAmount: BN,
    quoteAmount: BN
  ): Promise<TransactionInstruction> {
    const ix = await this.program.methods
      .deposit(baseAmount, quoteAmount)
      .accounts({
        owner: openOrdersAccount.owner,
        market: openOrdersAccount.market,
        openOrdersAccount: openOrdersPublicKey,
        userBaseAccount,
        userQuoteAccount,
        marketBaseVault: market.marketBaseVault,
        marketQuoteVault: market.marketQuoteVault,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .instruction();

    return ix;
  }

  public async depositNativeIx(
    openOrdersPublicKey: PublicKey,
    openOrdersAccount: OpenOrdersAccount,
    market: MarketAccount,
    userBaseAccount: PublicKey,
    userQuoteAccount: PublicKey,
    baseAmount: BN,
    quoteAmount: BN
  ): Promise<[TransactionInstruction[], Signer[]]> {
    const wrappedSolAccount: Keypair | undefined = new Keypair();
    let preInstructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    const lamports = baseAmount.add(new BN(1e7));

    preInstructions = [
      SystemProgram.createAccount({
        fromPubkey: openOrdersAccount.owner,
        newAccountPubkey: wrappedSolAccount.publicKey,
        lamports: lamports.toNumber(),
        space: 165,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeAccount3Instruction(
        wrappedSolAccount.publicKey,
        NATIVE_MINT,
        openOrdersAccount.owner
      ),
    ];
    postInstructions = [
      createCloseAccountInstruction(
        wrappedSolAccount.publicKey,
        openOrdersAccount.owner,
        openOrdersAccount.owner
      ),
    ];
    additionalSigners.push(wrappedSolAccount);

    const ix = await this.program.methods
      .deposit(baseAmount, quoteAmount)
      .accounts({
        owner: openOrdersAccount.owner,
        market: openOrdersAccount.market,
        openOrdersAccount: openOrdersPublicKey,
        userBaseAccount,
        userQuoteAccount,
        marketBaseVault: market.marketBaseVault,
        marketQuoteVault: market.marketBaseVault,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .instruction();

    return [[...preInstructions, ix, ...postInstructions], additionalSigners];
  }

  public decodeMarket(data: Buffer): any {
    return this.program.coder.accounts.decode("Market", data);
  }

  public async placeOrderIx(
    openOrdersPublicKey: PublicKey,
    marketPublicKey: PublicKey,
    market: MarketAccount,
    userTokenAccount: PublicKey,
    openOrdersAdmin: PublicKey | null,
    args: PlaceOrderArgs,
    remainingAccounts: PublicKey[],
    openOrdersDelegate?: Keypair
  ): Promise<[TransactionInstruction, Signer[]]> {
    const marketVault =
      args.side === Side.Bid ? market.marketQuoteVault : market.marketBaseVault;
    const accountsMeta: AccountMeta[] = remainingAccounts.map((remaining) => ({
      pubkey: remaining,
      isSigner: false,
      isWritable: true,
    }));

    const ix = await this.program.methods
      .placeOrder(args)
      .accounts({
        signer:
          openOrdersDelegate != null
            ? openOrdersDelegate.publicKey
            : this.walletPk,
        asks: market.asks,
        bids: market.bids,
        marketVault,
        eventHeap: market.eventHeap,
        market: marketPublicKey,
        openOrdersAccount: openOrdersPublicKey,
        oracleA: market.oracleA.key,
        oracleB: market.oracleB.key,
        userTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        openOrdersAdmin,
      })
      .remainingAccounts(accountsMeta)
      .instruction();
    const signers: Signer[] = [];
    if (openOrdersDelegate != null) {
      signers.push(openOrdersDelegate);
    }
    return [ix, signers];
  }

  public async placeOrderPeggedIx(
    openOrdersPublicKey: PublicKey,
    marketPublicKey: PublicKey,
    market: MarketAccount,
    userTokenAccount: PublicKey,
    openOrdersAdmin: PublicKey | null,
    args: PlaceOrderPeggedArgs,
    remainingAccounts: PublicKey[],
    openOrdersDelegate?: Keypair
  ): Promise<[TransactionInstruction, Signer[]]> {
    const marketVault =
      args.side === Side.Bid ? market.marketQuoteVault : market.marketBaseVault;
    const accountsMeta: AccountMeta[] = remainingAccounts.map((remaining) => ({
      pubkey: remaining,
      isSigner: false,
      isWritable: true,
    }));

    const ix = await this.program.methods
      .placeOrderPegged(args)
      .accounts({
        signer:
          openOrdersDelegate != null
            ? openOrdersDelegate.publicKey
            : this.walletPk,
        asks: market.asks,
        bids: market.bids,
        marketVault,
        eventHeap: market.eventHeap,
        market: marketPublicKey,
        openOrdersAccount: openOrdersPublicKey,
        oracleA: market.oracleA.key,
        oracleB: market.oracleB.key,
        userTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        openOrdersAdmin,
      })
      .remainingAccounts(accountsMeta)
      .instruction();
    const signers: Signer[] = [];
    if (openOrdersDelegate != null) {
      signers.push(openOrdersDelegate);
    }
    return [ix, signers];
  }

  public async placeTakeOrderIx(
    marketPublicKey: PublicKey,
    market: MarketAccount,
    userBaseAccount: PublicKey,
    userQuoteAccount: PublicKey,
    openOrdersAdmin: PublicKey | null,
    args: PlaceOrderArgs,
    remainingAccounts: PublicKey[],
    openOrdersDelegate?: Keypair
  ): Promise<[TransactionInstruction, Signer[]]> {
    const accountsMeta: AccountMeta[] = remainingAccounts.map((remaining) => ({
      pubkey: remaining,
      isSigner: false,
      isWritable: true,
    }));
    const ix = await this.program.methods
      .placeTakeOrder(args)
      .accounts({
        signer:
          openOrdersDelegate != null
            ? openOrdersDelegate.publicKey
            : this.walletPk,
        penaltyPayer: this.walletPk,
        asks: market.asks,
        bids: market.bids,
        eventHeap: market.eventHeap,
        market: marketPublicKey,
        oracleA: market.oracleA.key,
        oracleB: market.oracleB.key,
        userBaseAccount,
        userQuoteAccount,
        marketBaseVault: market.marketBaseVault,
        marketQuoteVault: market.marketQuoteVault,
        marketAuthority: market.marketAuthority,
        tokenProgram: TOKEN_PROGRAM_ID,
        openOrdersAdmin,
        systemProgram: SystemProgram.programId,
      })
      .remainingAccounts(accountsMeta)
      .instruction();
    const signers: Signer[] = [];
    if (openOrdersDelegate != null) {
      signers.push(openOrdersDelegate);
    }
    return [ix, signers];
  }

  // Use OrderType from './utils/utils' for orderType
  public async cancelAllAndPlaceOrdersIx(
    openOrdersPublicKey: PublicKey,
    marketPublicKey: PublicKey,
    market: MarketAccount,
    userBaseAccount: PublicKey,
    userQuoteAccount: PublicKey,
    openOrdersAdmin: PublicKey | null,
    orderType: PlaceOrderType,
    bids: PlaceMultipleOrdersArgs[],
    asks: PlaceMultipleOrdersArgs[],
    limit: number = 12,
    openOrdersDelegate?: Keypair
  ): Promise<[TransactionInstruction, Signer[]]> {
    const ix = await this.program.methods
      .cancelAllAndPlaceOrders(orderType, bids, asks, limit)
      .accounts({
        signer:
          openOrdersDelegate != null
            ? openOrdersDelegate.publicKey
            : this.walletPk,
        asks: market.asks,
        bids: market.bids,
        marketQuoteVault: market.marketQuoteVault,
        marketBaseVault: market.marketBaseVault,
        eventHeap: market.eventHeap,
        market: marketPublicKey,
        openOrdersAccount: openOrdersPublicKey,
        oracleA: market.oracleA.key,
        oracleB: market.oracleB.key,
        userBaseAccount,
        userQuoteAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        openOrdersAdmin,
      })
      .instruction();
    const signers: Signer[] = [];
    if (openOrdersDelegate != null) {
      signers.push(openOrdersDelegate);
    }
    return [ix, signers];
  }

  public async cancelOrderById(
    openOrdersPublicKey: PublicKey,
    openOrdersAccount: OpenOrdersAccount,
    market: MarketAccount,
    orderId: BN,
    openOrdersDelegate?: Keypair
  ): Promise<[TransactionInstruction, Signer[]]> {
    const ix = await this.program.methods
      .cancelOrder(orderId)
      .accounts({
        signer: openOrdersAccount.owner,
        asks: market.asks,
        bids: market.bids,
        market: openOrdersAccount.market,
        openOrdersAccount: openOrdersPublicKey,
      })
      .instruction();
    const signers: Signer[] = [];
    if (openOrdersDelegate != null) {
      signers.push(openOrdersDelegate);
    }
    return [ix, signers];
  }

  public async cancelOrderByClientId(
    openOrdersPublicKey: PublicKey,
    openOrdersAccount: OpenOrdersAccount,
    market: MarketAccount,
    clientOrderId: BN,
    openOrdersDelegate?: Keypair
  ): Promise<[TransactionInstruction, Signer[]]> {
    const ix = await this.program.methods
      .cancelOrderByClientOrderId(clientOrderId)
      .accounts({
        signer: openOrdersAccount.owner,
        asks: market.asks,
        bids: market.bids,
        market: openOrdersAccount.market,
        openOrdersAccount: openOrdersPublicKey,
      })
      .instruction();
    const signers: Signer[] = [];
    if (openOrdersDelegate != null) {
      signers.push(openOrdersDelegate);
    }
    return [ix, signers];
  }

  public async closeOpenOrdersIndexerIx(
    owner: Keypair,
    market: MarketAccount,
    openOrdersIndexer?: PublicKey
  ): Promise<[TransactionInstruction, Signer[]]> {
    if (openOrdersIndexer == null) {
      openOrdersIndexer = this.findOpenOrdersIndexer(owner.publicKey);
    }
    if (openOrdersIndexer !== null) {
      const ix = await this.program.methods
        .closeOpenOrdersIndexer()
        .accounts({
          owner: owner.publicKey,
          openOrdersIndexer: market.asks,
          solDestination: market.bids,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .instruction();

      const additionalSigners: Signer[] = [];
      if (owner.publicKey !== this.walletPk) {
        additionalSigners.push(owner);
      }

      return [ix, additionalSigners];
    }
    throw new Error("No open order indexer for the specified owner");
  }

  public async settleFundsIx(
    openOrdersPublicKey: PublicKey,
    openOrdersAccount: OpenOrdersAccount,
    marketPublicKey: PublicKey,
    market: MarketAccount,
    userBaseAccount: PublicKey,
    userQuoteAccount: PublicKey,
    referrerAccount: PublicKey | null,
    penaltyPayer: PublicKey | null,
    openOrdersDelegate?: Keypair
  ): Promise<[TransactionInstruction, Signer[]]> {
    const ix = await this.program.methods
      .settleFunds()
      .accounts({
        owner: openOrdersDelegate?.publicKey ?? openOrdersAccount.owner,
        market: marketPublicKey,
        openOrdersAccount: openOrdersPublicKey,
        marketAuthority: market.marketAuthority,
        marketBaseVault: market.marketBaseVault,
        marketQuoteVault: market.marketQuoteVault,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        userBaseAccount: userBaseAccount,
        userQuoteAccount: userQuoteAccount,
        referrerAccount: referrerAccount,
        penaltyPayer: penaltyPayer ?? PublicKey.default,
      })
      .instruction();

    const signers: Signer[] = [];
    if (openOrdersDelegate != null) {
      signers.push(openOrdersDelegate);
    }
    return [ix, signers];
  }

  public async closeOpenOrdersAccountIx(
    owner: Keypair,
    openOrdersPublicKey: PublicKey,
    solDestination: PublicKey = this.walletPk,
    openOrdersIndexer?: PublicKey
  ): Promise<[TransactionInstruction, Signer[]]> {
    if (openOrdersIndexer == null) {
      openOrdersIndexer = this.findOpenOrdersIndexer(owner.publicKey);
    }
    if (openOrdersIndexer !== null) {
      const ix = await this.program.methods
        .closeOpenOrdersAccount()
        .accounts({
          owner: owner.publicKey,
          openOrdersIndexer,
          openOrdersAccount: openOrdersPublicKey,
          solDestination,
          systemProgram: SystemProgram.programId,
        })
        .instruction();
      const additionalSigners: Keypair[] = [];
      if (owner.publicKey !== this.walletPk) {
        additionalSigners.push(owner);
      }
      return [ix, additionalSigners];
    }
    throw new Error("No open order indexer for the specified owner");
  }

  // Use getAccountsToConsume as a helper
  public async consumeEventsIx(
    marketPublicKey: PublicKey,
    market: MarketAccount,
    limit: BN,
    remainingAccounts: PublicKey[]
  ): Promise<TransactionInstruction> {
    const accountsMeta: AccountMeta[] = remainingAccounts.map((remaining) => ({
      pubkey: remaining,
      isSigner: false,
      isWritable: true,
    }));

    const eventAdminBs58 = market.consumeEventsAdmin.key.toBase58();
    const consumeEventsAdmin =
      eventAdminBs58 === PublicKey.default.toBase58()
        ? null
        : market.consumeEventsAdmin.key;

    const ix = await this.program.methods
      .consumeEvents(limit)
      .accounts({
        eventHeap: market.eventHeap,
        market: marketPublicKey,
        consumeEventsAdmin,
      })
      .remainingAccounts(accountsMeta)
      .instruction();
    return ix;
  }

  // Consume events for one specific account. Add other extra accounts as it's "free".
  public async consumeEventsForAccountIx(
    marketPublicKey: PublicKey,
    market: MarketAccount,
    openOrdersAccount: PublicKey
  ): Promise<TransactionInstruction> {
    const slots = await this.getSlotsToConsume(openOrdersAccount, market);

    const allAccounts = await this.getAccountsToConsume(market);
    // Create a set to remove duplicates
    const uniqueAccounts = new Set([openOrdersAccount, ...allAccounts]);
    // Limit extra accounts to 10 due tx limit and add openOrdersAccount
    const remainingAccounts = [...uniqueAccounts].slice(0, 10);
    const accountsMeta: AccountMeta[] = remainingAccounts.map((remaining) => ({
      pubkey: remaining,
      isSigner: false,
      isWritable: true,
    }));

    const ix = await this.program.methods
      .consumeGivenEvents(slots)
      .accounts({
        eventHeap: market.eventHeap,
        market: marketPublicKey,
        consumeEventsAdmin: market.consumeEventsAdmin.key,
      })
      .remainingAccounts(accountsMeta)
      .instruction();
    return ix;
  }

  // In order to get slots for certain key use getSlotsToConsume and include the key in the remainingAccounts
  public async consumeGivenEventsIx(
    marketPublicKey: PublicKey,
    market: MarketAccount,
    slots: BN[],
    remainingAccounts: PublicKey[]
  ): Promise<TransactionInstruction> {
    const accountsMeta: AccountMeta[] = remainingAccounts.map((remaining) => ({
      pubkey: remaining,
      isSigner: false,
      isWritable: true,
    }));
    const ix = await this.program.methods
      .consumeGivenEvents(slots)
      .accounts({
        eventHeap: market.eventHeap,
        market: marketPublicKey,
        consumeEventsAdmin: market.consumeEventsAdmin.key,
      })
      .remainingAccounts(accountsMeta)
      .instruction();
    return ix;
  }

  public async pruneOrdersIx(
    marketPublicKey: PublicKey,
    market: MarketAccount,
    openOrdersPublicKey: PublicKey,
    limit: number,
    closeMarketAdmin: Keypair | null = null
  ): Promise<[TransactionInstruction, Signer[]]> {
    const ix = await this.program.methods
      .pruneOrders(limit)
      .accounts({
        closeMarketAdmin: market.closeMarketAdmin.key,
        openOrdersAccount: openOrdersPublicKey,
        market: marketPublicKey,
        bids: market.bids,
        asks: market.asks,
      })
      .instruction();
    const signers: Signer[] = [];
    if (
      this.walletPk !== market.closeMarketAdmin.key &&
      closeMarketAdmin !== null
    ) {
      signers.push(closeMarketAdmin);
    }
    return [ix, signers];
  }

  public async getAccountsToConsume(
    market: MarketAccount
  ): Promise<PublicKey[]> {
    let accounts: PublicKey[] = new Array<PublicKey>();
    const eventHeap = await this.deserializeEventHeapAccount(market.eventHeap);
    if (eventHeap != null) {
      for (const node of eventHeap.nodes) {
        if (node.event.eventType === 0) {
          const fillEvent: FillEvent = this.program.coder.types.decode(
            "FillEvent",
            Buffer.from([0, ...node.event.padding])
          );
          accounts = accounts
            .filter((a) => a !== fillEvent.maker)
            .concat([fillEvent.maker]);
        } else {
          const outEvent: OutEvent = this.program.coder.types.decode(
            "OutEvent",
            Buffer.from([0, ...node.event.padding])
          );
          accounts = accounts
            .filter((a) => a !== outEvent.owner)
            .concat([outEvent.owner]);
        }
        // Tx would be too big, do not add more accounts
        if (accounts.length > 20) return accounts;
      }
    }
    return accounts;
  }

  public async getSlotsToConsume(
    key: PublicKey,
    market: MarketAccount
  ): Promise<BN[]> {
    const slots: BN[] = new Array<BN>();

    const eventHeap = await this.deserializeEventHeapAccount(market.eventHeap);
    if (eventHeap != null) {
      for (const [i, node] of eventHeap.nodes.entries()) {
        if (node.event.eventType === 0) {
          const fillEvent: FillEvent = this.program.coder.types.decode(
            "FillEvent",
            Buffer.from([0, ...node.event.padding])
          );
          if (key === fillEvent.maker) slots.push(new BN(i));
        } else {
          const outEvent: OutEvent = this.program.coder.types.decode(
            "OutEvent",
            Buffer.from([0, ...node.event.padding])
          );
          if (key === outEvent.owner) slots.push(new BN(i));
        }
      }
    }
    return slots;
  }
}

export async function getFilteredProgramAccounts(
  connection: Connection,
  programId: PublicKey,
  filters
): Promise<Array<{ publicKey: PublicKey; accountInfo: AccountInfo<Buffer> }>> {
  // @ts-expect-error not need check
  const resp = await connection._rpcRequest("getProgramAccounts", [
    programId.toBase58(),
    {
      commitment: connection.commitment,
      filters,
      encoding: "base64",
    },
  ]);
  if (resp.error !== null) {
    throw new Error(resp.error.message);
  }
  return resp.result.map(
    ({ pubkey, account: { data, executable, owner, lamports } }) => ({
      publicKey: new PublicKey(pubkey),
      accountInfo: {
        data: Buffer.from(data[0], "base64"),
        executable,
        owner: new PublicKey(owner),
        lamports,
      },
    })
  );
}
