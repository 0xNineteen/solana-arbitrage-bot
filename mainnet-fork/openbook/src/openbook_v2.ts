export interface OpenbookV2 {
  version: '0.1.0';
  name: 'openbook_v2';
  instructions: [
    {
      name: 'createMarket';
      docs: [
        'Create a [`Market`](crate::state::Market) for a given token pair.',
      ];
      accounts: [
        {
          name: 'market';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'marketAuthority';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'bids';
          isMut: true;
          isSigner: false;
          docs: [
            'Accounts are initialized by client,',
            'anchor discriminator is set first when ix exits,',
          ];
        },
        {
          name: 'asks';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'eventHeap';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'marketBaseVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'marketQuoteVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'baseMint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'quoteMint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'associatedTokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'oracleA';
          isMut: false;
          isSigner: false;
          isOptional: true;
        },
        {
          name: 'oracleB';
          isMut: false;
          isSigner: false;
          isOptional: true;
        },
        {
          name: 'collectFeeAdmin';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'openOrdersAdmin';
          isMut: false;
          isSigner: false;
          isOptional: true;
        },
        {
          name: 'consumeEventsAdmin';
          isMut: false;
          isSigner: false;
          isOptional: true;
        },
        {
          name: 'closeMarketAdmin';
          isMut: false;
          isSigner: false;
          isOptional: true;
        },
        {
          name: 'eventAuthority';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'program';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'name';
          type: 'string';
        },
        {
          name: 'oracleConfig';
          type: {
            defined: 'OracleConfigParams';
          };
        },
        {
          name: 'quoteLotSize';
          type: 'i64';
        },
        {
          name: 'baseLotSize';
          type: 'i64';
        },
        {
          name: 'makerFee';
          type: 'i64';
        },
        {
          name: 'takerFee';
          type: 'i64';
        },
        {
          name: 'timeExpiry';
          type: 'i64';
        },
      ];
    },
    {
      name: 'closeMarket';
      docs: [
        'Close a [`Market`](crate::state::Market) (only',
        '[`close_market_admin`](crate::state::Market::close_market_admin)).',
      ];
      accounts: [
        {
          name: 'closeMarketAdmin';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'market';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'bids';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'asks';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'eventHeap';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'solDestination';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [];
    },
    {
      name: 'createOpenOrdersIndexer';
      docs: [
        'Create an [`OpenOrdersIndexer`](crate::state::OpenOrdersIndexer) account.',
      ];
      accounts: [
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'owner';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'openOrdersIndexer';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [];
    },
    {
      name: 'closeOpenOrdersIndexer';
      docs: [
        'Close an [`OpenOrdersIndexer`](crate::state::OpenOrdersIndexer) account.',
      ];
      accounts: [
        {
          name: 'owner';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'openOrdersIndexer';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'solDestination';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [];
    },
    {
      name: 'createOpenOrdersAccount';
      docs: [
        'Create an [`OpenOrdersAccount`](crate::state::OpenOrdersAccount).',
      ];
      accounts: [
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'owner';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'delegateAccount';
          isMut: false;
          isSigner: false;
          isOptional: true;
        },
        {
          name: 'openOrdersIndexer';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'openOrdersAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'market';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'name';
          type: 'string';
        },
      ];
    },
    {
      name: 'closeOpenOrdersAccount';
      docs: [
        'Close an [`OpenOrdersAccount`](crate::state::OpenOrdersAccount).',
      ];
      accounts: [
        {
          name: 'owner';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'openOrdersIndexer';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'openOrdersAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'solDestination';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [];
    },
    {
      name: 'placeOrder';
      docs: [
        'Place an order.',
        '',
        'Different types of orders have different effects on the order book,',
        'as described in [`PlaceOrderType`](crate::state::PlaceOrderType).',
        '',
        '`price_lots` refers to the price in lots: the number of quote lots',
        'per base lot. It is ignored for `PlaceOrderType::Market` orders.',
        '',
        '`expiry_timestamp` is a unix timestamp for when this order should',
        'expire. If 0 is passed in, the order will never expire. If the time',
        'is in the past, the instruction is skipped. Timestamps in the future',
        'are reduced to now + 65,535s.',
        '',
        '`limit` determines the maximum number of orders from the book to fill,',
        'and can be used to limit CU spent. When the limit is reached, processing',
        'stops and the instruction succeeds.',
      ];
      accounts: [
        {
          name: 'signer';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'openOrdersAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'openOrdersAdmin';
          isMut: false;
          isSigner: true;
          isOptional: true;
        },
        {
          name: 'userTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'market';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'bids';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'asks';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'eventHeap';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'marketVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'oracleA';
          isMut: false;
          isSigner: false;
          isOptional: true;
        },
        {
          name: 'oracleB';
          isMut: false;
          isSigner: false;
          isOptional: true;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'args';
          type: {
            defined: 'PlaceOrderArgs';
          };
        },
      ];
      returns: {
        option: 'u128';
      };
    },
    {
      name: 'editOrder';
      docs: ['Edit an order.'];
      accounts: [
        {
          name: 'signer';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'openOrdersAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'openOrdersAdmin';
          isMut: false;
          isSigner: true;
          isOptional: true;
        },
        {
          name: 'userTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'market';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'bids';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'asks';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'eventHeap';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'marketVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'oracleA';
          isMut: false;
          isSigner: false;
          isOptional: true;
        },
        {
          name: 'oracleB';
          isMut: false;
          isSigner: false;
          isOptional: true;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'clientOrderId';
          type: 'u64';
        },
        {
          name: 'expectedCancelSize';
          type: 'i64';
        },
        {
          name: 'placeOrder';
          type: {
            defined: 'PlaceOrderArgs';
          };
        },
      ];
      returns: {
        option: 'u128';
      };
    },
    {
      name: 'editOrderPegged';
      docs: ['Edit an order pegged.'];
      accounts: [
        {
          name: 'signer';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'openOrdersAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'openOrdersAdmin';
          isMut: false;
          isSigner: true;
          isOptional: true;
        },
        {
          name: 'userTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'market';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'bids';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'asks';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'eventHeap';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'marketVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'oracleA';
          isMut: false;
          isSigner: false;
          isOptional: true;
        },
        {
          name: 'oracleB';
          isMut: false;
          isSigner: false;
          isOptional: true;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'clientOrderId';
          type: 'u64';
        },
        {
          name: 'expectedCancelSize';
          type: 'i64';
        },
        {
          name: 'placeOrder';
          type: {
            defined: 'PlaceOrderPeggedArgs';
          };
        },
      ];
      returns: {
        option: 'u128';
      };
    },
    {
      name: 'cancelAllAndPlaceOrders';
      docs: ['Cancel orders and place multiple orders.'];
      accounts: [
        {
          name: 'signer';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'openOrdersAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'openOrdersAdmin';
          isMut: false;
          isSigner: true;
          isOptional: true;
        },
        {
          name: 'userQuoteAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'userBaseAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'market';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'bids';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'asks';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'eventHeap';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'marketQuoteVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'marketBaseVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'oracleA';
          isMut: false;
          isSigner: false;
          isOptional: true;
        },
        {
          name: 'oracleB';
          isMut: false;
          isSigner: false;
          isOptional: true;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'ordersType';
          type: {
            defined: 'PlaceOrderType';
          };
        },
        {
          name: 'bids';
          type: {
            vec: {
              defined: 'PlaceMultipleOrdersArgs';
            };
          };
        },
        {
          name: 'asks';
          type: {
            vec: {
              defined: 'PlaceMultipleOrdersArgs';
            };
          };
        },
        {
          name: 'limit';
          type: 'u8';
        },
      ];
      returns: {
        vec: {
          option: 'u128';
        };
      };
    },
    {
      name: 'placeOrderPegged';
      docs: ['Place an oracle-peg order.'];
      accounts: [
        {
          name: 'signer';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'openOrdersAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'openOrdersAdmin';
          isMut: false;
          isSigner: true;
          isOptional: true;
        },
        {
          name: 'userTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'market';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'bids';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'asks';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'eventHeap';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'marketVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'oracleA';
          isMut: false;
          isSigner: false;
          isOptional: true;
        },
        {
          name: 'oracleB';
          isMut: false;
          isSigner: false;
          isOptional: true;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'args';
          type: {
            defined: 'PlaceOrderPeggedArgs';
          };
        },
      ];
      returns: {
        option: 'u128';
      };
    },
    {
      name: 'placeTakeOrder';
      docs: [
        'Place an order that shall take existing liquidity off of the book, not',
        'add a new order off the book.',
        '',
        'This type of order allows for instant token settlement for the taker.',
      ];
      accounts: [
        {
          name: 'signer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'penaltyPayer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'market';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'marketAuthority';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'bids';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'asks';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'marketBaseVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'marketQuoteVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'eventHeap';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'userBaseAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'userQuoteAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'oracleA';
          isMut: false;
          isSigner: false;
          isOptional: true;
        },
        {
          name: 'oracleB';
          isMut: false;
          isSigner: false;
          isOptional: true;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'openOrdersAdmin';
          isMut: false;
          isSigner: true;
          isOptional: true;
        },
      ];
      args: [
        {
          name: 'args';
          type: {
            defined: 'PlaceTakeOrderArgs';
          };
        },
      ];
    },
    {
      name: 'consumeEvents';
      docs: [
        'Process up to `limit` [events](crate::state::AnyEvent).',
        '',
        "When a user places a 'take' order, they do not know beforehand which",
        "market maker will have placed the 'make' order that they get executed",
        "against. This prevents them from passing in a market maker's",
        '[`OpenOrdersAccount`](crate::state::OpenOrdersAccount), which is needed',
        'to credit/debit the relevant tokens to/from the maker. As such, Openbook',
        "uses a 'crank' system, where `place_order` only emits events, and",
        '`consume_events` handles token settlement.',
        '',
        'Currently, there are two types of events: [`FillEvent`](crate::state::FillEvent)s',
        'and [`OutEvent`](crate::state::OutEvent)s.',
        '',
        'A `FillEvent` is emitted when an order is filled, and it is handled by',
        'debiting whatever the taker is selling from the taker and crediting',
        'it to the maker, and debiting whatever the taker is buying from the',
        'maker and crediting it to the taker. Note that *no tokens are moved*,',
        "these are just debits and credits to each party's [`Position`](crate::state::Position).",
        '',
        'An `OutEvent` is emitted when a limit order needs to be removed from',
        'the book during a `place_order` invocation, and it is handled by',
        'crediting whatever the maker would have sold (quote token in a bid,',
        'base token in an ask) back to the maker.',
      ];
      accounts: [
        {
          name: 'consumeEventsAdmin';
          isMut: false;
          isSigner: true;
          isOptional: true;
        },
        {
          name: 'market';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'eventHeap';
          isMut: true;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'limit';
          type: 'u64';
        },
      ];
    },
    {
      name: 'consumeGivenEvents';
      docs: [
        'Process the [events](crate::state::AnyEvent) at the given positions.',
      ];
      accounts: [
        {
          name: 'consumeEventsAdmin';
          isMut: false;
          isSigner: true;
          isOptional: true;
        },
        {
          name: 'market';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'eventHeap';
          isMut: true;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'slots';
          type: {
            vec: 'u64';
          };
        },
      ];
    },
    {
      name: 'cancelOrder';
      docs: [
        'Cancel an order by its `order_id`.',
        '',
        "Note that this doesn't emit an [`OutEvent`](crate::state::OutEvent) because a",
        'maker knows that they will be passing in their own [`OpenOrdersAccount`](crate::state::OpenOrdersAccount).',
      ];
      accounts: [
        {
          name: 'signer';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'openOrdersAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'market';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'bids';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'asks';
          isMut: true;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'orderId';
          type: 'u128';
        },
      ];
    },
    {
      name: 'cancelOrderByClientOrderId';
      docs: [
        'Cancel an order by its `client_order_id`.',
        '',
        "Note that this doesn't emit an [`OutEvent`](crate::state::OutEvent) because a",
        'maker knows that they will be passing in their own [`OpenOrdersAccount`](crate::state::OpenOrdersAccount).',
      ];
      accounts: [
        {
          name: 'signer';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'openOrdersAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'market';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'bids';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'asks';
          isMut: true;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'clientOrderId';
          type: 'u64';
        },
      ];
      returns: 'i64';
    },
    {
      name: 'cancelAllOrders';
      docs: ['Cancel up to `limit` orders, optionally filtering by side'];
      accounts: [
        {
          name: 'signer';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'openOrdersAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'market';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'bids';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'asks';
          isMut: true;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'sideOption';
          type: {
            option: {
              defined: 'Side';
            };
          };
        },
        {
          name: 'limit';
          type: 'u8';
        },
      ];
    },
    {
      name: 'deposit';
      docs: [
        "Deposit a certain amount of `base` and `quote` lamports into one's",
        '[`Position`](crate::state::Position).',
        '',
        'Makers might wish to `deposit`, rather than have actual tokens moved for',
        'each trade, in order to reduce CUs.',
      ];
      accounts: [
        {
          name: 'owner';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'userBaseAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'userQuoteAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'openOrdersAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'market';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'marketBaseVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'marketQuoteVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'baseAmount';
          type: 'u64';
        },
        {
          name: 'quoteAmount';
          type: 'u64';
        },
      ];
    },
    {
      name: 'refill';
      docs: [
        'Refill a certain amount of `base` and `quote` lamports. The amount being passed is the',
        'total lamports that the [`Position`](crate::state::Position) will have.',
        '',
        'Makers might wish to `refill`, rather than have actual tokens moved for',
        'each trade, in order to reduce CUs.',
      ];
      accounts: [
        {
          name: 'owner';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'userBaseAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'userQuoteAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'openOrdersAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'market';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'marketBaseVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'marketQuoteVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'baseAmount';
          type: 'u64';
        },
        {
          name: 'quoteAmount';
          type: 'u64';
        },
      ];
    },
    {
      name: 'settleFunds';
      docs: ['Withdraw any available tokens.'];
      accounts: [
        {
          name: 'owner';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'penaltyPayer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'openOrdersAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'market';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'marketAuthority';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'marketBaseVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'marketQuoteVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'userBaseAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'userQuoteAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'referrerAccount';
          isMut: true;
          isSigner: false;
          isOptional: true;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [];
    },
    {
      name: 'settleFundsExpired';
      docs: [
        'Withdraw any available tokens when the market is expired (only',
        '[`close_market_admin`](crate::state::Market::close_market_admin)).',
      ];
      accounts: [
        {
          name: 'closeMarketAdmin';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'owner';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'penaltyPayer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'openOrdersAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'market';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'marketAuthority';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'marketBaseVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'marketQuoteVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'userBaseAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'userQuoteAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'referrerAccount';
          isMut: true;
          isSigner: false;
          isOptional: true;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [];
    },
    {
      name: 'sweepFees';
      docs: ["Sweep fees, as a [`Market`](crate::state::Market)'s admin."];
      accounts: [
        {
          name: 'collectFeeAdmin';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'market';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'marketAuthority';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'marketQuoteVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenReceiverAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [];
    },
    {
      name: 'setDelegate';
      docs: [
        'Update the [`delegate`](crate::state::OpenOrdersAccount::delegate) of an open orders account.',
      ];
      accounts: [
        {
          name: 'owner';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'openOrdersAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'delegateAccount';
          isMut: false;
          isSigner: false;
          isOptional: true;
        },
      ];
      args: [];
    },
    {
      name: 'setMarketExpired';
      docs: [
        'Set market to expired before pruning orders and closing the market (only',
        '[`close_market_admin`](crate::state::Market::close_market_admin)).',
      ];
      accounts: [
        {
          name: 'closeMarketAdmin';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'market';
          isMut: true;
          isSigner: false;
        },
      ];
      args: [];
    },
    {
      name: 'pruneOrders';
      docs: [
        'Remove orders from the book when the market is expired (only',
        '[`close_market_admin`](crate::state::Market::close_market_admin)).',
      ];
      accounts: [
        {
          name: 'closeMarketAdmin';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'openOrdersAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'market';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'bids';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'asks';
          isMut: true;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'limit';
          type: 'u8';
        },
      ];
    },
    {
      name: 'stubOracleCreate';
      accounts: [
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'owner';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'oracle';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'mint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'price';
          type: 'f64';
        },
      ];
    },
    {
      name: 'stubOracleClose';
      accounts: [
        {
          name: 'owner';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'oracle';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'solDestination';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [];
    },
    {
      name: 'stubOracleSet';
      accounts: [
        {
          name: 'owner';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'oracle';
          isMut: true;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'price';
          type: 'f64';
        },
      ];
    },
  ];
  accounts: [
    {
      name: 'market';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'bump';
            docs: ['PDA bump'];
            type: 'u8';
          },
          {
            name: 'baseDecimals';
            docs: [
              'Number of decimals used for the base token.',
              '',
              "Used to convert the oracle's price into a native/native price.",
            ];
            type: 'u8';
          },
          {
            name: 'quoteDecimals';
            type: 'u8';
          },
          {
            name: 'padding1';
            type: {
              array: ['u8', 5];
            };
          },
          {
            name: 'marketAuthority';
            type: 'publicKey';
          },
          {
            name: 'timeExpiry';
            docs: [
              'No expiry = 0. Market will expire and no trading allowed after time_expiry',
            ];
            type: 'i64';
          },
          {
            name: 'collectFeeAdmin';
            docs: ['Admin who can collect fees from the market'];
            type: 'publicKey';
          },
          {
            name: 'openOrdersAdmin';
            docs: ['Admin who must sign off on all order creations'];
            type: {
              defined: 'NonZeroPubkeyOption';
            };
          },
          {
            name: 'consumeEventsAdmin';
            docs: ['Admin who must sign off on all event consumptions'];
            type: {
              defined: 'NonZeroPubkeyOption';
            };
          },
          {
            name: 'closeMarketAdmin';
            docs: [
              'Admin who can set market expired, prune orders and close the market',
            ];
            type: {
              defined: 'NonZeroPubkeyOption';
            };
          },
          {
            name: 'name';
            docs: ['Name. Trailing zero bytes are ignored.'];
            type: {
              array: ['u8', 16];
            };
          },
          {
            name: 'bids';
            docs: ['Address of the BookSide account for bids'];
            type: 'publicKey';
          },
          {
            name: 'asks';
            docs: ['Address of the BookSide account for asks'];
            type: 'publicKey';
          },
          {
            name: 'eventHeap';
            docs: ['Address of the EventHeap account'];
            type: 'publicKey';
          },
          {
            name: 'oracleA';
            docs: ['Oracles account address'];
            type: {
              defined: 'NonZeroPubkeyOption';
            };
          },
          {
            name: 'oracleB';
            type: {
              defined: 'NonZeroPubkeyOption';
            };
          },
          {
            name: 'oracleConfig';
            docs: ['Oracle configuration'];
            type: {
              defined: 'OracleConfig';
            };
          },
          {
            name: 'quoteLotSize';
            docs: [
              'Number of quote native in a quote lot. Must be a power of 10.',
              '',
              'Primarily useful for increasing the tick size on the market: A lot price',
              'of 1 becomes a native price of quote_lot_size/base_lot_size becomes a',
              'ui price of quote_lot_size*base_decimals/base_lot_size/quote_decimals.',
            ];
            type: 'i64';
          },
          {
            name: 'baseLotSize';
            docs: [
              'Number of base native in a base lot. Must be a power of 10.',
              '',
              'Example: If base decimals for the underlying asset is 6, base lot size',
              'is 100 and and base position lots is 10_000 then base position native is',
              '1_000_000 and base position ui is 1.',
            ];
            type: 'i64';
          },
          {
            name: 'seqNum';
            docs: ['Total number of orders seen'];
            type: 'u64';
          },
          {
            name: 'registrationTime';
            docs: ['Timestamp in seconds that the market was registered at.'];
            type: 'i64';
          },
          {
            name: 'makerFee';
            docs: [
              'Fees',
              '',
              'Fee (in 10^-6) when matching maker orders.',
              'maker_fee < 0 it means some of the taker_fees goes to the maker',
              'maker_fee > 0, it means no taker_fee to the maker, and maker fee goes to the referral',
            ];
            type: 'i64';
          },
          {
            name: 'takerFee';
            docs: ['Fee (in 10^-6) for taker orders, always >= 0.'];
            type: 'i64';
          },
          {
            name: 'feesAccrued';
            docs: ['Total fees accrued in native quote'];
            type: 'u128';
          },
          {
            name: 'feesToReferrers';
            docs: ['Total fees settled in native quote'];
            type: 'u128';
          },
          {
            name: 'referrerRebatesAccrued';
            docs: ['Referrer rebates to be distributed'];
            type: 'u64';
          },
          {
            name: 'feesAvailable';
            docs: ['Fees generated and available to withdraw via sweep_fees'];
            type: 'u64';
          },
          {
            name: 'makerVolume';
            docs: [
              'Cumulative maker volume (same as taker volume) in quote native units',
            ];
            type: 'u128';
          },
          {
            name: 'takerVolumeWoOo';
            docs: [
              'Cumulative taker volume in quote native units due to place take orders',
            ];
            type: 'u128';
          },
          {
            name: 'baseMint';
            type: 'publicKey';
          },
          {
            name: 'quoteMint';
            type: 'publicKey';
          },
          {
            name: 'marketBaseVault';
            type: 'publicKey';
          },
          {
            name: 'baseDepositTotal';
            type: 'u64';
          },
          {
            name: 'marketQuoteVault';
            type: 'publicKey';
          },
          {
            name: 'quoteDepositTotal';
            type: 'u64';
          },
          {
            name: 'reserved';
            type: {
              array: ['u8', 128];
            };
          },
        ];
      };
    },
    {
      name: 'openOrdersAccount';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'owner';
            type: 'publicKey';
          },
          {
            name: 'market';
            type: 'publicKey';
          },
          {
            name: 'name';
            type: {
              array: ['u8', 32];
            };
          },
          {
            name: 'delegate';
            type: {
              defined: 'NonZeroPubkeyOption';
            };
          },
          {
            name: 'accountNum';
            type: 'u32';
          },
          {
            name: 'bump';
            type: 'u8';
          },
          {
            name: 'version';
            type: 'u8';
          },
          {
            name: 'padding';
            type: {
              array: ['u8', 2];
            };
          },
          {
            name: 'position';
            type: {
              defined: 'Position';
            };
          },
          {
            name: 'openOrders';
            type: {
              array: [
                {
                  defined: 'OpenOrder';
                },
                24,
              ];
            };
          },
        ];
      };
    },
    {
      name: 'openOrdersIndexer';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'bump';
            type: 'u8';
          },
          {
            name: 'createdCounter';
            type: 'u32';
          },
          {
            name: 'addresses';
            type: {
              vec: 'publicKey';
            };
          },
        ];
      };
    },
    {
      name: 'stubOracle';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'owner';
            type: 'publicKey';
          },
          {
            name: 'mint';
            type: 'publicKey';
          },
          {
            name: 'price';
            type: 'f64';
          },
          {
            name: 'lastUpdateTs';
            type: 'i64';
          },
          {
            name: 'lastUpdateSlot';
            type: 'u64';
          },
          {
            name: 'deviation';
            type: 'f64';
          },
          {
            name: 'reserved';
            type: {
              array: ['u8', 104];
            };
          },
        ];
      };
    },
    {
      name: 'bookSide';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'roots';
            type: {
              array: [
                {
                  defined: 'OrderTreeRoot';
                },
                2,
              ];
            };
          },
          {
            name: 'reservedRoots';
            type: {
              array: [
                {
                  defined: 'OrderTreeRoot';
                },
                4,
              ];
            };
          },
          {
            name: 'reserved';
            type: {
              array: ['u8', 256];
            };
          },
          {
            name: 'nodes';
            type: {
              defined: 'OrderTreeNodes';
            };
          },
        ];
      };
    },
    {
      name: 'eventHeap';
      docs: [
        'Container for the different EventTypes.',
        '',
        'Events are stored in a fixed-array of nodes. Free nodes are connected by a single-linked list',
        'starting at free_head while used nodes form a circular doubly-linked list starting at',
        'used_head.',
      ];
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'header';
            type: {
              defined: 'EventHeapHeader';
            };
          },
          {
            name: 'nodes';
            type: {
              array: [
                {
                  defined: 'EventNode';
                },
                600,
              ];
            };
          },
          {
            name: 'reserved';
            type: {
              array: ['u8', 64];
            };
          },
        ];
      };
    },
  ];
  types: [
    {
      name: 'NonZeroPubkeyOption';
      docs: [
        'Like `Option`, but implemented for `Pubkey` to be used with `zero_copy`',
      ];
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'key';
            type: 'publicKey';
          },
        ];
      };
    },
    {
      name: 'Position';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'bidsBaseLots';
            docs: ['Base lots in open bids'];
            type: 'i64';
          },
          {
            name: 'asksBaseLots';
            docs: ['Base lots in open asks'];
            type: 'i64';
          },
          {
            name: 'baseFreeNative';
            type: 'u64';
          },
          {
            name: 'quoteFreeNative';
            type: 'u64';
          },
          {
            name: 'lockedMakerFees';
            type: 'u64';
          },
          {
            name: 'referrerRebatesAvailable';
            type: 'u64';
          },
          {
            name: 'penaltyHeapCount';
            docs: [
              'Count of ixs when events are added to the heap',
              'To avoid this, send remaining accounts in order to process the events',
            ];
            type: 'u64';
          },
          {
            name: 'makerVolume';
            docs: [
              'Cumulative maker volume in quote native units (display only)',
            ];
            type: 'u128';
          },
          {
            name: 'takerVolume';
            docs: [
              'Cumulative taker volume in quote native units (display only)',
            ];
            type: 'u128';
          },
          {
            name: 'bidsQuoteLots';
            docs: ['Quote lots in open bids'];
            type: 'i64';
          },
          {
            name: 'reserved';
            type: {
              array: ['u8', 64];
            };
          },
        ];
      };
    },
    {
      name: 'OpenOrder';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'id';
            type: 'u128';
          },
          {
            name: 'clientId';
            type: 'u64';
          },
          {
            name: 'lockedPrice';
            docs: ["Price at which user's assets were locked"];
            type: 'i64';
          },
          {
            name: 'isFree';
            type: 'u8';
          },
          {
            name: 'sideAndTree';
            type: 'u8';
          },
          {
            name: 'padding';
            type: {
              array: ['u8', 6];
            };
          },
        ];
      };
    },
    {
      name: 'OracleConfig';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'confFilter';
            type: 'f64';
          },
          {
            name: 'maxStalenessSlots';
            type: 'i64';
          },
          {
            name: 'reserved';
            type: {
              array: ['u8', 72];
            };
          },
        ];
      };
    },
    {
      name: 'OracleConfigParams';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'confFilter';
            type: 'f32';
          },
          {
            name: 'maxStalenessSlots';
            type: {
              option: 'u32';
            };
          },
        ];
      };
    },
    {
      name: 'EventHeapHeader';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'freeHead';
            type: 'u16';
          },
          {
            name: 'usedHead';
            type: 'u16';
          },
          {
            name: 'count';
            type: 'u16';
          },
          {
            name: 'padd';
            type: 'u16';
          },
          {
            name: 'seqNum';
            type: 'u64';
          },
        ];
      };
    },
    {
      name: 'EventNode';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'next';
            type: 'u16';
          },
          {
            name: 'prev';
            type: 'u16';
          },
          {
            name: 'pad';
            type: {
              array: ['u8', 4];
            };
          },
          {
            name: 'event';
            type: {
              defined: 'AnyEvent';
            };
          },
        ];
      };
    },
    {
      name: 'AnyEvent';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'eventType';
            type: 'u8';
          },
          {
            name: 'padding';
            type: {
              array: ['u8', 143];
            };
          },
        ];
      };
    },
    {
      name: 'FillEvent';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'eventType';
            type: 'u8';
          },
          {
            name: 'takerSide';
            type: 'u8';
          },
          {
            name: 'makerOut';
            type: 'u8';
          },
          {
            name: 'makerSlot';
            type: 'u8';
          },
          {
            name: 'padding';
            type: {
              array: ['u8', 4];
            };
          },
          {
            name: 'timestamp';
            type: 'u64';
          },
          {
            name: 'seqNum';
            type: 'u64';
          },
          {
            name: 'maker';
            type: 'publicKey';
          },
          {
            name: 'makerTimestamp';
            type: 'u64';
          },
          {
            name: 'taker';
            type: 'publicKey';
          },
          {
            name: 'takerClientOrderId';
            type: 'u64';
          },
          {
            name: 'price';
            type: 'i64';
          },
          {
            name: 'pegLimit';
            type: 'i64';
          },
          {
            name: 'quantity';
            type: 'i64';
          },
          {
            name: 'makerClientOrderId';
            type: 'u64';
          },
          {
            name: 'reserved';
            type: {
              array: ['u8', 8];
            };
          },
        ];
      };
    },
    {
      name: 'OutEvent';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'eventType';
            type: 'u8';
          },
          {
            name: 'side';
            type: 'u8';
          },
          {
            name: 'ownerSlot';
            type: 'u8';
          },
          {
            name: 'padding0';
            type: {
              array: ['u8', 5];
            };
          },
          {
            name: 'timestamp';
            type: 'u64';
          },
          {
            name: 'seqNum';
            type: 'u64';
          },
          {
            name: 'owner';
            type: 'publicKey';
          },
          {
            name: 'quantity';
            type: 'i64';
          },
          {
            name: 'padding1';
            type: {
              array: ['u8', 80];
            };
          },
        ];
      };
    },
    {
      name: 'InnerNode';
      docs: [
        'InnerNodes and LeafNodes compose the binary tree of orders.',
        '',
        'Each InnerNode has exactly two children, which are either InnerNodes themselves,',
        'or LeafNodes. The children share the top `prefix_len` bits of `key`. The left',
        'child has a 0 in the next bit, and the right a 1.',
      ];
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'tag';
            type: 'u8';
          },
          {
            name: 'padding';
            type: {
              array: ['u8', 3];
            };
          },
          {
            name: 'prefixLen';
            docs: [
              'number of highest `key` bits that all children share',
              "e.g. if it's 2, the two highest bits of `key` will be the same on all children",
            ];
            type: 'u32';
          },
          {
            name: 'key';
            docs: ['only the top `prefix_len` bits of `key` are relevant'];
            type: 'u128';
          },
          {
            name: 'children';
            docs: ['indexes into `BookSide::nodes`'];
            type: {
              array: ['u32', 2];
            };
          },
          {
            name: 'childEarliestExpiry';
            docs: [
              'The earliest expiry timestamp for the left and right subtrees.',
              '',
              'Needed to be able to find and remove expired orders without having to',
              'iterate through the whole bookside.',
            ];
            type: {
              array: ['u64', 2];
            };
          },
          {
            name: 'reserved';
            type: {
              array: ['u8', 40];
            };
          },
        ];
      };
    },
    {
      name: 'LeafNode';
      docs: ['LeafNodes represent an order in the binary tree'];
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'tag';
            docs: ['NodeTag'];
            type: 'u8';
          },
          {
            name: 'ownerSlot';
            docs: ["Index into the owning OpenOrdersAccount's OpenOrders"];
            type: 'u8';
          },
          {
            name: 'timeInForce';
            docs: [
              'Time in seconds after `timestamp` at which the order expires.',
              'A value of 0 means no expiry.',
            ];
            type: 'u16';
          },
          {
            name: 'padding';
            type: {
              array: ['u8', 4];
            };
          },
          {
            name: 'key';
            docs: ['The binary tree key, see new_node_key()'];
            type: 'u128';
          },
          {
            name: 'owner';
            docs: ['Address of the owning OpenOrdersAccount'];
            type: 'publicKey';
          },
          {
            name: 'quantity';
            docs: ['Number of base lots to buy or sell, always >=1'];
            type: 'i64';
          },
          {
            name: 'timestamp';
            docs: ['The time the order was placed'];
            type: 'u64';
          },
          {
            name: 'pegLimit';
            docs: [
              'If the effective price of an oracle pegged order exceeds this limit,',
              'it will be considered invalid and may be removed.',
              '',
              'Only applicable in the oracle_pegged OrderTree',
            ];
            type: 'i64';
          },
          {
            name: 'clientOrderId';
            docs: ['User defined id for this order, used in FillEvents'];
            type: 'u64';
          },
        ];
      };
    },
    {
      name: 'AnyNode';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'tag';
            type: 'u8';
          },
          {
            name: 'data';
            type: {
              array: ['u8', 87];
            };
          },
        ];
      };
    },
    {
      name: 'OrderTreeRoot';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'maybeNode';
            type: 'u32';
          },
          {
            name: 'leafCount';
            type: 'u32';
          },
        ];
      };
    },
    {
      name: 'OrderTreeNodes';
      docs: [
        'A binary tree on AnyNode::key()',
        '',
        'The key encodes the price in the top 64 bits.',
      ];
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'orderTreeType';
            type: 'u8';
          },
          {
            name: 'padding';
            type: {
              array: ['u8', 3];
            };
          },
          {
            name: 'bumpIndex';
            type: 'u32';
          },
          {
            name: 'freeListLen';
            type: 'u32';
          },
          {
            name: 'freeListHead';
            type: 'u32';
          },
          {
            name: 'reserved';
            type: {
              array: ['u8', 512];
            };
          },
          {
            name: 'nodes';
            type: {
              array: [
                {
                  defined: 'AnyNode';
                },
                1024,
              ];
            };
          },
        ];
      };
    },
    {
      name: 'I80F48';
      docs: [
        'Nothing in Rust shall use these types. They only exist so that the Anchor IDL',
        'knows about them and typescript can deserialize it.',
      ];
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'val';
            type: 'i128';
          },
        ];
      };
    },
    {
      name: 'PlaceOrderArgs';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'side';
            type: {
              defined: 'Side';
            };
          },
          {
            name: 'priceLots';
            type: 'i64';
          },
          {
            name: 'maxBaseLots';
            type: 'i64';
          },
          {
            name: 'maxQuoteLotsIncludingFees';
            type: 'i64';
          },
          {
            name: 'clientOrderId';
            type: 'u64';
          },
          {
            name: 'orderType';
            type: {
              defined: 'PlaceOrderType';
            };
          },
          {
            name: 'expiryTimestamp';
            type: 'u64';
          },
          {
            name: 'selfTradeBehavior';
            type: {
              defined: 'SelfTradeBehavior';
            };
          },
          {
            name: 'limit';
            type: 'u8';
          },
        ];
      };
    },
    {
      name: 'PlaceMultipleOrdersArgs';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'priceLots';
            type: 'i64';
          },
          {
            name: 'maxQuoteLotsIncludingFees';
            type: 'i64';
          },
          {
            name: 'expiryTimestamp';
            type: 'u64';
          },
        ];
      };
    },
    {
      name: 'PlaceOrderPeggedArgs';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'side';
            type: {
              defined: 'Side';
            };
          },
          {
            name: 'priceOffsetLots';
            type: 'i64';
          },
          {
            name: 'pegLimit';
            type: 'i64';
          },
          {
            name: 'maxBaseLots';
            type: 'i64';
          },
          {
            name: 'maxQuoteLotsIncludingFees';
            type: 'i64';
          },
          {
            name: 'clientOrderId';
            type: 'u64';
          },
          {
            name: 'orderType';
            type: {
              defined: 'PlaceOrderType';
            };
          },
          {
            name: 'expiryTimestamp';
            type: 'u64';
          },
          {
            name: 'selfTradeBehavior';
            type: {
              defined: 'SelfTradeBehavior';
            };
          },
          {
            name: 'limit';
            type: 'u8';
          },
        ];
      };
    },
    {
      name: 'PlaceTakeOrderArgs';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'side';
            type: {
              defined: 'Side';
            };
          },
          {
            name: 'priceLots';
            type: 'i64';
          },
          {
            name: 'maxBaseLots';
            type: 'i64';
          },
          {
            name: 'maxQuoteLotsIncludingFees';
            type: 'i64';
          },
          {
            name: 'orderType';
            type: {
              defined: 'PlaceOrderType';
            };
          },
          {
            name: 'limit';
            type: 'u8';
          },
        ];
      };
    },
    {
      name: 'OracleType';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'Pyth';
          },
          {
            name: 'Stub';
          },
          {
            name: 'SwitchboardV1';
          },
          {
            name: 'SwitchboardV2';
          },
          {
            name: 'RaydiumCLMM';
          },
        ];
      };
    },
    {
      name: 'OrderState';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'Valid';
          },
          {
            name: 'Invalid';
          },
          {
            name: 'Skipped';
          },
        ];
      };
    },
    {
      name: 'BookSideOrderTree';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'Fixed';
          },
          {
            name: 'OraclePegged';
          },
        ];
      };
    },
    {
      name: 'EventType';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'Fill';
          },
          {
            name: 'Out';
          },
        ];
      };
    },
    {
      name: 'NodeTag';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'Uninitialized';
          },
          {
            name: 'InnerNode';
          },
          {
            name: 'LeafNode';
          },
          {
            name: 'FreeNode';
          },
          {
            name: 'LastFreeNode';
          },
        ];
      };
    },
    {
      name: 'PlaceOrderType';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'Limit';
          },
          {
            name: 'ImmediateOrCancel';
          },
          {
            name: 'PostOnly';
          },
          {
            name: 'Market';
          },
          {
            name: 'PostOnlySlide';
          },
        ];
      };
    },
    {
      name: 'PostOrderType';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'Limit';
          },
          {
            name: 'PostOnly';
          },
          {
            name: 'PostOnlySlide';
          },
        ];
      };
    },
    {
      name: 'SelfTradeBehavior';
      docs: [
        'Self trade behavior controls how taker orders interact with resting limit orders of the same account.',
        'This setting has no influence on placing a resting or oracle pegged limit order that does not match',
        "immediately, instead it's the responsibility of the user to correctly configure his taker orders.",
      ];
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'DecrementTake';
          },
          {
            name: 'CancelProvide';
          },
          {
            name: 'AbortTransaction';
          },
        ];
      };
    },
    {
      name: 'Side';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'Bid';
          },
          {
            name: 'Ask';
          },
        ];
      };
    },
    {
      name: 'SideAndOrderTree';
      docs: [
        "SideAndOrderTree is a storage optimization, so we don't need two bytes for the data",
      ];
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'BidFixed';
          },
          {
            name: 'AskFixed';
          },
          {
            name: 'BidOraclePegged';
          },
          {
            name: 'AskOraclePegged';
          },
        ];
      };
    },
    {
      name: 'OrderParams';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'Market';
          },
          {
            name: 'ImmediateOrCancel';
            fields: [
              {
                name: 'price_lots';
                type: 'i64';
              },
            ];
          },
          {
            name: 'Fixed';
            fields: [
              {
                name: 'price_lots';
                type: 'i64';
              },
              {
                name: 'order_type';
                type: {
                  defined: 'PostOrderType';
                };
              },
            ];
          },
          {
            name: 'OraclePegged';
            fields: [
              {
                name: 'price_offset_lots';
                type: 'i64';
              },
              {
                name: 'order_type';
                type: {
                  defined: 'PostOrderType';
                };
              },
              {
                name: 'peg_limit';
                type: 'i64';
              },
            ];
          },
        ];
      };
    },
    {
      name: 'OrderTreeType';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'Bids';
          },
          {
            name: 'Asks';
          },
        ];
      };
    },
  ];
  events: [
    {
      name: 'DepositLog';
      fields: [
        {
          name: 'openOrdersAccount';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'signer';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'baseAmount';
          type: 'u64';
          index: false;
        },
        {
          name: 'quoteAmount';
          type: 'u64';
          index: false;
        },
      ];
    },
    {
      name: 'FillLog';
      fields: [
        {
          name: 'market';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'takerSide';
          type: 'u8';
          index: false;
        },
        {
          name: 'makerSlot';
          type: 'u8';
          index: false;
        },
        {
          name: 'makerOut';
          type: 'bool';
          index: false;
        },
        {
          name: 'timestamp';
          type: 'u64';
          index: false;
        },
        {
          name: 'seqNum';
          type: 'u64';
          index: false;
        },
        {
          name: 'maker';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'makerClientOrderId';
          type: 'u64';
          index: false;
        },
        {
          name: 'makerFee';
          type: 'u64';
          index: false;
        },
        {
          name: 'makerTimestamp';
          type: 'u64';
          index: false;
        },
        {
          name: 'taker';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'takerClientOrderId';
          type: 'u64';
          index: false;
        },
        {
          name: 'takerFeeCeil';
          type: 'u64';
          index: false;
        },
        {
          name: 'price';
          type: 'i64';
          index: false;
        },
        {
          name: 'quantity';
          type: 'i64';
          index: false;
        },
      ];
    },
    {
      name: 'MarketMetaDataLog';
      fields: [
        {
          name: 'market';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'name';
          type: 'string';
          index: false;
        },
        {
          name: 'baseMint';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'quoteMint';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'baseDecimals';
          type: 'u8';
          index: false;
        },
        {
          name: 'quoteDecimals';
          type: 'u8';
          index: false;
        },
        {
          name: 'baseLotSize';
          type: 'i64';
          index: false;
        },
        {
          name: 'quoteLotSize';
          type: 'i64';
          index: false;
        },
      ];
    },
    {
      name: 'TotalOrderFillEvent';
      fields: [
        {
          name: 'side';
          type: 'u8';
          index: false;
        },
        {
          name: 'taker';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'totalQuantityPaid';
          type: 'u64';
          index: false;
        },
        {
          name: 'totalQuantityReceived';
          type: 'u64';
          index: false;
        },
        {
          name: 'fees';
          type: 'u64';
          index: false;
        },
      ];
    },
    {
      name: 'SetDelegateLog';
      fields: [
        {
          name: 'openOrdersAccount';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'delegate';
          type: {
            option: 'publicKey';
          };
          index: false;
        },
      ];
    },
    {
      name: 'SettleFundsLog';
      fields: [
        {
          name: 'openOrdersAccount';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'baseNative';
          type: 'u64';
          index: false;
        },
        {
          name: 'quoteNative';
          type: 'u64';
          index: false;
        },
        {
          name: 'referrerRebate';
          type: 'u64';
          index: false;
        },
        {
          name: 'referrer';
          type: {
            option: 'publicKey';
          };
          index: false;
        },
      ];
    },
    {
      name: 'SweepFeesLog';
      fields: [
        {
          name: 'market';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'amount';
          type: 'u64';
          index: false;
        },
        {
          name: 'receiver';
          type: 'publicKey';
          index: false;
        },
      ];
    },
    {
      name: 'OpenOrdersPositionLog';
      fields: [
        {
          name: 'owner';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'openOrdersAccountNum';
          type: 'u32';
          index: false;
        },
        {
          name: 'market';
          type: 'publicKey';
          index: false;
        },
        {
          name: 'bidsBaseLots';
          type: 'i64';
          index: false;
        },
        {
          name: 'bidsQuoteLots';
          type: 'i64';
          index: false;
        },
        {
          name: 'asksBaseLots';
          type: 'i64';
          index: false;
        },
        {
          name: 'baseFreeNative';
          type: 'u64';
          index: false;
        },
        {
          name: 'quoteFreeNative';
          type: 'u64';
          index: false;
        },
        {
          name: 'lockedMakerFees';
          type: 'u64';
          index: false;
        },
        {
          name: 'referrerRebatesAvailable';
          type: 'u64';
          index: false;
        },
        {
          name: 'makerVolume';
          type: 'u128';
          index: false;
        },
        {
          name: 'takerVolume';
          type: 'u128';
          index: false;
        },
      ];
    },
  ];
  errors: [
    {
      code: 6000;
      name: 'SomeError';
      msg: '';
    },
    {
      code: 6001;
      name: 'InvalidInputNameLength';
      msg: 'Name lenght above limit';
    },
    {
      code: 6002;
      name: 'InvalidInputMarketExpired';
      msg: 'Market cannot be created as expired';
    },
    {
      code: 6003;
      name: 'InvalidInputMarketFees';
      msg: 'Taker fees should be positive and if maker fees are negative, greater or equal to their abs value';
    },
    {
      code: 6004;
      name: 'InvalidInputLots';
      msg: 'Lots cannot be negative';
    },
    {
      code: 6005;
      name: 'InvalidInputLotsSize';
      msg: 'Lots size above market limits';
    },
    {
      code: 6006;
      name: 'InvalidInputOrdersAmounts';
      msg: 'Input amounts above limits';
    },
    {
      code: 6007;
      name: 'InvalidInputCancelSize';
      msg: 'Price lots should be greater than zero';
    },
    {
      code: 6008;
      name: 'InvalidInputPriceLots';
      msg: 'Expected cancel size should be greater than zero';
    },
    {
      code: 6009;
      name: 'InvalidInputPegLimit';
      msg: 'Peg limit should be greater than zero';
    },
    {
      code: 6010;
      name: 'InvalidInputOrderType';
      msg: 'The order type is invalid. A taker order must be Market or ImmediateOrCancel';
    },
    {
      code: 6011;
      name: 'InvalidInputOrderId';
      msg: 'Order id cannot be zero';
    },
    {
      code: 6012;
      name: 'InvalidInputHeapSlots';
      msg: 'Slot above heap limit';
    },
    {
      code: 6013;
      name: 'InvalidOracleTypes';
      msg: 'Cannot combine two oracles of different providers';
    },
    {
      code: 6014;
      name: 'InvalidSecondOracle';
      msg: 'Cannot configure secondary oracle without primary';
    },
    {
      code: 6015;
      name: 'NoCloseMarketAdmin';
      msg: 'This market does not have a `close_market_admin` and thus cannot be closed.';
    },
    {
      code: 6016;
      name: 'InvalidCloseMarketAdmin';
      msg: "The signer of this transaction is not this market's `close_market_admin`.";
    },
    {
      code: 6017;
      name: 'InvalidOpenOrdersAdmin';
      msg: 'The `open_orders_admin` required by this market to sign all instructions that creates orders is missing or is not valid';
    },
    {
      code: 6018;
      name: 'InvalidConsumeEventsAdmin';
      msg: 'The `consume_events_admin` required by this market to sign all instructions that consume events is missing or is not valid';
    },
    {
      code: 6019;
      name: 'InvalidMarketVault';
      msg: 'Provided `market_vault` is invalid';
    },
    {
      code: 6020;
      name: 'IndexerActiveOO';
      msg: 'Cannot be closed due to the existence of open orders accounts';
    },
    {
      code: 6021;
      name: 'OraclePegInvalidOracleState';
      msg: 'Cannot place a peg order due to invalid oracle state';
    },
    {
      code: 6022;
      name: 'UnknownOracleType';
      msg: 'oracle type cannot be determined';
    },
    {
      code: 6023;
      name: 'OracleConfidence';
      msg: 'an oracle does not reach the confidence threshold';
    },
    {
      code: 6024;
      name: 'OracleStale';
      msg: 'an oracle is stale';
    },
    {
      code: 6025;
      name: 'OrderIdNotFound';
      msg: 'Order id not found on the orderbook';
    },
    {
      code: 6026;
      name: 'EventHeapContainsElements';
      msg: "Event heap contains elements and market can't be closed";
    },
    {
      code: 6027;
      name: 'InvalidOrderPostIOC';
      msg: 'ImmediateOrCancel is not a PostOrderType';
    },
    {
      code: 6028;
      name: 'InvalidOrderPostMarket';
      msg: 'Market is not a PostOrderType';
    },
    {
      code: 6029;
      name: 'WouldSelfTrade';
      msg: 'would self trade';
    },
    {
      code: 6030;
      name: 'MarketHasExpired';
      msg: 'The Market has already expired.';
    },
    {
      code: 6031;
      name: 'InvalidPriceLots';
      msg: 'Price lots should be greater than zero';
    },
    {
      code: 6032;
      name: 'InvalidOraclePrice';
      msg: 'Oracle price above market limits';
    },
    {
      code: 6033;
      name: 'MarketHasNotExpired';
      msg: 'The Market has not expired yet.';
    },
    {
      code: 6034;
      name: 'NoOwnerOrDelegate';
      msg: 'No correct owner or delegate.';
    },
    {
      code: 6035;
      name: 'NoOwner';
      msg: 'No correct owner';
    },
    {
      code: 6036;
      name: 'OpenOrdersFull';
      msg: 'No free order index in open orders account';
    },
    {
      code: 6037;
      name: 'BookContainsElements';
      msg: 'Book contains elements';
    },
    {
      code: 6038;
      name: 'OpenOrdersOrderNotFound';
      msg: 'Could not find order in user account';
    },
    {
      code: 6039;
      name: 'InvalidPostAmount';
      msg: 'Amount to post above book limits';
    },
    {
      code: 6040;
      name: 'DisabledOraclePeg';
      msg: 'Oracle peg orders are not enabled for this market';
    },
    {
      code: 6041;
      name: 'NonEmptyMarket';
      msg: 'Cannot close a non-empty market';
    },
    {
      code: 6042;
      name: 'NonEmptyOpenOrdersPosition';
      msg: 'Cannot close a non-empty open orders account';
    },
  ];
}

