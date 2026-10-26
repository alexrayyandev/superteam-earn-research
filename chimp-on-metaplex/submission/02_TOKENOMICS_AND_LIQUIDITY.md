# $CHIMP Tokenomics & Market Microstructure Whitepaper
## Quantitative Formalization of a Fixed-Supply, Fully-Liquid Fair Launch

**Author: Alex Rayyan (Lead Systems Architect & Security Researcher)**  
**Contact: bansoslab2026@tutamail.com**  
**Solana Payout Wallet: 39YTqgacjKt1iz22SrvX4G3Ds8TUUjd9hWPPSJpdd2jZ**  
**Base EVM USDC Wallet: 0xf71e0734cb53162e8c9baaf5f49841a51c945899**  

---

### Abstract
This whitepaper provides the formal mathematical and economic architecture for the $CHIMP fair launch deployed on Solana. By coupling the SPL Token standard with Metaplex metadata and Raydium Constant Product Market Maker (CPMM) pools, $CHIMP eliminates the systemic agency risks inherent in venture-backed, low-float token offerings. We derive the pricing invariants, slippage dynamics, liquidity lock guarantees, and on-chain verification proofs governing the asset.

---

### 1. Token Supply & Distribution Architecture

The primary design principle of $CHIMP is zero unbacked issuance and zero insider pre-allocation.

| Parameter | Specification | Invariant / Constraint |
|---|---|---|
| Total Initial Supply | 1,000,000,000 $CHIMP | S_total = 10^9 x 10^9 raw units |
| Decimals | 9 | SPL standard precision |
| Team / Founder Allocation | 0% (0 tokens) | No cliff, no vesting schedule |
| Private / Seed Allocation | 0% (0 tokens) | No discounted insider cost basis |
| Public Liquidity Pool | 100% (1,000,000,000 tokens) | Deposited at Genesis to Raydium CPMM |
| Mint Authority | Renounced (NULL) | Irreversible state change |
| Freeze Authority | Disabled (NULL) | Censorship-resistant transfer |

#### 1.1 Structural Comparison Against Predatory Tokenomics
Traditional Web3 token models engineer an artificial float scarcity, inflating Fully Diluted Valuation (FDV) while dumping tokens onto secondary market buyers via vesting cliffs:

```
Low-Float Model:  [ 5-10% Circulating ] ---> [ 90-95% Locked Insider Debt ]
                                               └── 12-36 Month Unlock Pressure

$CHIMP Model:     [ 100% Circulating ]  ---> [ 0% Dilution Forever ]
                                               └── Circulating Market Cap == FDV
```

---

### 2. Market Microstructure: Raydium CPMM Invariant

$CHIMP liquidity is paired with SOL on a Raydium Constant Product Market Maker obeying the invariant:

x * y = k

Where:
- x = Reserve balance of $CHIMP tokens in the pool
- y = Reserve balance of SOL in the pool
- k = Invariant constant product

#### 2.1 Spot Price Derivation
The marginal spot price of $CHIMP denominated in SOL (P_spot) at any point along the bonding curve is defined as the marginal exchange rate:

P_spot = dy/dx = y/x

#### 2.2 Execution Price & Slippage Dynamics
For an incoming swap buying Δx tokens by depositing Δy SOL into the pool:

(x - Δx)(y + Δy) = k

Solving for output tokens Δx:

Δx = x - k/(y + Δy) = (x * Δy)/(y + Δy)

The effective execution price P_bar paid by the trader is:

P_bar = Δy / Δx = (y + Δy) / x

The marginal price impact (slippage) percentage θ relative to the spot price prior to execution is strictly proportional to trade size relative to pool depth:

θ = (P_bar - P_spot) / P_spot = Δy / y

This linear relationship proves that pool depth (y) is the sole determinant of execution efficiency, with larger initial pool seedings directly protecting retail market participants from predatory sandwich attacks.

---

### 3. Anti-MEV & Anti-Sniper Guards (Metaplex Candy Guard)

To prevent priority-fee MEV bots from capturing 100% of the initial bonding curve delta, Metaplex Candy Guard parameters are enforced at the runtime level:

1. bot_tax Parameter: Any transaction failing guard validation (e.g. attempting to mint before start_date or exceeding mint_limit) is charged a non-refundable penalty fee (e.g. 0.01 SOL). This shifts the expected value of speculative bot spamming from positive to deeply negative.
2. start_date Timestamp Gate: Enforces atomic activation verified against the Solana Sysvar Clock (sysvar::clock), ensuring zero block-zero frontrunning.
3. mint_limit Gate: Restricts transaction volume per wallet address, guaranteeing distributed decentralization across a broad holder base.

---

### 4. Mathematical Formalization of Liquidity Lock

A critical failure mode in decentralized token launches is liquidity pool removal ("rug pull"). $CHIMP eliminates this attack surface through an on-chain LP token burn.

Upon pool seeding, the Raydium liquidity program mints LP tokens representing proportional ownership of (x, y):

LP_shares = sqrt(x_0 * y_0)

The deployer executes an atomic SPL Burn instruction:

spl_token::instruction::burn(LP_mint, LP_account, deployer_key, LP_shares)

Following this instruction:
- Supply(LP_mint) == 0
- No cryptographic private key exists capable of calling WithdrawLiquidity
- Reserves x and y are locked permanently inside the Solana Raydium program account

---

### 5. Conclusion & Verification Summary

The $CHIMP fair launch model replaces corporate promises with immutable Solana bytecode:
1. P_FDV == P_MarketCap (Zero unvested supply).
2. Delta Supply == 0 (Renounced mint authority).
3. Liquidity_withdrawable == 0 (Burned LP tokens).

All parameters are independently auditable via standard RPC queries and block explorers.
