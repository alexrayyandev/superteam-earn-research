# Technical & Quantitative Appendix: worm Prediction Market Architecture

**Author: Alex Rayyan**

---

We need answer user. Need write quantitative & smart contract appendix for worm prediction markets. Need include mathematical derivation LMSR cost/price, constant product binary outcome pricing and dynamic volatility fee formula, smart contract architecture on Solana Anchor program layout, market accounts, oracle settlement. Need be technical. Need maybe "worm" is protocol name. Need produce appendix. Need no emojis. Need maybe mention "Worm" as prediction market protocol. Need derive LMSR: cost function C(q)=b ln sum exp(q_i/b). Price p_i = exp(q_i/b)/sum exp(q_j/b). Need show marginal cost. Need maybe derive from market maker? Need include derivation from scoring rule? Let's craft.

Need constant product binary outcome pricing x*y=k. For binary outcome shares: outcome A shares x, outcome B shares y. Invariant x*y=k. Price of A in terms of B? Need derive. If user buys A with B, pool decreases B? Actually x*y=k. Let x = shares of A, y = shares of B. Price of A in units of B = y/x? Need careful. For constant product AMM, price of token A in terms of token B = y/x. But for binary outcome, shares are complementary? Need define. If outcome A shares and B shares, after resolution one side worthless, other side redeem 1 USDC? Need maybe use constant product market maker for binary event: pool has two tokens, YES and NO. Invariant YES*NO = k. Price of YES in NO = NO/YES. But if YES and NO are both priced relative to numeraire? Need derive dynamic volatility fee formula. Need maybe use "dynamic volatility fee" based on implied volatility from price? Need formulate.

Need smart contract architecture on Solana Anchor: program layout, market accounts, oracle settlement. Need include Rust structs, account discriminators, PDAs, instructions. Need maybe "Worm" protocol. Need mention Anchor version, Solana. Need design.

Let's parse user request: "Write the quantitative & smart contract appendix for worm." They likely want appendix for "Worm prediction markets" with math and smart contracts. Need produce comprehensive.

Need include:
1. Mathematical derivation of Hanson's LMSR cost function and price formula.
2. Constant Product (x*y=k) binary outcome pricing and dynamic volatility fee formula.
3. Smart contract architecture on Solana (Anchor program layout, market accounts, oracle settlement).

Need maybe include "appendix" heading. Need maybe "Worm" is the protocol. Need maybe "Worm" not "worm" as in "Worm prediction markets" maybe "Worm" is a prediction market protocol. Need write.

Let's structure:

# Appendix A: Quantitative Foundations

## A.1 Hanson's LMSR

Define state vector q = (q_1,...,q_n) where q_i is number of outstanding shares for outcome i. Market maker's cost function:
C(q) = b ln Σ_i exp(q_i / b)
where b is liquidity parameter.

Properties:
- C(0)=b ln n.
- To buy δ shares of outcome i, trader pays C(q+δ e_i) - C(q).
- Price of outcome i:
p_i(q) = ∂C/∂q_i = exp(q_i/b) / Σ_j exp(q_j/b)
- Prices sum to 1.
- Derivation from scoring rule: proper scoring rule s_i(r) = ln(r_i) maybe? Need derive LMSR from logarithmic scoring rule. Let's derive: A market maker can be seen as maintaining a probability distribution p over outcomes. When a trader buys shares, they update p. The cost function is the Legendre transform of the scoring rule? Need derive.

Let's derive LMSR from logarithmic scoring rule. A proper scoring rule S_i(p) = A(p) + B(p) ln p_i? For logarithmic scoring rule S_i(p) = ln p_i. Expected score under p: Σ p_i ln p_i = -H(p). The market maker's cost function is the maximum expected score? Need derive.

Actually LMSR can be derived from the logarithmic scoring rule and a "market maker" mechanism. Let's derive cost function from scoring rule:

