# Decentralized Prediction Markets vs. Legacy Bookmakers: A Structural and Mathematical Analysis

**Author:** Alex Rayyan, Quantitative DeFi Analyst

---

## 1. The Vig (Overround) Problem

A legacy bookmaker prices a binary event with decimal odds \(o_1, o_2\). The implied probabilities are

\[
p_i = \frac{1}{o_i}.
\]

The overround (structural margin) is

\[
O = \sum_i p_i - 1.
\]

For a fair two-outcome market, \(O = 0\). Bookmakers enforce \(O \in [0.05, 0.11]\) (5–11%). The bettor's expected value under true probability \(q\) is

\[
EV_{\text{book}} = q \cdot (o_{\text{win}} - 1) - (1-q) \cdot 1,
\]

but because \(o_i = \frac{1}{p_i}\) with \(p_i > q_i\) in aggregate, the house edge is embedded in \(O\). For a symmetric market with \(O = 0.0526\) (odds 1.90/1.90):

\[
p_{\text{impl}} = 0.5263,\quad EV_{\text{fair}} = 0.5 \cdot 1.90 - 0.5 \cdot 1 = -0.05.
\]

Thus a 50/50 true proposition yields \(-5\%\) EV per unit staked.

A peer-to-peer AMM (e.g., LMSR or constant-product) prices outcomes at \(p \in (0,1)\) with \(p + (1-p) = 1\) by construction. The only extraction is an explicit fee \(\tau\) on notional or winnings:

\[
EV_{\text{amm}} = q \cdot \left(\frac{1}{p} - 1\right)(1-\tau) - (1-q) \cdot 1.
\]

If \(\tau = 0.02\) and \(p = q = 0.5\):

\[
EV_{\text{amm}} = 0.5 \cdot 1 \cdot 0.98 - 0.5 = -0.01.
\]

**Structural conclusion:** The bookmaker's margin is a hidden, non-negotiable tax on probability space; the AMM's fee is explicit and typically an order of magnitude smaller.

---

## 2. Custodial vs Non-Custodial Counterparty Risk

### Legacy Bookmaker
Funds are custodied by the house. Let \(D\) be deposit, \(\delta\) probability of insolvency before settlement, and \(R\) recovery rate. Expected counterparty loss:

\[
L_{\text{book}} = \delta \cdot D \cdot (1-R).
\]

Additionally, the house may freeze or restrict withdrawals, introducing path-dependent liquidity risk not captured by \(\delta\) alone.

### Decentralized Prediction Market
Collateral is locked in a smart contract. Risk factors:

- Smart contract exploit probability \(\epsilon\)
- Oracle failure probability \(\eta\)
- Bridge/asset depeg probability \(\rho\)

Expected loss:

\[
L_{\text{defi}} = D \cdot \left[1 - (1-\epsilon)(1-\eta)(1-\rho)\right].
\]

For mature venues (audited contracts, decentralized oracles, native collateral), \(\epsilon, \eta, \rho \ll \delta\) in practice, and settlement is atomic: no fractional reserve, no rehypothecation of user funds.

**Key asymmetry:** The bookmaker's solvency is opaque and correlated with its own book; the DeFi contract's solvency is verifiable on-chain and collateralized 1:1.

---

## 3. Oracle Settlement Determinism vs Arbitrary House Voiding

### House Voiding
A bookmaker may void bets under "obvious error," "palpable mistake," or "integrity" clauses. Let \(\nu\) be void probability. A voided winning bet forfeits upside; a voided losing bet refunds stake. Expected value adjustment:

\[
EV_{\text{void}} = (1-\nu) \cdot EV_{\text{raw}} + \nu \cdot 0.
\]

Even small \(\nu\) destroys edge: if a bettor has \(+2\%\) EV and \(\nu = 0.01\), post-void EV \(\approx 1.98\%\), but variance increases and the bettor cannot arbitrage the void policy.

### Oracle Determinism
Settlement is triggered by an on-chain oracle (e.g., UMA, Chainlink) resolving to a canonical data point. Let resolution time \(T\), dispute window \(\Delta\), and finality probability \(F\). Expected settlement value:

\[
EV_{\text{oracle}} = F \cdot EV_{\text{raw}} + (1-F) \cdot EV_{\text{dispute}}.
\]

In well-designed markets, \(F \approx 1\) after \(\Delta\), and disputes are economically penalized via slashing, making manipulation