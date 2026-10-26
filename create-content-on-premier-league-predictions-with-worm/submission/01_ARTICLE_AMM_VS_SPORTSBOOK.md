# Why Web3 Prediction Markets Make Traditional Sportsbooks Obsolete: The worm Architecture

**Author: Alex Rayyan**

---

# Why Web3 Prediction Markets Make Traditional Sportsbooks Obsolete: The worm Architecture

---

## The Hidden Tax of Web2 Sportsbooks: The 6–11% Overround and Guaranteed Bookmaker Profit

Every odds line on a traditional sportsbook carries a concealed charge. It is not listed on any receipt. It does not appear in any terms-of-service clause. But it is there, embedded in every market, extracted from every bettor, every time.

It is called the **overround**, commonly referred to as the **vig** or **juice**, and it represents the single most consequential structural disadvantage that retail bettors face in any wagering environment.

To understand the mechanism, consider a hypothetical Premier League match between Arsenal and Fulham. In a fair market with no house edge, the implied probabilities of each outcome would sum to exactly 100%:

- Arsenal wins: 60% implied probability → fair odds of 1.67
- Draw: 22% implied probability → fair odds of 4.55
- Fulham wins: 18% implied probability → fair odds of 5.56

Add those probabilities: 60 + 22 + 18 = 100. No edge for anyone.

Now examine what a typical sportsbook actually offers. After applying its overround, the same market might be priced as:

- Arsenal wins: 55% implied probability → odds of 1.82
- Draw: 20% implied probability → odds of 5.00
- Fulham wins: 16% implied probability → odds of 6.25

Add the implied probabilities: 55 + 20 + 16 = **91%**. The sportsbook has built in a **9% overround** on this market.

This means that regardless of which outcome materializes, the sportsbook collects 9% of total wagers as guaranteed margin. It does not need to be right. It does not need to manage risk with sophisticated hedging. It simply needs volume. The overround is a mathematical certainty extracted before a single whistle blows.

Across the industry, overround percentages typically range from **6% to 11%** depending on the sport, the market liquidity, and the bookmaker's pricing model. High-profile markets like Premier League matches tend to cluster toward the lower end as books compete on margin, while niche markets, live betting, and less-regulated platforms routinely push toward the upper bound.

The compounding effect over time is severe. A bettor who places 500 wagers per year with an average overround of 8% faces a structural expected return of **negative 8% on turnover**, before accounting for any analysis skill, information advantage, or market selection. The sportsbook does not need to beat the bettor. The math beats the bettor. The bookmaker is not in the business of predicting outcomes. It is in the business of collecting the vig.

Additional friction layers compound the problem. Traditional sportsbooks impose deposit and withdrawal fees, impose minimum bet requirements, restrict or limit successful accounts, and operate on proprietary platforms with no portability of capital or history. The bettor's funds are custodial, the odds are opaque, and the counterparty risk is the bookmaker itself.

This is the baseline against which every alternative must be measured.

---

## The worm Solution: Peer-to-Peer Liquidity on Solana with 0.5–1.0% LP Frictional Fees

worm is a decentralized prediction market protocol built on Solana that restructures the fundamental relationship between bettors, liquidity, and market pricing. Rather than a bookmaker setting odds and absorbing the overround as margin, worm operates as a **peer-to-peer trading infrastructure** where participants interact directly through automated market-making mechanisms, and liquidity providers supply capital to facilitate trades in exchange for a defined fee schedule.

The architectural departure is fundamental. In a traditional sportsbook, the bookmaker is the counterparty to every bet. It sets prices, manages its own risk book, and pockets the spread. In worm's model, there is no bookmaker. There is a **liquidity pool** supplied by independent LPs, and traders buy and sell outcome tokens against that pool at prices determined by a **constant-product automated market maker (AMM)** formula.

The fee structure reflects this difference. When a trader executes a position on worm, they pay a **liquidity provider fee** of between **0.5% and 1.0%** of the trade value, depending on the specific market and pool configuration. This fee is distributed to the liquidity providers who have staked capital into the relevant market pool. It is not revenue for a proprietary trading desk. It is compensation for providing on-demand liquidity to the market.

Compare this directly to the sportsbook overround:

| Cost Component | Traditional Sportsbook | worm Protocol |
|---|---|---|
| Embedded margin (overround) | 6–11% per market | None |
| Trade execution fee | Built into vig | 0.5–1.0% per transaction |
| Counterparty risk | Bookmaker (custodial) | Smart contract (non-custodial) |
| Odds transparency | Opaque, set by house | Deterministic, AMM-derived |
| Capital portability | None | Full self-custody |
| Account restrictions | Common (limits, bans) | None |