export const IDL: OpenbookV2 = {
  version: '0.1.0',
  name: 'openbook_v2',
  instructions: [
    {
      name: 'createMarket',
      docs: [
        'Create a [`Market`](crate::state::Market) for a given token pair.',
      ],
      accounts: [
        {
          name: 'market',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'marketAuthority',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'bids',
          isMut: true,
          isSigner: false,
          docs: [
            'Accounts are initialized by client,',
            'anchor discriminator is set first when ix exits,',
          ],
        },
        {
          name: 'asks',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'eventHeap',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'marketBaseVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'marketQuoteVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'baseMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'quoteMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'oracleA',
          isMut: false,
          isSigner: false,
          isOptional: true,
        },
        {
          name: 'oracleB',
          isMut: false,
          isSigner: false,
          isOptional: true,
        },
        {
          name: 'collectFeeAdmin',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'openOrdersAdmin',
          isMut: false,
          isSigner: false,
          isOptional: true,
        },
        {
          name: 'consumeEventsAdmin',
          isMut: false,
          isSigner: false,
          isOptional: true,
        },
        {
          name: 'closeMarketAdmin',
          isMut: false,
          isSigner: false,
          isOptional: true,
        },
        {
          name: 'eventAuthority',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'program',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'name',
          type: 'string',
        },
        {
          name: 'oracleConfig',
          type: {
            defined: 'OracleConfigParams',
          },
        },
        {
          name: 'quoteLotSize',
          type: 'i64',
        },
        {
          name: 'baseLotSize',
          type: 'i64',
        },
        {
          name: 'makerFee',
          type: 'i64',
        },
        {
          name: 'takerFee',
          type: 'i64',
        },
        {
          name: 'timeExpiry',
          type: 'i64',
        },
      ],
    },
    {
      name: 'closeMarket',
      docs: [
        'Close a [`Market`](crate::state::Market) (only',
        '[`close_market_admin`](crate::state::Market::close_market_admin)).',
      ],
      accounts: [
        {
          name: 'closeMarketAdmin',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'market',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'bids',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'asks',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'eventHeap',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'solDestination',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'createOpenOrdersIndexer',
      docs: [
        'Create an [`OpenOrdersIndexer`](crate::state::OpenOrdersIndexer) account.',
      ],
      accounts: [
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'owner',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'openOrdersIndexer',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'closeOpenOrdersIndexer',
      docs: [
        'Close an [`OpenOrdersIndexer`](crate::state::OpenOrdersIndexer) account.',
      ],
      accounts: [
        {
          name: 'owner',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'openOrdersIndexer',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'solDestination',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'createOpenOrdersAccount',
      docs: [
        'Create an [`OpenOrdersAccount`](crate::state::OpenOrdersAccount).',
      ],
      accounts: [
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'owner',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'delegateAccount',
          isMut: false,
          isSigner: false,
          isOptional: true,
        },
        {
          name: 'openOrdersIndexer',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'openOrdersAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'market',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'name',
          type: 'string',
        },
      ],
    },
    {
      name: 'closeOpenOrdersAccount',
      docs: [
        'Close an [`OpenOrdersAccount`](crate::state::OpenOrdersAccount).',
      ],
      accounts: [
        {
          name: 'owner',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'openOrdersIndexer',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'openOrdersAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'solDestination',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'placeOrder',
      docs: [
        'Place an order.',
        '',
        'Different types of orders have different effects on the order book,',
        'as described in [`PlaceOrderType`](crate::state::PlaceOrderType).',
        '',
        '`price_lots` refers to the price in lots: the number of quote lots',
        'per base lot. It is ignored for `PlaceOrderType::Market` orders.',
        '',
        '`expiry_timestamp` is a unix timestamp for when this order should',
        'expire. If 0 is passed in, the order will never expire. If the time',
        'is in the past, the instruction is skipped. Timestamps in the future',
        'are reduced to now + 65,535s.',
        '',
        '`limit` determines the maximum number of orders from the book to fill,',
        'and can be used to limit CU spent. When the limit is reached, processing',
        'stops and the instruction succeeds.',
      ],
      accounts: [
        {
          name: 'signer',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'openOrdersAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'openOrdersAdmin',
          isMut: false,
          isSigner: true,
          isOptional: true,
        },
        {
          name: 'userTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'market',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'bids',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'asks',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'eventHeap',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'marketVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'oracleA',
          isMut: false,
          isSigner: false,
          isOptional: true,
        },
        {
          name: 'oracleB',
          isMut: false,
          isSigner: false,
          isOptional: true,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'args',
          type: {
            defined: 'PlaceOrderArgs',
          },
        },
      ],
      returns: {
        option: 'u128',
      },
    },
    {
      name: 'editOrder',
      docs: ['Edit an order.'],
      accounts: [
        {
          name: 'signer',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'openOrdersAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'openOrdersAdmin',
          isMut: false,
          isSigner: true,
          isOptional: true,
        },
        {
          name: 'userTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'market',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'bids',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'asks',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'eventHeap',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'marketVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'oracleA',
          isMut: false,
          isSigner: false,
          isOptional: true,
        },
        {
          name: 'oracleB',
          isMut: false,
          isSigner: false,
          isOptional: true,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'clientOrderId',
          type: 'u64',
        },
        {
          name: 'expectedCancelSize',
          type: 'i64',
        },
        {
          name: 'placeOrder',
          type: {
            defined: 'PlaceOrderArgs',
          },
        },
      ],
      returns: {
        option: 'u128',
      },
    },
    {
      name: 'editOrderPegged',
      docs: ['Edit an order pegged.'],
      accounts: [
        {
          name: 'signer',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'openOrdersAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'openOrdersAdmin',
          isMut: false,
          isSigner: true,
          isOptional: true,
        },
        {
          name: 'userTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'market',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'bids',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'asks',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'eventHeap',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'marketVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'oracleA',
          isMut: false,
          isSigner: false,
          isOptional: true,
        },
        {
          name: 'oracleB',
          isMut: false,
          isSigner: false,
          isOptional: true,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'clientOrderId',
          type: 'u64',
        },
        {
          name: 'expectedCancelSize',
          type: 'i64',
        },
        {
          name: 'placeOrder',
          type: {
            defined: 'PlaceOrderPeggedArgs',
          },
        },
      ],
      returns: {
        option: 'u128',
      },
    },
    {
      name: 'cancelAllAndPlaceOrders',
      docs: ['Cancel orders and place multiple orders.'],
      accounts: [
        {
          name: 'signer',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'openOrdersAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'openOrdersAdmin',
          isMut: false,
          isSigner: true,
          isOptional: true,
        },
        {
          name: 'userQuoteAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'userBaseAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'market',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'bids',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'asks',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'eventHeap',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'marketQuoteVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'marketBaseVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'oracleA',
          isMut: false,
          isSigner: false,
          isOptional: true,
        },
        {
          name: 'oracleB',
          isMut: false,
          isSigner: false,
          isOptional: true,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'ordersType',
          type: {
            defined: 'PlaceOrderType',
          },
        },
        {
          name: 'bids',
          type: {
            vec: {
              defined: 'PlaceMultipleOrdersArgs',
            },
          },
        },
        {
          name: 'asks',
          type: {
            vec: {
              defined: 'PlaceMultipleOrdersArgs',
            },
          },
        },
        {
          name: 'limit',
          type: 'u8',
        },
      ],
      returns: {
        vec: {
          option: 'u128',
        },
      },
    },
    {
      name: 'placeOrderPegged',
      docs: ['Place an oracle-peg order.'],
      accounts: [
        {
          name: 'signer',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'openOrdersAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'openOrdersAdmin',
          isMut: false,
          isSigner: true,
          isOptional: true,
        },
        {
          name: 'userTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'market',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'bids',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'asks',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'eventHeap',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'marketVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'oracleA',
          isMut: false,
          isSigner: false,
          isOptional: true,
        },
        {
          name: 'oracleB',
          isMut: false,
          isSigner: false,
          isOptional: true,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'args',
          type: {
            defined: 'PlaceOrderPeggedArgs',
          },
        },
      ],
      returns: {
        option: 'u128',
      },
    },
    {
      name: 'placeTakeOrder',
      docs: [
        'Place an order that shall take existing liquidity off of the book, not',
        'add a new order off the book.',
        '',
        'This type of order allows for instant token settlement for the taker.',
      ],
      accounts: [
        {
          name: 'signer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'penaltyPayer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'market',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'marketAuthority',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'bids',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'asks',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'marketBaseVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'marketQuoteVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'eventHeap',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'userBaseAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'userQuoteAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'oracleA',
          isMut: false,
          isSigner: false,
          isOptional: true,
        },
        {
          name: 'oracleB',
          isMut: false,
          isSigner: false,
          isOptional: true,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'openOrdersAdmin',
          isMut: false,
          isSigner: true,
          isOptional: true,
        },
      ],
      args: [
        {
          name: 'args',
          type: {
            defined: 'PlaceTakeOrderArgs',
          },
        },
      ],
    },
    {
      name: 'consumeEvents',
      docs: [
        'Process up to `limit` [events](crate::state::AnyEvent).',
        '',
        "When a user places a 'take' order, they do not know beforehand which",
        "market maker will have placed the 'make' order that they get executed",
        "against. This prevents them from passing in a market maker's",
        '[`OpenOrdersAccount`](crate::state::OpenOrdersAccount), which is needed',
        'to credit/debit the relevant tokens to/from the maker. As such, Openbook',
        "uses a 'crank' system, where `place_order` only emits events, and",
        '`consume_events` handles token settlement.',
        '',
        'Currently, there are two types of events: [`FillEvent`](crate::state::FillEvent)s',
        'and [`OutEvent`](crate::state::OutEvent)s.',
        '',
        'A `FillEvent` is emitted when an order is filled, and it is handled by',
        'debiting whatever the taker is selling from the taker and crediting',
        'it to the maker, and debiting whatever the taker is buying from the',
        'maker and crediting it to the taker. Note that *no tokens are moved*,',
        "these are just debits and credits to each party's [`Position`](crate::state::Position).",
        '',
        'An `OutEvent` is emitted when a limit order needs to be removed from',
        'the book during a `place_order` invocation, and it is handled by',
        'crediting whatever the maker would have sold (quote token in a bid,',
        'base token in an ask) back to the maker.',
      ],
      accounts: [
        {
          name: 'consumeEventsAdmin',
          isMut: false,
          isSigner: true,
          isOptional: true,
        },
        {
          name: 'market',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'eventHeap',
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'limit',
          type: 'u64',
        },
      ],
    },
    {
      name: 'consumeGivenEvents',
      docs: [
        'Process the [events](crate::state::AnyEvent) at the given positions.',
      ],
      accounts: [
        {
          name: 'consumeEventsAdmin',
          isMut: false,
          isSigner: true,
          isOptional: true,
        },
        {
          name: 'market',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'eventHeap',
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'slots',
          type: {
            vec: 'u64',
          },
        },
      ],
    },
    {
      name: 'cancelOrder',
      docs: [
        'Cancel an order by its `order_id`.',
        '',
        "Note that this doesn't emit an [`OutEvent`](crate::state::OutEvent) because a",
        'maker knows that they will be passing in their own [`OpenOrdersAccount`](crate::state::OpenOrdersAccount).',
      ],
      accounts: [
        {
          name: 'signer',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'openOrdersAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'market',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'bids',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'asks',
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'orderId',
          type: 'u128',
        },
      ],
    },
    {
      name: 'cancelOrderByClientOrderId',
      docs: [
        'Cancel an order by its `client_order_id`.',
        '',
        "Note that this doesn't emit an [`OutEvent`](crate::state::OutEvent) because a",
        'maker knows that they will be passing in their own [`OpenOrdersAccount`](crate::state::OpenOrdersAccount).',
      ],
      accounts: [
        {
          name: 'signer',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'openOrdersAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'market',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'bids',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'asks',
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'clientOrderId',
          type: 'u64',
        },
      ],
      returns: 'i64',
    },
    {
      name: 'cancelAllOrders',
      docs: ['Cancel up to `limit` orders, optionally filtering by side'],
      accounts: [
        {
          name: 'signer',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'openOrdersAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'market',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'bids',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'asks',
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'sideOption',
          type: {
            option: {
              defined: 'Side',
            },
          },
        },
        {
          name: 'limit',
          type: 'u8',
        },
      ],
    },
    {
      name: 'deposit',
      docs: [
        "Deposit a certain amount of `base` and `quote` lamports into one's",
        '[`Position`](crate::state::Position).',
        '',
        'Makers might wish to `deposit`, rather than have actual tokens moved for',
        'each trade, in order to reduce CUs.',
      ],
      accounts: [
        {
          name: 'owner',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'userBaseAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'userQuoteAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'openOrdersAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'market',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'marketBaseVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'marketQuoteVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'baseAmount',
          type: 'u64',
        },
        {
          name: 'quoteAmount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'refill',
      docs: [
        'Refill a certain amount of `base` and `quote` lamports. The amount being passed is the',
        'total lamports that the [`Position`](crate::state::Position) will have.',
        '',
        'Makers might wish to `refill`, rather than have actual tokens moved for',
        'each trade, in order to reduce CUs.',
      ],
      accounts: [
        {
          name: 'owner',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'userBaseAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'userQuoteAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'openOrdersAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'market',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'marketBaseVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'marketQuoteVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'baseAmount',
          type: 'u64',
        },
        {
          name: 'quoteAmount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'settleFunds',
      docs: ['Withdraw any available tokens.'],
      accounts: [
        {
          name: 'owner',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'penaltyPayer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'openOrdersAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'market',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'marketAuthority',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'marketBaseVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'marketQuoteVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'userBaseAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'userQuoteAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'referrerAccount',
          isMut: true,
          isSigner: false,
          isOptional: true,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'settleFundsExpired',
      docs: [
        'Withdraw any available tokens when the market is expired (only',
        '[`close_market_admin`](crate::state::Market::close_market_admin)).',
      ],
      accounts: [
        {
          name: 'closeMarketAdmin',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'owner',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'penaltyPayer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'openOrdersAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'market',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'marketAuthority',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'marketBaseVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'marketQuoteVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'userBaseAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'userQuoteAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'referrerAccount',
          isMut: true,
          isSigner: false,
          isOptional: true,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'sweepFees',
      docs: ["Sweep fees, as a [`Market`](crate::state::Market)'s admin."],
      accounts: [
        {
          name: 'collectFeeAdmin',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'market',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'marketAuthority',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'marketQuoteVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenReceiverAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'setDelegate',
      docs: [
        'Update the [`delegate`](crate::state::OpenOrdersAccount::delegate) of an open orders account.',
      ],
      accounts: [
        {
          name: 'owner',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'openOrdersAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'delegateAccount',
          isMut: false,
          isSigner: false,
          isOptional: true,
        },
      ],
      args: [],
    },
    {
      name: 'setMarketExpired',
      docs: [
        'Set market to expired before pruning orders and closing the market (only',
        '[`close_market_admin`](crate::state::Market::close_market_admin)).',
      ],
      accounts: [
        {
          name: 'closeMarketAdmin',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'market',
          isMut: true,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'pruneOrders',
      docs: [
        'Remove orders from the book when the market is expired (only',
        '[`close_market_admin`](crate::state::Market::close_market_admin)).',
      ],
      accounts: [
        {
          name: 'closeMarketAdmin',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'openOrdersAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'market',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'bids',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'asks',
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'limit',
          type: 'u8',
        },
      ],
    },
    {
      name: 'stubOracleCreate',
      accounts: [
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'owner',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'oracle',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'mint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'price',
          type: 'f64',
        },
      ],
    },
    {
      name: 'stubOracleClose',
      accounts: [
        {
          name: 'owner',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'oracle',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'solDestination',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'stubOracleSet',
      accounts: [
        {
          name: 'owner',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'oracle',
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'price',
          type: 'f64',
        },
      ],
    },
  ],
  accounts: [
    {
      name: 'market',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'bump',
            docs: ['PDA bump'],
            type: 'u8',
          },
          {
            name: 'baseDecimals',
            docs: [
              'Number of decimals used for the base token.',
              '',
              "Used to convert the oracle's price into a native/native price.",
            ],
            type: 'u8',
          },
          {
            name: 'quoteDecimals',
            type: 'u8',
          },
          {
            name: 'padding1',
            type: {
              array: ['u8', 5],
            },
          },
          {
            name: 'marketAuthority',
            type: 'publicKey',
          },
          {
            name: 'timeExpiry',
            docs: [
              'No expiry = 0. Market will expire and no trading allowed after time_expiry',
            ],
            type: 'i64',
          },
          {
            name: 'collectFeeAdmin',
            docs: ['Admin who can collect fees from the market'],
            type: 'publicKey',
          },
          {
            name: 'openOrdersAdmin',
            docs: ['Admin who must sign off on all order creations'],
            type: {
              defined: 'NonZeroPubkeyOption',
            },
          },
          {
            name: 'consumeEventsAdmin',
            docs: ['Admin who must sign off on all event consumptions'],
            type: {
              defined: 'NonZeroPubkeyOption',
            },
          },
          {
            name: 'closeMarketAdmin',
            docs: [
              'Admin who can set market expired, prune orders and close the market',
            ],
            type: {
              defined: 'NonZeroPubkeyOption',
            },
          },
          {
            name: 'name',
            docs: ['Name. Trailing zero bytes are ignored.'],
            type: {
              array: ['u8', 16],
            },
          },
          {
            name: 'bids',
            docs: ['Address of the BookSide account for bids'],
            type: 'publicKey',
          },
          {
            name: 'asks',
            docs: ['Address of the BookSide account for asks'],
            type: 'publicKey',
          },
          {
            name: 'eventHeap',
            docs: ['Address of the EventHeap account'],
            type: 'publicKey',
          },
          {
            name: 'oracleA',
            docs: ['Oracles account address'],
            type: {
              defined: 'NonZeroPubkeyOption',
            },
          },
          {
            name: 'oracleB',
            type: {
              defined: 'NonZeroPubkeyOption',
            },
          },
          {
            name: 'oracleConfig',
            docs: ['Oracle configuration'],
            type: {
              defined: 'OracleConfig',
            },
          },
          {
            name: 'quoteLotSize',
            docs: [
              'Number of quote native in a quote lot. Must be a power of 10.',
              '',
              'Primarily useful for increasing the tick size on the market: A lot price',
              'of 1 becomes a native price of quote_lot_size/base_lot_size becomes a',
              'ui price of quote_lot_size*base_decimals/base_lot_size/quote_decimals.',
            ],
            type: 'i64',
          },
          {
            name: 'baseLotSize',
            docs: [
              'Number of base native in a base lot. Must be a power of 10.',
              '',
              'Example: If base decimals for the underlying asset is 6, base lot size',
              'is 100 and and base position lots is 10_000 then base position native is',
              '1_000_000 and base position ui is 1.',
            ],
            type: 'i64',
          },
          {
            name: 'seqNum',
            docs: ['Total number of orders seen'],
            type: 'u64',
          },
          {
            name: 'registrationTime',
            docs: ['Timestamp in seconds that the market was registered at.'],
            type: 'i64',
          },
          {
            name: 'makerFee',
            docs: [
              'Fees',
              '',
              'Fee (in 10^-6) when matching maker orders.',
              'maker_fee < 0 it means some of the taker_fees goes to the maker',
              'maker_fee > 0, it means no taker_fee to the maker, and maker fee goes to the referral',
            ],
            type: 'i64',
          },
          {
            name: 'takerFee',
            docs: ['Fee (in 10^-6) for taker orders, always >= 0.'],
            type: 'i64',
          },
          {
            name: 'feesAccrued',
            docs: ['Total fees accrued in native quote'],
            type: 'u128',
          },
          {
            name: 'feesToReferrers',
            docs: ['Total fees settled in native quote'],
            type: 'u128',
          },
          {
            name: 'referrerRebatesAccrued',
            docs: ['Referrer rebates to be distributed'],
            type: 'u64',
          },
          {
            name: 'feesAvailable',
            docs: ['Fees generated and available to withdraw via sweep_fees'],
            type: 'u64',
          },
          {
            name: 'makerVolume',
            docs: [
              'Cumulative maker volume (same as taker volume) in quote native units',
            ],
            type: 'u128',
          },
          {
            name: 'takerVolumeWoOo',
            docs: [
              'Cumulative taker volume in quote native units due to place take orders',
            ],
            type: 'u128',
          },
          {
            name: 'baseMint',
            type: 'publicKey',
          },
          {
            name: 'quoteMint',
            type: 'publicKey',
          },
          {
            name: 'marketBaseVault',
            type: 'publicKey',
          },
          {
            name: 'baseDepositTotal',
            type: 'u64',
          },
          {
            name: 'marketQuoteVault',
            type: 'publicKey',
          },
          {
            name: 'quoteDepositTotal',
            type: 'u64',
          },
          {
            name: 'reserved',
            type: {
              array: ['u8', 128],
            },
          },
        ],
      },
    },
    {
      name: 'openOrdersAccount',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'owner',
            type: 'publicKey',
          },
          {
            name: 'market',
            type: 'publicKey',
          },
          {
            name: 'name',
            type: {
              array: ['u8', 32],
            },
          },
          {
            name: 'delegate',
            type: {
              defined: 'NonZeroPubkeyOption',
            },
          },
          {
            name: 'accountNum',
            type: 'u32',
          },
          {
            name: 'bump',
            type: 'u8',
          },
          {
            name: 'version',
            type: 'u8',
          },
          {
            name: 'padding',
            type: {
              array: ['u8', 2],
            },
          },
          {
            name: 'position',
            type: {
              defined: 'Position',
            },
          },
          {
            name: 'openOrders',
            type: {
              array: [
                {
                  defined: 'OpenOrder',
                },
                24,
              ],
            },
          },
        ],
      },
    },
    {
      name: 'openOrdersIndexer',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'bump',
            type: 'u8',
          },
          {
            name: 'createdCounter',
            type: 'u32',
          },
          {
            name: 'addresses',
            type: {
              vec: 'publicKey',
            },
          },
        ],
      },
    },
    {
      name: 'stubOracle',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'owner',
            type: 'publicKey',
          },
          {
            name: 'mint',
            type: 'publicKey',
          },
          {
            name: 'price',
            type: 'f64',
          },
          {
            name: 'lastUpdateTs',
            type: 'i64',
          },
          {
            name: 'lastUpdateSlot',
            type: 'u64',
          },
          {
            name: 'deviation',
            type: 'f64',
          },
          {
            name: 'reserved',
            type: {
              array: ['u8', 104],
            },
          },
        ],
      },
    },
    {
      name: 'bookSide',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'roots',
            type: {
              array: [
                {
                  defined: 'OrderTreeRoot',
                },
                2,
              ],
            },
          },
          {
            name: 'reservedRoots',
            type: {
              array: [
                {
                  defined: 'OrderTreeRoot',
                },
                4,
              ],
            },
          },
          {
            name: 'reserved',
            type: {
              array: ['u8', 256],
            },
          },
          {
            name: 'nodes',
            type: {
              defined: 'OrderTreeNodes',
            },
          },
        ],
      },
    },
    {
      name: 'eventHeap',
      docs: [
        'Container for the different EventTypes.',
        '',
        'Events are stored in a fixed-array of nodes. Free nodes are connected by a single-linked list',
        'starting at free_head while used nodes form a circular doubly-linked list starting at',
        'used_head.',
      ],
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'header',
            type: {
              defined: 'EventHeapHeader',
            },
          },
          {
            name: 'nodes',
            type: {
              array: [
                {
                  defined: 'EventNode',
                },
                600,
              ],
            },
          },
          {
            name: 'reserved',
            type: {
              array: ['u8', 64],
            },
          },
        ],
      },
    },
  ],
  types: [
    {
      name: 'NonZeroPubkeyOption',
      docs: [
        'Like `Option`, but implemented for `Pubkey` to be used with `zero_copy`',
      ],
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'key',
            type: 'publicKey',
          },
        ],
      },
    },
    {
      name: 'Position',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'bidsBaseLots',
            docs: ['Base lots in open bids'],
            type: 'i64',
          },
          {
            name: 'asksBaseLots',
            docs: ['Base lots in open asks'],
            type: 'i64',
          },
          {
            name: 'baseFreeNative',
            type: 'u64',
          },
          {
            name: 'quoteFreeNative',
            type: 'u64',
          },
          {
            name: 'lockedMakerFees',
            type: 'u64',
          },
          {
            name: 'referrerRebatesAvailable',
            type: 'u64',
          },
          {
            name: 'penaltyHeapCount',
            docs: [
              'Count of ixs when events are added to the heap',
              'To avoid this, send remaining accounts in order to process the events',
            ],
            type: 'u64',
          },
          {
            name: 'makerVolume',
            docs: [
              'Cumulative maker volume in quote native units (display only)',
            ],
            type: 'u128',
          },
          {
            name: 'takerVolume',
            docs: [
              'Cumulative taker volume in quote native units (display only)',
            ],
            type: 'u128',
          },
          {
            name: 'bidsQuoteLots',
            docs: ['Quote lots in open bids'],
            type: 'i64',
          },
          {
            name: 'reserved',
            type: {
              array: ['u8', 64],
            },
          },
        ],
      },
    },
    {
      name: 'OpenOrder',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'id',
            type: 'u128',
          },
          {
            name: 'clientId',
            type: 'u64',
          },
          {
            name: 'lockedPrice',
            docs: ["Price at which user's assets were locked"],
            type: 'i64',
          },
          {
            name: 'isFree',
            type: 'u8',
          },
          {
            name: 'sideAndTree',
            type: 'u8',
          },
          {
            name: 'padding',
            type: {
              array: ['u8', 6],
            },
          },
        ],
      },
    },
    {
      name: 'OracleConfig',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'confFilter',
            type: 'f64',
          },
          {
            name: 'maxStalenessSlots',
            type: 'i64',
          },
          {
            name: 'reserved',
            type: {
              array: ['u8', 72],
            },
          },
        ],
      },
    },
    {
      name: 'OracleConfigParams',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'confFilter',
            type: 'f32',
          },
          {
            name: 'maxStalenessSlots',
            type: {
              option: 'u32',
            },
          },
        ],
      },
    },
    {
      name: 'EventHeapHeader',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'freeHead',
            type: 'u16',
          },
          {
            name: 'usedHead',
            type: 'u16',
          },
          {
            name: 'count',
            type: 'u16',
          },
          {
            name: 'padd',
            type: 'u16',
          },
          {
            name: 'seqNum',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'EventNode',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'next',
            type: 'u16',
          },
          {
            name: 'prev',
            type: 'u16',
          },
          {
            name: 'pad',
            type: {
              array: ['u8', 4],
            },
          },
          {
            name: 'event',
            type: {
              defined: 'AnyEvent',
            },
          },
        ],
      },
    },
    {
      name: 'AnyEvent',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'eventType',
            type: 'u8',
          },
          {
            name: 'padding',
            type: {
              array: ['u8', 143],
            },
          },
        ],
      },
    },
    {
      name: 'FillEvent',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'eventType',
            type: 'u8',
          },
          {
            name: 'takerSide',
            type: 'u8',
          },
          {
            name: 'makerOut',
            type: 'u8',
          },
          {
            name: 'makerSlot',
            type: 'u8',
          },
          {
            name: 'padding',
            type: {
              array: ['u8', 4],
            },
          },
          {
            name: 'timestamp',
            type: 'u64',
          },
          {
            name: 'seqNum',
            type: 'u64',
          },
          {
            name: 'maker',
            type: 'publicKey',
          },
          {
            name: 'makerTimestamp',
            type: 'u64',
          },
          {
            name: 'taker',
            type: 'publicKey',
          },
          {
            name: 'takerClientOrderId',
            type: 'u64',
          },
          {
            name: 'price',
            type: 'i64',
          },
          {
            name: 'pegLimit',
            type: 'i64',
          },
          {
            name: 'quantity',
            type: 'i64',
          },
          {
            name: 'makerClientOrderId',
            type: 'u64',
          },
          {
            name: 'reserved',
            type: {
              array: ['u8', 8],
            },
          },
        ],
      },
    },
    {
      name: 'OutEvent',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'eventType',
            type: 'u8',
          },
          {
            name: 'side',
            type: 'u8',
          },
          {
            name: 'ownerSlot',
            type: 'u8',
          },
          {
            name: 'padding0',
            type: {
              array: ['u8', 5],
            },
          },
          {
            name: 'timestamp',
            type: 'u64',
          },
          {
            name: 'seqNum',
            type: 'u64',
          },
          {
            name: 'owner',
            type: 'publicKey',
          },
          {
            name: 'quantity',
            type: 'i64',
          },
          {
            name: 'padding1',
            type: {
              array: ['u8', 80],
            },
          },
        ],
      },
    },
    {
      name: 'InnerNode',
      docs: [
        'InnerNodes and LeafNodes compose the binary tree of orders.',
        '',
        'Each InnerNode has exactly two children, which are either InnerNodes themselves,',
        'or LeafNodes. The children share the top `prefix_len` bits of `key`. The left',
        'child has a 0 in the next bit, and the right a 1.',
      ],
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'tag',
            type: 'u8',
          },
          {
            name: 'padding',
            type: {
              array: ['u8', 3],
            },
          },
          {
            name: 'prefixLen',
            docs: [
              'number of highest `key` bits that all children share',
              "e.g. if it's 2, the two highest bits of `key` will be the same on all children",
            ],
            type: 'u32',
          },
          {
            name: 'key',
            docs: ['only the top `prefix_len` bits of `key` are relevant'],
            type: 'u128',
          },
          {
            name: 'children',
            docs: ['indexes into `BookSide::nodes`'],
            type: {
              array: ['u32', 2],
            },
          },
          {
            name: 'childEarliestExpiry',
            docs: [
              'The earliest expiry timestamp for the left and right subtrees.',
              '',
              'Needed to be able to find and remove expired orders without having to',
              'iterate through the whole bookside.',
            ],
            type: {
              array: ['u64', 2],
            },
          },
          {
            name: 'reserved',
            type: {
              array: ['u8', 40],
            },
          },
        ],
      },
    },
    {
      name: 'LeafNode',
      docs: ['LeafNodes represent an order in the binary tree'],
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'tag',
            docs: ['NodeTag'],
            type: 'u8',
          },
          {
            name: 'ownerSlot',
            docs: ["Index into the owning OpenOrdersAccount's OpenOrders"],
            type: 'u8',
          },
          {
            name: 'timeInForce',
            docs: [
              'Time in seconds after `timestamp` at which the order expires.',
              'A value of 0 means no expiry.',
            ],
            type: 'u16',
          },
          {
            name: 'padding',
            type: {
              array: ['u8', 4],
            },
          },
          {
            name: 'key',
            docs: ['The binary tree key, see new_node_key()'],
            type: 'u128',
          },
          {
            name: 'owner',
            docs: ['Address of the owning OpenOrdersAccount'],
            type: 'publicKey',
          },
          {
            name: 'quantity',
            docs: ['Number of base lots to buy or sell, always >=1'],
            type: 'i64',
          },
          {
            name: 'timestamp',
            docs: ['The time the order was placed'],
            type: 'u64',
          },
          {
            name: 'pegLimit',
            docs: [
              'If the effective price of an oracle pegged order exceeds this limit,',
              'it will be considered invalid and may be removed.',
              '',
              'Only applicable in the oracle_pegged OrderTree',
            ],
            type: 'i64',
          },
          {
            name: 'clientOrderId',
            docs: ['User defined id for this order, used in FillEvents'],
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'AnyNode',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'tag',
            type: 'u8',
          },
          {
            name: 'data',
            type: {
              array: ['u8', 87],
            },
          },
        ],
      },
    },
    {
      name: 'OrderTreeRoot',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'maybeNode',
            type: 'u32',
          },
          {
            name: 'leafCount',
            type: 'u32',
          },
        ],
      },
    },
    {
      name: 'OrderTreeNodes',
      docs: [
        'A binary tree on AnyNode::key()',
        '',
        'The key encodes the price in the top 64 bits.',
      ],
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'orderTreeType',
            type: 'u8',
          },
          {
            name: 'padding',
            type: {
              array: ['u8', 3],
            },
          },
          {
            name: 'bumpIndex',
            type: 'u32',
          },
          {
            name: 'freeListLen',
            type: 'u32',
          },
          {
            name: 'freeListHead',
            type: 'u32',
          },
          {
            name: 'reserved',
            type: {
              array: ['u8', 512],
            },
          },
          {
            name: 'nodes',
            type: {
              array: [
                {
                  defined: 'AnyNode',
                },
                1024,
              ],
            },
          },
        ],
      },
    },
    {
      name: 'I80F48',
      docs: [
        'Nothing in Rust shall use these types. They only exist so that the Anchor IDL',
        'knows about them and typescript can deserialize it.',
      ],
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'val',
            type: 'i128',
          },
        ],
      },
    },
    {
      name: 'PlaceOrderArgs',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'side',
            type: {
              defined: 'Side',
            },
          },
          {
            name: 'priceLots',
            type: 'i64',
          },
          {
            name: 'maxBaseLots',
            type: 'i64',
          },
          {
            name: 'maxQuoteLotsIncludingFees',
            type: 'i64',
          },
          {
            name: 'clientOrderId',
            type: 'u64',
          },
          {
            name: 'orderType',
            type: {
              defined: 'PlaceOrderType',
            },
          },
          {
            name: 'expiryTimestamp',
            type: 'u64',
          },
          {
            name: 'selfTradeBehavior',
            type: {
              defined: 'SelfTradeBehavior',
            },
          },
          {
            name: 'limit',
            type: 'u8',
          },
        ],
      },
    },
    {
      name: 'PlaceMultipleOrdersArgs',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'priceLots',
            type: 'i64',
          },
          {
            name: 'maxQuoteLotsIncludingFees',
            type: 'i64',
          },
          {
            name: 'expiryTimestamp',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'PlaceOrderPeggedArgs',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'side',
            type: {
              defined: 'Side',
            },
          },
          {
            name: 'priceOffsetLots',
            type: 'i64',
          },
          {
            name: 'pegLimit',
            type: 'i64',
          },
          {
            name: 'maxBaseLots',
            type: 'i64',
          },
          {
            name: 'maxQuoteLotsIncludingFees',
            type: 'i64',
          },
          {
            name: 'clientOrderId',
            type: 'u64',
          },
          {
            name: 'orderType',
            type: {
              defined: 'PlaceOrderType',
            },
          },
          {
            name: 'expiryTimestamp',
            type: 'u64',
          },
          {
            name: 'selfTradeBehavior',
            type: {
              defined: 'SelfTradeBehavior',
            },
          },
          {
            name: 'limit',
            type: 'u8',
          },
        ],
      },
    },
    {
      name: 'PlaceTakeOrderArgs',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'side',
            type: {
              defined: 'Side',
            },
          },
          {
            name: 'priceLots',
            type: 'i64',
          },
          {
            name: 'maxBaseLots',
            type: 'i64',
          },
          {
            name: 'maxQuoteLotsIncludingFees',
            type: 'i64',
          },
          {
            name: 'orderType',
            type: {
              defined: 'PlaceOrderType',
            },
          },
          {
            name: 'limit',
            type: 'u8',
          },
        ],
      },
    },
    {
      name: 'OracleType',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Pyth',
          },
          {
            name: 'Stub',
          },
          {
            name: 'SwitchboardV1',
          },
          {
            name: 'SwitchboardV2',
          },
          {
            name: 'RaydiumCLMM',
          },
        ],
      },
    },
    {
      name: 'OrderState',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Valid',
          },
          {
            name: 'Invalid',
          },
          {
            name: 'Skipped',
          },
        ],
      },
    },
    {
      name: 'BookSideOrderTree',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Fixed',
          },
          {
            name: 'OraclePegged',
          },
        ],
      },
    },
    {
      name: 'EventType',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Fill',
          },
          {
            name: 'Out',
          },
        ],
      },
    },
    {
      name: 'NodeTag',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Uninitialized',
          },
          {
            name: 'InnerNode',
          },
          {
            name: 'LeafNode',
          },
          {
            name: 'FreeNode',
          },
          {
            name: 'LastFreeNode',
          },
        ],
      },
    },
    {
      name: 'PlaceOrderType',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Limit',
          },
          {
            name: 'ImmediateOrCancel',
          },
          {
            name: 'PostOnly',
          },
          {
            name: 'Market',
          },
          {
            name: 'PostOnlySlide',
          },
        ],
      },
    },
    {
      name: 'PostOrderType',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Limit',
          },
          {
            name: 'PostOnly',
          },
          {
            name: 'PostOnlySlide',
          },
        ],
      },
    },
    {
      name: 'SelfTradeBehavior',
      docs: [
        'Self trade behavior controls how taker orders interact with resting limit orders of the same account.',
        'This setting has no influence on placing a resting or oracle pegged limit order that does not match',
        "immediately, instead it's the responsibility of the user to correctly configure his taker orders.",
      ],
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'DecrementTake',
          },
          {
            name: 'CancelProvide',
          },
          {
            name: 'AbortTransaction',
          },
        ],
      },
    },
    {
      name: 'Side',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Bid',
          },
          {
            name: 'Ask',
          },
        ],
      },
    },
    {
      name: 'SideAndOrderTree',
      docs: [
        "SideAndOrderTree is a storage optimization, so we don't need two bytes for the data",
      ],
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'BidFixed',
          },
          {
            name: 'AskFixed',
          },
          {
            name: 'BidOraclePegged',
          },
          {
            name: 'AskOraclePegged',
          },
        ],
      },
    },
    {
      name: 'OrderParams',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Market',
          },
          {
            name: 'ImmediateOrCancel',
            fields: [
              {
                name: 'price_lots',
                type: 'i64',
              },
            ],
          },
          {
            name: 'Fixed',
            fields: [
              {
                name: 'price_lots',
                type: 'i64',
              },
              {
                name: 'order_type',
                type: {
                  defined: 'PostOrderType',
                },
              },
            ],
          },
          {
            name: 'OraclePegged',
            fields: [
              {
                name: 'price_offset_lots',
                type: 'i64',
              },
              {
                name: 'order_type',
                type: {
                  defined: 'PostOrderType',
                },
              },
              {
                name: 'peg_limit',
                type: 'i64',
              },
            ],
          },
        ],
      },
    },
    {
      name: 'OrderTreeType',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Bids',
          },
          {
            name: 'Asks',
          },
        ],
      },
    },
  ],
  events: [
    {
      name: 'DepositLog',
      fields: [
        {
          name: 'openOrdersAccount',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'signer',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'baseAmount',
          type: 'u64',
          index: false,
        },
        {
          name: 'quoteAmount',
          type: 'u64',
          index: false,
        },
      ],
    },
    {
      name: 'FillLog',
      fields: [
        {
          name: 'market',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'takerSide',
          type: 'u8',
          index: false,
        },
        {
          name: 'makerSlot',
          type: 'u8',
          index: false,
        },
        {
          name: 'makerOut',
          type: 'bool',
          index: false,
        },
        {
          name: 'timestamp',
          type: 'u64',
          index: false,
        },
        {
          name: 'seqNum',
          type: 'u64',
          index: false,
        },
        {
          name: 'maker',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'makerClientOrderId',
          type: 'u64',
          index: false,
        },
        {
          name: 'makerFee',
          type: 'u64',
          index: false,
        },
        {
          name: 'makerTimestamp',
          type: 'u64',
          index: false,
        },
        {
          name: 'taker',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'takerClientOrderId',
          type: 'u64',
          index: false,
        },
        {
          name: 'takerFeeCeil',
          type: 'u64',
          index: false,
        },
        {
          name: 'price',
          type: 'i64',
          index: false,
        },
        {
          name: 'quantity',
          type: 'i64',
          index: false,
        },
      ],
    },
    {
      name: 'MarketMetaDataLog',
      fields: [
        {
          name: 'market',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'name',
          type: 'string',
          index: false,
        },
        {
          name: 'baseMint',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'quoteMint',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'baseDecimals',
          type: 'u8',
          index: false,
        },
        {
          name: 'quoteDecimals',
          type: 'u8',
          index: false,
        },
        {
          name: 'baseLotSize',
          type: 'i64',
          index: false,
        },
        {
          name: 'quoteLotSize',
          type: 'i64',
          index: false,
        },
      ],
    },
    {
      name: 'TotalOrderFillEvent',
      fields: [
        {
          name: 'side',
          type: 'u8',
          index: false,
        },
        {
          name: 'taker',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'totalQuantityPaid',
          type: 'u64',
          index: false,
        },
        {
          name: 'totalQuantityReceived',
          type: 'u64',
          index: false,
        },
        {
          name: 'fees',
          type: 'u64',
          index: false,
        },
      ],
    },
    {
      name: 'SetDelegateLog',
      fields: [
        {
          name: 'openOrdersAccount',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'delegate',
          type: {
            option: 'publicKey',
          },
          index: false,
        },
      ],
    },
    {
      name: 'SettleFundsLog',
      fields: [
        {
          name: 'openOrdersAccount',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'baseNative',
          type: 'u64',
          index: false,
        },
        {
          name: 'quoteNative',
          type: 'u64',
          index: false,
        },
        {
          name: 'referrerRebate',
          type: 'u64',
          index: false,
        },
        {
          name: 'referrer',
          type: {
            option: 'publicKey',
          },
          index: false,
        },
      ],
    },
    {
      name: 'SweepFeesLog',
      fields: [
        {
          name: 'market',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'amount',
          type: 'u64',
          index: false,
        },
        {
          name: 'receiver',
          type: 'publicKey',
          index: false,
        },
      ],
    },
    {
      name: 'OpenOrdersPositionLog',
      fields: [
        {
          name: 'owner',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'openOrdersAccountNum',
          type: 'u32',
          index: false,
        },
        {
          name: 'market',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'bidsBaseLots',
          type: 'i64',
          index: false,
        },
        {
          name: 'bidsQuoteLots',
          type: 'i64',
          index: false,
        },
        {
          name: 'asksBaseLots',
          type: 'i64',
          index: false,
        },
        {
          name: 'baseFreeNative',
          type: 'u64',
          index: false,
        },
        {
          name: 'quoteFreeNative',
          type: 'u64',
          index: false,
        },
        {
          name: 'lockedMakerFees',
          type: 'u64',
          index: false,
        },
        {
          name: 'referrerRebatesAvailable',
          type: 'u64',
          index: false,
        },
        {
          name: 'makerVolume',
          type: 'u128',
          index: false,
        },
        {
          name: 'takerVolume',
          type: 'u128',
          index: false,
        },
      ],
    },
  ],
  errors: [
    {
      code: 6000,
      name: 'SomeError',
      msg: '',
    },
    {
      code: 6001,
      name: 'InvalidInputNameLength',
      msg: 'Name lenght above limit',
    },
    {
      code: 6002,
      name: 'InvalidInputMarketExpired',
      msg: 'Market cannot be created as expired',
    },
    {
      code: 6003,
      name: 'InvalidInputMarketFees',
      msg: 'Taker fees should be positive and if maker fees are negative, greater or equal to their abs value',
    },
    {
      code: 6004,
      name: 'InvalidInputLots',
      msg: 'Lots cannot be negative',
    },
    {
      code: 6005,
      name: 'InvalidInputLotsSize',
      msg: 'Lots size above market limits',
    },
    {
      code: 6006,
      name: 'InvalidInputOrdersAmounts',
      msg: 'Input amounts above limits',
    },
    {
      code: 6007,
      name: 'InvalidInputCancelSize',
      msg: 'Price lots should be greater than zero',
    },
    {
      code: 6008,
      name: 'InvalidInputPriceLots',
      msg: 'Expected cancel size should be greater than zero',
    },
    {
      code: 6009,
      name: 'InvalidInputPegLimit',
      msg: 'Peg limit should be greater than zero',
    },
    {
      code: 6010,
      name: 'InvalidInputOrderType',
      msg: 'The order type is invalid. A taker order must be Market or ImmediateOrCancel',
    },
    {
      code: 6011,
      name: 'InvalidInputOrderId',
      msg: 'Order id cannot be zero',
    },
    {
      code: 6012,
      name: 'InvalidInputHeapSlots',
      msg: 'Slot above heap limit',
    },
    {
      code: 6013,
      name: 'InvalidOracleTypes',
      msg: 'Cannot combine two oracles of different providers',
    },
    {
      code: 6014,
      name: 'InvalidSecondOracle',
      msg: 'Cannot configure secondary oracle without primary',
    },
    {
      code: 6015,
      name: 'NoCloseMarketAdmin',
      msg: 'This market does not have a `close_market_admin` and thus cannot be closed.',
    },
    {
      code: 6016,
      name: 'InvalidCloseMarketAdmin',
      msg: "The signer of this transaction is not this market's `close_market_admin`.",
    },
    {
      code: 6017,
      name: 'InvalidOpenOrdersAdmin',
      msg: 'The `open_orders_admin` required by this market to sign all instructions that creates orders is missing or is not valid',
    },
    {
      code: 6018,
      name: 'InvalidConsumeEventsAdmin',
      msg: 'The `consume_events_admin` required by this market to sign all instructions that consume events is missing or is not valid',
    },
    {
      code: 6019,
      name: 'InvalidMarketVault',
      msg: 'Provided `market_vault` is invalid',
    },
    {
      code: 6020,
      name: 'IndexerActiveOO',
      msg: 'Cannot be closed due to the existence of open orders accounts',
    },
    {
      code: 6021,
      name: 'OraclePegInvalidOracleState',
      msg: 'Cannot place a peg order due to invalid oracle state',
    },
    {
      code: 6022,
      name: 'UnknownOracleType',
      msg: 'oracle type cannot be determined',
    },
    {
      code: 6023,
      name: 'OracleConfidence',
      msg: 'an oracle does not reach the confidence threshold',
    },
    {
      code: 6024,
      name: 'OracleStale',
      msg: 'an oracle is stale',
    },
    {
      code: 6025,
      name: 'OrderIdNotFound',
      msg: 'Order id not found on the orderbook',
    },
    {
      code: 6026,
      name: 'EventHeapContainsElements',
      msg: "Event heap contains elements and market can't be closed",
    },
    {
      code: 6027,
      name: 'InvalidOrderPostIOC',
      msg: 'ImmediateOrCancel is not a PostOrderType',
    },
    {
      code: 6028,
      name: 'InvalidOrderPostMarket',
      msg: 'Market is not a PostOrderType',
    },
    {
      code: 6029,
      name: 'WouldSelfTrade',
      msg: 'would self trade',
    },
    {
      code: 6030,
      name: 'MarketHasExpired',
      msg: 'The Market has already expired.',
    },
    {
      code: 6031,
      name: 'InvalidPriceLots',
      msg: 'Price lots should be greater than zero',
    },
    {
      code: 6032,
      name: 'InvalidOraclePrice',
      msg: 'Oracle price above market limits',
    },
    {
      code: 6033,
      name: 'MarketHasNotExpired',
      msg: 'The Market has not expired yet.',
    },
    {
      code: 6034,
      name: 'NoOwnerOrDelegate',
      msg: 'No correct owner or delegate.',
    },
    {
      code: 6035,
      name: 'NoOwner',
      msg: 'No correct owner',
    },
    {
      code: 6036,
      name: 'OpenOrdersFull',
      msg: 'No free order index in open orders account',
    },
    {
      code: 6037,
      name: 'BookContainsElements',
      msg: 'Book contains elements',
    },
    {
      code: 6038,
      name: 'OpenOrdersOrderNotFound',
      msg: 'Could not find order in user account',
    },
    {
      code: 6039,
      name: 'InvalidPostAmount',
      msg: 'Amount to post above book limits',
    },
    {
      code: 6040,
      name: 'DisabledOraclePeg',
      msg: 'Oracle peg orders are not enabled for this market',
    },
    {
      code: 6041,
      name: 'NonEmptyMarket',
      msg: 'Cannot close a non-empty market',
    },
    {
      code: 6042,
      name: 'NonEmptyOpenOrdersPosition',
      msg: 'Cannot close a non-empty open orders account',
    },
  ],
};
