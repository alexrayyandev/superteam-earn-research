# Technical Implementation Plan: Panta x NectarFi Trading Competition Bounty

**Lead Architect:** Alex Rayyan (bansoslab2026@tutamail.com)
**Date:** 2026-11-12
**Reward:** 500 USDG

---

## 1. Executive Deliverable Objective

Build and deploy a trading competition infrastructure that:

- Tracks cross-protocol trading activity between Panta and NectarFi participants
- Ranks participants by defined performance metrics (volume, PnL, Sharpe ratio, trade frequency)
- Provides real-time leaderboard with on-chain verification
- Distributes the 500 USDG reward pool based on verified competition results
- Ensures fair, transparent, and tamper-resistant outcome reporting

---

## 2. Architecture / Content Structure

### 2.1 System Components

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                        │
│  Competition Dashboard / Leaderboard / Participant UI   │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                   API GATEWAY                            │
│  REST + WebSocket / Competition Events / Leaderboard    │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│              COMPETITION ENGINE                          │
│  Event Ingestion / Scoring / Ranking / Reward Calc       │
└──────────────────────┬─────────────────��────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  ON-CHAIN    │ │  OFF-CHAIN   │ │  IPFS /      │
│  DATA        │ │  DATABASE    │ │  VERIFICATION│
│  (Panta +    │ │  (Postgres / │ │  LAYER       │
│  NectarFi)   │ │  Redis)      │ │              │
└──────────────┘ └──────────────┘ └──────────────┘
```

### 2.2 Data Models

**Participant**
```
- wallet_address (PK)
- protocol (Panta | NectarFi)
- total_volume_usd
- total_trades
- realized_pnl
- unrealized_pnl
- sharpe_ratio
- competition_score
- rank
- is_eligible
```

**TradeEvent**
```
- tx_hash (PK)
- wallet_address (FK)
- protocol
- block_number
- timestamp
- token_in / token_out
- amount_usd
- fee_usd
- is_valid
```

**LeaderboardSnapshot**
```
- snapshot_id (PK)
- timestamp
- rankings (JSON array)
- merkle_root (for on-chain verification)
```

### 2.3 Competition Phases

```
Phase 1: Registration    → Participants whitelist wallets
Phase 2: Active Trading  → 14-30 day competition window
Phase 3: Verification     → On-chain data validation + dispute period
Phase 4: Distribution    → 500 USDG reward payout
```

---

## 3. Key Technical Mechanisms to Demonstrate

### 3.1 On-Chain Data Aggregation
- Index Panta and NectarFi smart contracts for trade events
- Use The Graph subgraphs or direct RPC event filtering
- Normalize token amounts to USD using price feeds (Chainlink / Uniswap TWAP)
- Deduplicate flash loans and wash trades

### 3.2 Scoring Algorithm
```
Score = (Volume_Score × 0.30) + (PnL_Score × 0.40) + (Consistency_Score × 0.20) + (Risk_Score × 0.10)

Volume_Score = log10(total_volume_usd) / max_log_volume
PnL_Score = total_pnl_usd / max_pnl
Consistency_Score = active_days / competition_days
Risk_Score = 1 - (max_drawdown / starting_balance)
```

### 3.3 Leaderboard Verification
- Publish Merkle root of final rankings to Ethereum / relevant L1
- Enable participants to verify their individual rank via Merkle proof
- Time-locked reveal to prevent front-running of results

### 3.4 Reward Distribution
```
Top 1:  150 USDG (30%)
Top 2:  100 USDG (20%)
Top 3:   75 USDG (15%)
Top 4-5: 40 USDG each (16%)
Top 6-10: 15 USDG each (15%)
Pool Reserve: 10 USDG (disputes / gas)
```

### 3.5 Anti-Gaming Controls
- Minimum 10 qualifying trades to be eligible
- Exclude trades with >2% price impact (sandwich protection)
- Require minimum trade size threshold (e.g., $50 USD equivalent)
- Flag wallets with correlated activity patterns

---

## 4. Expected Submission Artifacts

| Artifact | Format | Description |
|---|---|---|
| Competition Dashboard | Live URL | Public leaderboard with real-time rankings |
| Smart Contract | GitHub repo | On-chain verification contract (Solidity) |
| Scoring Engine | GitHub repo | Open-source scoring logic (TypeScript / Python) |
| Data Pipeline | GitHub repo | On-chain event indexing scripts |
| Final Report | PDF / MD | Methodology, results, distribution proof |
| Verification Proof | On-chain TX | Merkle root submission transaction hash |
| Reward Distribution | On-chain TX | Payment transaction hashes per winner |

---

**Sign-off: Alex Rayyan — bansoslab2026@tutamail.com**