Suppose market maker has a current probability distribution p. A trader who changes distribution from p to p' receives payoff? In LMSR, the cost to change distribution from p to p' is C(p') - C(p) where C(p) = b ln Σ_i exp(b? no). Need align.

Let's derive from scoring rule: The logarithmic scoring rule pays s_i(r) = ln(r_i) if outcome i occurs. A market maker with initial distribution r0 offers a security that pays? The cost function is the convex conjugate of the expected score? Let's derive.

Let q_i be shares. The market maker's loss function? Actually LMSR is based on "market scoring rule" where the market maker's automated market maker has cost function C(q) = b ln Σ exp(q_i/b). The price p_i = exp(q_i/b)/Σ exp(q_i/b). This is equivalent to maintaining a probability distribution p_i = exp(q_i/b)/Z. The cost to move from p to p' is b * KL(p' || p)? Let's check: C(q') - C(q) = b ln (Σ exp(q'_i/b) / Σ exp(q_i/b)). If q_i = b ln p_i + const? Let p_i = exp(q_i/b)/Z. Then q_i = b ln p_i + b ln Z. Difference C(q') - C(q) = b ln (Σ exp(q'_i/b)/Σ exp(q_i/b)) = b ln (Σ p'_i * exp((q'_i - q_i)/b)? Hmm.

Let's derive from logarithmic scoring rule: The market maker's "cost" for a set of holdings q is the supremum over distributions p of [Σ q_i p_i? Wait no.

Actually LMSR cost function can be derived from the "logarithmic market scoring rule" as follows: The market maker maintains a probability vector p. A trader can move p to p' by paying the difference in expected score? Let's derive.

Let S_i(p) = ln p_i be the logarithmic score. The market maker's "wealth" after trades? There is a known result: LMSR cost function C(q) = b ln Σ exp(q_i/b) is the convex conjugate of the logarithmic scoring rule. Specifically, if q_i are "subsidy" payments, then price p_i = exp(q_i/b)/Z. The cost to buy a vector of shares Δ is C(q+Δ)-C(q). The price of a share of outcome i is p_i.

Need maybe derive from "Hanson's market maker" using "proper scoring rule" and "budget balance"? Let's include a concise derivation:

Let p be a probability distribution over outcomes. The logarithmic scoring rule pays s_i(p) = ln p_i if outcome i occurs. A market maker with initial distribution p0 can be viewed as offering a security that pays s_i(p) - s_i(p0) for each share? Hmm.

Actually in a market scoring rule, the market maker commits to pay the score difference between final and initial distribution. A trader who changes the distribution from p to p' receives s_i(p') - s_i(p) if outcome i occurs. The expected payoff under the trader's belief? The price of changing distribution is the expected score difference under the current market distribution? Let's derive.

Let p be current market distribution. A trader proposes a new distribution p'. The market maker will pay the trader the score difference S_i(p') - S_i(p) if outcome i occurs. The fair price is the expected value under the market's current distribution p:
Price = Σ_i p_i [S_i(p') - S_i(p)] = Σ_i p_i ln(p'_i / p_i) = -H(p) +? Actually Σ p_i ln p'_i - Σ p_i ln p_i = -KL(p || p')? Wait KL(p || p') = Σ p_i ln(p_i/p'_i). So price = -KL(p || p')? That's negative. Need maybe use "seller" perspective? Let's check.

If trader moves distribution from p to p', the expected score under p is Σ p_i ln p'_i - Σ p_i ln p_i = -KL(p || p') ≤ 0. So trader would pay negative? That can't be. Maybe the market maker pays the score difference, and the trader pays the expected score difference under the *new* distribution? Let's derive from cost function.

Cost function C(q) = b ln Σ exp(q_i/b). Let q_i = b ln p_i + constant. Then C(q) = b ln Σ exp(ln p_i + const/b) = b ln (e^{const/b} Σ p_i) = const. So C is constant for all probability distributions? That's wrong because q_i = b ln p_i + const gives C(q) = b ln (e^{const/b} Σ p_i) = const. So cost doesn't change when moving along probability simplex? But in LMSR, q_i are shares, not probabilities. Price p_i = exp(q_i/b)/Z. If q_i = b ln p_i + const, then p_i = exp(ln p_i + const/b)/Z = p_i e^{const/b}/Z, so Z = e^{const/b}, and C = b ln Z = const. So indeed any distribution can be represented with same cost? No, because q_i are not normalized; adding constant to all q_i changes cost but not prices. So cost is not unique. Need maybe use "q_i" as "shares outstanding" and "p_i" as "price per share". The cost to buy a bundle is difference in C. The price of a single share is p_i. Good.

Need derive LMSR from "Hanson's scoring rule" maybe:

Hanson's market maker: Let q_i be number of shares outstanding for outcome i. The market maker's cost function is C(q) = b ln Σ_i exp(q_i/b). This is the unique cost function whose marginal prices are the logarithmic scoring rule probabilities. To see, differentiate:
p_i(q) = ∂C/∂q_i = exp(q_i/b) / Σ_j exp(q_j/b).
These p_i are the probabilities assigned by the logarithmic scoring rule to the "market's" beliefs. The cost function is the convex conjugate of the logarithmic score:
C(q) = sup_p Σ_i q_i p_i + b H(p)? Need derive.

Let's derive from "proper scoring rule" and "convex conjugate":

A proper scoring rule S_i(p) = ln p_i. The associated "entropy" H(p) = -Σ p_i ln p_i. The market maker's cost function is the Legendre transform:
C(q) = sup_p [Σ_i q_i p_i + b H(p)].
Let's compute: maximize F(p) = Σ q_i p_i - b Σ p_i ln p_i subject to Σ p_i=1. Lagrangian L = Σ q_i p_i - b Σ p_i ln p_i + λ(1 - Σ p_i). Derivative: q_i - b(ln p_i + 1) - λ = 0 => ln p_i = (q_i - λ - b)/b => p_i ∝ exp(q_i/b). Normalize. Then maximum value:
C(q) = Σ q_i p_i - b Σ p_i ln p_i = b ln Z? Let's compute: p_i = exp(q_i/b)/Z. Then q_i = b ln p_i + b ln Z. Sum q_i p_i = b Σ p_i ln p_i + b ln Z. So C = b Σ p_i ln p_i + b ln Z - b Σ p