The fee differential is not marginal. It is an order-of-magnitude improvement. Where a sportsbook extracts 6–11% of every wager as structural margin before the event begins, worm extracts 0.5–1.0% only when a trade is executed, and that fee flows to liquidity providers rather than a house account.

Solana's execution layer is architecturally relevant here. Average transaction finality on Solana operates in the range of 400–600 milliseconds for standard transactions, with block times of approximately 400ms. This means that a user placing a position on a Premier League market, receiving a transaction confirmation, and observing their updated portfolio state completes within a timeframe that is functionally instantaneous for a prediction market use case. Gas fees on Solana are typically measured in fractions of a cent, removing the economic friction that makes small-position trading impractical on higher-fee networks.

The smart contract layer governing worm's markets defines the market parameters, manages the AMM pricing logic, interfaces with the oracle feed for settlement, and executes automated payouts upon resolution. The contracts are non-custodial: a user retains full control of their collateral at all times. There is no account freeze risk, no withdrawal limit, and no proprietary restriction on position sizing.

---

## Step-by-Step User Journey: From Wallet Connection to Oracle Settlement Payout

This section walks through the complete lifecycle of a Premier League prediction position on worm, from initial wallet connection through final settlement redemption. Each step is described in operational detail.

### Step 1: Wallet Connection and Interface Access

The user navigates to the worm application interface and initiates a session by connecting a compatible Solana wallet. worm supports standard Solana wallet standards, including Phantom, Backpack, Solflare, and other wallets conforming to the Wallet Standard. The connection is established via the wallet's browser extension or mobile integration, requiring the user to approve a signing request to authenticate their session.

No account registration is required. No KYC documentation is collected. No email address, username, or password is created. The wallet address serves as the user's identity within the protocol. This is a meaningful distinction from sportsbooks, which typically require identity verification, impose geographic restrictions, and maintain centralized user databases.

Upon connection, the interface displays the user's associated wallet balance and any existing positions held in the protocol. The user is immediately ready to interact with any available market.

### Step 2: Depositing Collateral (USDC)

worm uses **USDC** as the sole collateral token for Premier League prediction markets. USDC is a fiat-collateralized stablecoin issued by Circle, redeemable 1:1 for US dollars, and widely integrated across Solana DeFi infrastructure.

To fund a position, the user deposits USDC into the worm protocol. This is executed as a token transfer from the user's wallet to the relevant worm market pool. The transaction is confirmed on Solana within seconds, and the user's available balance within the protocol updates accordingly.

For users who do not hold USDC, the on-ramp path on Solana is straightforward. Most Solana-native exchanges and bridges allow direct purchase of USDC using fiat rails, and the Solana ecosystem supports integration with third-party fiat-on-ramp providers that can convert bank transfers or card payments directly into USDC within the wallet environment.

The user's USDC remains in their wallet and is only committed to a market pool when a trade is executed. There is no minimum deposit requirement imposed by the protocol.

### Step 3: Navigating and Selecting a Premier League Market

The worm interface presents a list of active and upcoming Premier League prediction markets. Each market entry displays the match, the market type, and current pricing.

For a standard three-outcome match market (Home Win / Draw / Away Win), the interface shows the current AMM-derived odds for each outcome. These odds are expressed as decimal prices and are updated continuously as traders buy and sell positions in the pool.

For example, a market for Manchester City versus Liverpool might display:

- Manchester City Win: 2.40
- Draw: 3.50
- Liverpool Win: 2.90

These prices are not set by the protocol. They are the result of the AMM's constant-product formula responding to the current volume and direction of trading activity in the pool. If a large volume of traders buy Manchester City outcome tokens, the AMM adjusts the price upward for that outcome and downward for the others, reflecting the market's collective assessment of probabilities.

The user can review the market, assess the pricing, and decide which outcome to back.

### Step 4: Buying Outcome Tokens

The user selects an outcome and specifies a stake amount in USDC. The interface calculates the cost of the position and displays the potential payout at the current AMM price.

When the user confirms the trade, the protocol executes the following operations in a single atomic transaction:

1. The user's USDC stake is transferred from their wallet balance into the relevant outcome token pool.
2. The AMM executes the trade, updating the pool's token balances and recalibrating the price for all outcomes in that market.
3. The user receives outcome tokens corresponding to their selected position. These tokens represent a claim on the payout pool for their chosen outcome if that outcome resolves as the winner.

The user now holds a position in the market. The outcome tokens are visible in their wallet and in the worm interface portfolio view. The position is fully self-custodied. The user can hold it, transfer it, or close it by selling back to the AMM pool at any time prior to market resolution, subject only to the prevailing AMM price at the time of sale.

This is a critical distinction from sportsbook bets, which are typically locked in upon placement. On worm, a position is a **tradeable asset**, not a wager with an immutable payout schedule.

### Step 5: Monitoring the Position

Between placement and resolution, the user can monitor their position through the