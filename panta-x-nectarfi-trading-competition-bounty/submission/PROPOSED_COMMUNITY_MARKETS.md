PROPOSED COMMUNITY MARKETS FOR PANTA

Author: Alex Rayyan (bansoslab2026@tutamail.com)

Purpose: This document proposes five high-liquidity, mathematically sound, and unambiguously resolvable prediction markets for the Panta platform. Each market is designed to attract sustained trader participation, minimize oracle ambiguity, and provide clean settlement paths. All timestamps are in UTC.

---

Market 1

Market Title & Ticker Symbol: Solana Total Value Locked (TVL) to Exceed USD 12 Billion Before December 31, 2026 -- SOL-TVL-12B-2026

Category: DeFi Milestones

Underlying Thesis & Why Traders Will Provide Volume: Solana TVL is a widely tracked, continuously updated metric with strong narrative sensitivity to DeFi growth, stablecoin adoption, and institutional integrations. Traders with views on Solana ecosystem expansion, airdrop cycles, and liquidity mining programs will have direct, low-friction exposure. The metric updates frequently, enabling active position management and short-term trading around protocol launches and macro crypto events.

Unambiguous Resolution Criteria: Resolution is YES if, at any timestamp on or before December 31, 2026 23:59:59 UTC, DeFi Llama reports Solana TVL strictly greater than USD 12,000,000,000. Resolution is NO if no such reading occurs by expiration. Edge cases: (a) if DeFi Llama revises historical TVL downward after the threshold was previously exceeded, the market still resolves YES because the condition was satisfied at a recorded publication timestamp; (b) if DeFi Llama changes methodology mid-market, the last published methodology-comparable reading before the change governs; (c) stablecoin double-counting or bridged asset valuation disputes are deferred to the published DeFi Llama aggregate, not to third-party recalculations.

Primary Oracle / Data Source: DeFi Llama Solana chain TVL endpoint, https://defillama.com/chain/Solana, API https://api.llama.fi/v2/historicalChainTvl/Solana

Expiration & Settlement Timestamp: December 31, 2026 23:59:59 UTC, with settlement triggered by the final published reading on or before that timestamp.

Initial Liquidity Recommendation & Implied Probability Calibration: Initial liquidity USD 75,000. Implied probability calibration at launch: 38 percent YES, 62 percent NO, reflecting current Solana TVL trajectory and the requirement for sustained net inflows rather than transient spikes.

---

Market 2

Market Title & Ticker Symbol: First US SEC Spot Solana ETF S-1 Approval by Q2 2027 -- SEC-SOL-ETF-Q2-2027

Category: Crypto Infra

Underlying Thesis & Why Traders Will Provide Volume: Regulatory approval of a spot Solana ETF is a high-impact, binary catalyst with significant institutional demand implications. The market attracts macro crypto traders, regulatory analysts, and event-driven funds. The resolution window is long enough to price regulatory process risk while remaining bounded and tradable.

Unambiguous Resolution Criteria: Resolution is YES if, on or before June 30, 2027 23:59:59 UTC, the US Securities and Exchange Commission grants effectiveness to, or otherwise approves, an S-1 registration statement for a spot Solana exchange-traded fund. Resolution is NO if no such approval occurs by expiration. Edge cases: (a) a 19b-4 exchange rule change approval without an effective S-1 does not resolve YES; (b) an S-1 for a futures-based or staking-wrapped product does not resolve YES unless the filing explicitly covers spot Solana exposure; (c) a withdrawal and refiling resets the evaluation window but does not retroactively satisfy the condition; (d) an approval announced after expiration resolves NO regardless of announcement date.

Primary Oracle / Data Source: SEC EDGAR full-text and filing search, https://www.sec.gov/edgar/searchedgar/companysearch.html, and SEC EDGAR API, https://efts.sec.gov/LATEST/search-index

Expiration & Settlement Timestamp: June 30, 2027 23:59:59 UTC.

Initial Liquidity Recommendation & Implied Probability Calibration: Initial liquidity USD 100,000. Implied probability calibration at launch: 28 percent YES, 72 percent NO, reflecting regulatory sequencing risk and the absence of a current approved spot Solana ETF precedent.

---

Market 3

Market Title & Ticker Symbol: Firedancer Validator Client to Handle Greater Than 10 Percent of Solana Mainnet Stake by November 30, 2026 -- FD-STAKE-10PCT-NOV26

Category: Crypto Infra

Underlying Thesis & Why Traders Will Provide Volume: Firedancer adoption is a measurable infrastructure milestone with direct implications for Solana throughput, resilience, and client diversity. Validator operators, infrastructure investors, and ecosystem participants have strong incentives to track and trade this metric. The market is objective, quantifiable, and tied to a clear on-chain measurement.

