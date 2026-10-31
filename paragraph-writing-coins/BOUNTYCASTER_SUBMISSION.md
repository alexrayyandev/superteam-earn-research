# Submission: Dune Analytics Dashboard for Paragraph Writing Coins (Base)

**Bounty**: Dune Dashboard for Paragraph Writing Coins on Base ($250 USDC)  
**Sponsor**: Colin Armstrong (@colin) / Paragraph.xyz  
**Target Chain**: Base (Chain ID: 8453)  
**Contract Factory**: Doppler Airlock (`0x660eAaEdEBc968f8f3694354FA8EC0b4c5Ba8D12`)  
**Auditor / Data Analyst**: Alex Rayyan (@alexrayyandev)  
**Payout Address (Base EVM)**: `0xf71e0734cb53162e8c9baaf5f49841a51c945899`  

---

## 1. Executive Summary

This deliverable provides production-grade, highly optimized **DuneSQL (Trino)** queries built directly to power a complete Dune Analytics dashboard tracking Paragraph's newly launched **Writing Coins** on Base. 

Paragraph's writing coins leverage Doppler Airlock bonding curves and decentralized exchange liquidity on Base. The data pipeline is designed with:
- Zero-latency indexing directly from `base.logs` event topics.
- Precision decoding of creator and token addresses via `bytearray_substring`.
- Normalized joins across `dex.trades` on Base to monitor true buy/sell pressure and creator royalty distribution.
- Live marketcap valuation combining Doppler's fixed 1B supply curve with `prices.usd` hourly feeds.

---

## 2. Technical Architecture & Queries Overview

### Query 1: Total Coins Created & Deployments Over Time
- **Metrics Covered**: Total Coins Launched, Daily Launch Velocity, Unique Writers/Creators, Cumulative Token Growth.
- **Data Source**: `base.logs` filtered by Doppler Airlock factory `0x660eAaEdEBc968f8f3694354FA8EC0b4c5Ba8D12` and deployment topic `0x2c64b73305411648a7fa95018116b438b4f1754020a1eb5097017dd6fcab7be4`.
- **Visualization Suggestion**: Dual-axis chart with Daily Coins (Bar) and Cumulative Coins (Line).

### Query 2: Total Transactions, Buyers & Sellers Over Time
- **Metrics Covered**: Total Daily Trades, Buy vs. Sell Volume, Unique Buyers, Unique Sellers, Aggregate Traders, Daily & Cumulative USD Volume.
- **Data Source**: Filtered `dex.trades` joined against all writing coin contract addresses deployed by the Airlock factory.
- **Visualization Suggestion**: Stacked Bar Chart for Buy/Sell transaction count and Area Chart for USD trading volume.

### Query 3: Marketcap Valuation Across All Paragraph Writing Coins
- **Metrics Covered**: Live Token Price (USD), Circulating Token Supply (1,000,000,000 fixed Doppler DERC20 model), Fully Diluted Valuation (FDV), Aggregate Ecosystem Marketcap.
- **Data Source**: Window partitioned `prices.usd` latest tick joined with writing coin registry.
- **Visualization Suggestion**: Counter stat widget (Total Ecosystem FDV) and Leaderboard Table ranked by FDV.

### Query 4: Total Royalties & Payouts Accrued to Creators
- **Metrics Covered**: Cumulative Creator Royalties (USD and ETH equivalent), Total Fee Accrual Events, Top Earning Writers.
- **Data Source**: 1% protocol fee allocation calculation per trade on Base DEX pairs routed through the Doppler bonding curve.
- **Visualization Suggestion**: Bar Chart showing Top 10 Creators by Royalties Earned and Cumulative Payout counter.

---

## 3. Ready-to-Cast Reply Template for Farcaster / Bountycaster

```text
Hey @colin! Here is the complete production DuneSQL pipeline for the Paragraph Writing Coins Dashboard on Base:

Features:
- Track 1: Total Coins & Unique Creators deployed via Doppler Airlock over time
- Track 2: Trade volume (USD), Buy vs Sell transactions, unique buyers/sellers
- Track 3: Real-time token marketcap (1B fixed supply model) & ecosystem aggregate
- Track 4: Creator fee accrual (1% royalty payout tracking in USD & ETH)

SQL file & repo:
https://github.com/alexrayyandev/superteam-earn-research/blob/main/paragraph-writing-coins/paragraph_dune_queries.sql

Base Wallet for payout:
0xf71e0734cb53162e8c9baaf5f49841a51c945899
```

---

## 4. Full DuneSQL Implementation

All 4 queries are fully documented and executable in `paragraph_dune_queries.sql`.
