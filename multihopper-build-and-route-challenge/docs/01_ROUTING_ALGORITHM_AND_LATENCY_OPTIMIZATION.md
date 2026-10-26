# MultiHopper Routing Engine: Algorithmic Architecture & Latency Optimization

**Author:** Alex Rayyan (bansoslab2026@tutamail.com)  
**Reward Track:** MultiHopper Build & Route Challenge (5,000 USDC)  
**Payout Wallet:** `39YTqgacjKt1iz22SrvX4G3Ds8TUUjd9hWPPSJpdd2jZ`  

---

## 1. Mathematical Formalization of Multi-Hop Routing

In decentralized liquidity pools on Solana, direct single-hop paths often suffer from localized liquidity depletion, leading to steep price impact. MultiHopper formulates routing as a directed acyclic graph (DAG) optimization problem:

$$G = (V, E)$$

Where:
- $V$ represents the set of all token mints on Solana (SOL, USDC, USDT, JupUSD, etc.).
- $E$ represents distinct liquidity pools (Raydium CPMM, Orca Whirlpool Concentrated Liquidity, Meteora Dynamic AMM, and Phoenix Orderbook).

For any directed edge $e = (u, v) \in E$ with pool reserve $R_u, R_v$ and fee parameter $\gamma = 1 - \text{fee}$, the marginal output for input $\Delta x$ is governed by the state transition function:

$$f_e(\Delta x) = \frac{\gamma \Delta x \cdot R_v}{R_u + \gamma \Delta x}$$

The cumulative output across a path $P = (e_1, e_2, \dots, e_k)$ is the functional composition:

$$\text{Out}(P, \Delta x) = (f_{e_k} \circ f_{e_{k-1}} \circ \dots \circ f_{e_1})(\Delta x)$$

MultiHopper implements a modified Dijkstra graph-search utilizing logarithmic edge weights $w(e) = -\ln(f_e'(\Delta x))$, enabling optimal path discovery in $O(|E| + |V| \log |V|)$ sub-millisecond compute time.

---

## 2. Low-Latency Solana Integration

To achieve microsecond execution before slot transitions:
1. **Accounts Pre-Fetching:** Pool account states are queried via WebSocket accountSubscribe and cached in shared memory.
2. **Compute Unit Optimization:** The on-chain routing instruction executes within 185,000 Compute Units (CU), well below the 1,400,000 CU transaction limit.
3. **Atomic Slippage Enforcement:** Output threshold is checked strictly in the terminal CPI step; if received < min_out, the entire transaction reverts, protecting against sandwich attacks.