Unambiguous Resolution Criteria: Resolution is YES if, at any timestamp on or before November 30, 2026 23:59:59 UTC, the aggregate active stake attributed to Firedancer, as reported by Solana Beach or Validators.app, exceeds 10 percent of total Solana mainnet active stake. Resolution is NO if no such reading occurs by expiration. Edge cases: (a) hybrid or modified clients are only counted if the data source explicitly classifies them as Firedancer; (b) if the data source reclassifies a client version after the fact, the classification in effect at the reading timestamp governs; (c) stake re-delegation delays are handled by using the data source's reported active stake, not theoretical or pending stake.

Primary Oracle / Data Source: Solana Beach client distribution, https://solanabeach.io/validators, and Validators.app client breakdown, https://www.validators.app

Expiration & Settlement Timestamp: November 30, 2026 23:59:59 UTC.

Initial Liquidity Recommendation & Implied Probability Calibration: Initial liquidity USD 60,000. Implied probability calibration at launch: 22 percent YES, 78 percent NO, reflecting the engineering and operational timeline required for broad validator migration.

---

Market 4

Market Title & Ticker Symbol: USDG Circulating Supply to Cross USD 500 Million Before December 31, 2026 -- USDG-500M-DEC26

Category: Crypto Infra

Underlying Thesis & Why Traders Will Provide Volume: USDG supply growth is a direct proxy for stablecoin adoption on Solana and the success of the USDG issuance and distribution strategy. Traders tracking payments, remittances, and DeFi collateral demand can express views through a simple, measurable supply metric. The market is suitable for both short-term momentum trading and longer-term structural positioning.

Unambiguous Resolution Criteria: Resolution is YES if, at any timestamp on or before December 31, 2026 23:59:59 UTC, the circulating supply of USDG, as reported by Solscan for the canonical USDG SPL token mint, is greater than or equal to 500,000,000 tokens. Resolution is NO if no such reading occurs by expiration. Edge cases: (a) only the canonical mint address specified at market creation counts; wrapped, bridged, or derivative representations are excluded; (b) if Solscan reports a supply anomaly due to a known mint or burn event, the on-chain SPL token supply at the relevant block height governs; (c) a temporary supply spike that is reversed within the same reporting window still satisfies the condition if it was recorded.

Primary Oracle / Data Source: Solscan SPL token supply page for the canonical USDG mint, https://solscan.io/token, and Solana RPC getTokenSupply method via a public RPC endpoint.

Expiration & Settlement Timestamp: December 31, 2026 23:59:59 UTC.

Initial Liquidity Recommendation & Implied Probability Calibration: Initial liquidity USD 50,000. Implied probability calibration at launch: 46 percent YES, 54 percent NO, reflecting growth potential balanced against competitive stablecoin dynamics.

---

Market 5

Market Title & Ticker Symbol: Manchester City to Defeat Arsenal in the Next Scheduled Premier League Fixture -- MCFC-ARS-PL-WIN

Category: Sports/Esports

Underlying Thesis & Why Traders Will Provide Volume: Premier League match outcomes generate high-frequency, high-conviction trading with broad global participation. Manchester City versus Arsenal is a marquee fixture with deep liquidity potential across sportsbooks and prediction markets. The result is binary, fast-settling, and easily understood by retail and institutional traders alike.

Unambiguous Resolution Criteria: Resolution is YES if Manchester City is recorded as the winner of the designated Premier League fixture against Arsenal by the official Premier League Match Center. Resolution is NO if Arsenal wins or the match ends in a draw. Edge cases: (a) if the match is abandoned and not replayed before expiration, the market resolves NO; (b) if the match is replayed, resolution follows the replayed official result; (c) extra time and penalty shootouts, if applicable to a cup tie, are excluded unless the fixture is explicitly a Premier League match decided in regular or stoppage time; (d) post-match disciplinary adjustments or overturned results by the Premier League do not alter resolution after the official final whistle result has been published.

Primary Oracle / Data Source: Official Premier League Match Center, https://www.premierleague.com/match, and Premier League results API, https://football-web-pages1.p.rapidapi.com/results.json

Expiration & Settlement Timestamp: Settlement occurs at the official final whistle timestamp of the designated fixture as recorded by the Premier League Match Center. Market expiration is set to that timestamp plus a 30-minute buffer for official result publication, capped at 23:59:59 UTC on the match day.

Initial Liquidity Recommendation & Implied Probability Calibration: Initial liquidity USD 125,000. Implied probability calibration at launch: 44 percent YES (Manchester City win), 31 percent NO (Arsenal win), 25 percent draw, with the binary YES/NO market priced at 44 percent YES and 56 percent NO inclusive of draw outcomes.

---

End of document.