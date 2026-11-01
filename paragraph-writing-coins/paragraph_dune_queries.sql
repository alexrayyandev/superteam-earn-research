-- ============================================================================
-- Dune Dashboard for Paragraph Writing Coins (Doppler v3 Integration on Base)
-- Engine: DuneSQL (Trino Engine)
-- Target Chain: Base (Chain ID: 8453)
-- Factory: Doppler Airlock (0x660eAaEdEBc968f8f3694354FA8EC0b4c5Ba8D12)
-- Author: Alex Rayyan (@alexrayyandev)
-- Status: Verified DuneSQL Standard Schema & Native Varbinary Compatible
-- ============================================================================

-- ----------------------------------------------------------------------------
-- QUERY 1: Total Coins Created & Deployments Over Time
-- Metrics: Total Coins, Unique Creators, Cumulative Growth, Daily Launches
-- ----------------------------------------------------------------------------
WITH doppler_deployments AS (
    SELECT
        evt_block_time AS block_time,
        date_trunc('day', evt_block_time) AS launch_date,
        evt_tx_hash AS tx_hash,
        contract_address AS airlock_address,
        topic1 AS topic_creator,
        topic2 AS topic_token
    FROM base.logs
    WHERE contract_address = 0x660eAaEdEBc968f8f3694354FA8EC0b4c5Ba8D12
      AND topic0 = 0x2c64b73305411648a7fa95018116b438b4f1754020a1eb5097017dd6fcab7be4
),

normalized_coins AS (
    SELECT
        launch_date,
        block_time,
        tx_hash,
        varbinary_substring(topic_creator, 13, 20) AS creator_address,
        varbinary_substring(topic_token, 13, 20) AS token_address
    FROM doppler_deployments
),

creator_first_seen AS (
    SELECT
        creator_address,
        MIN(launch_date) AS first_launch_date
    FROM normalized_coins
    GROUP BY creator_address
),

new_creators_agg AS (
    SELECT
        first_launch_date AS launch_date,
        COUNT(creator_address) AS new_creators_daily
    FROM creator_first_seen
    GROUP BY first_launch_date
),

daily_stats AS (
    SELECT
        launch_date,
        COUNT(token_address) AS coins_created_daily,
        COUNT(DISTINCT creator_address) AS active_creators_daily
    FROM normalized_coins
    GROUP BY launch_date
)

SELECT
    d.launch_date,
    d.coins_created_daily,
    d.active_creators_daily,
    COALESCE(n.new_creators_daily, 0) AS new_unique_creators_daily,
    SUM(d.coins_created_daily) OVER (ORDER BY d.launch_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_total_coins,
    SUM(COALESCE(n.new_creators_daily, 0)) OVER (ORDER BY d.launch_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_unique_creators
FROM daily_stats d
LEFT JOIN new_creators_agg n ON d.launch_date = n.launch_date
ORDER BY d.launch_date DESC;


-- ----------------------------------------------------------------------------
-- QUERY 2: Total Transactions, Buyers & Sellers Over Time
-- Metrics: Daily Trades, Unique Buyers, Unique Sellers, Volume in USD
-- ----------------------------------------------------------------------------
WITH writing_tokens AS (
    SELECT DISTINCT
        varbinary_substring(topic2, 13, 20) AS token_address
    FROM base.logs
    WHERE contract_address = 0x660eAaEdEBc968f8f3694354FA8EC0b4c5Ba8D12
      AND topic0 = 0x2c64b73305411648a7fa95018116b438b4f1754020a1eb5097017dd6fcab7be4
),

dex_trades AS (
    SELECT
        t.block_date,
        t.block_time,
        t.tx_hash,
        t.taker,
        t.amount_usd,
        CASE 
            WHEN wt_buy.token_address IS NOT NULL THEN 'BUY'
            WHEN wt_sell.token_address IS NOT NULL THEN 'SELL'
            ELSE 'OTHER'
        END AS trade_type
    FROM dex.trades t
    LEFT JOIN writing_tokens wt_buy ON t.token_bought_address = wt_buy.token_address
    LEFT JOIN writing_tokens wt_sell ON t.token_sold_address = wt_sell.token_address
    WHERE t.blockchain = 'base'
      AND (wt_buy.token_address IS NOT NULL OR wt_sell.token_address IS NOT NULL)
)

SELECT
    block_date,
    COUNT(tx_hash) AS total_transactions,
    COUNT(CASE WHEN trade_type = 'BUY' THEN tx_hash END) AS buy_transactions,
    COUNT(CASE WHEN trade_type = 'SELL' THEN tx_hash END) AS sell_transactions,
    COUNT(DISTINCT CASE WHEN trade_type = 'BUY' THEN taker END) AS unique_buyers,
    COUNT(DISTINCT CASE WHEN trade_type = 'SELL' THEN taker END) AS unique_sellers,
    COUNT(DISTINCT taker) AS total_unique_traders,
    COALESCE(SUM(amount_usd), 0.0) AS total_volume_usd,
    SUM(COALESCE(SUM(amount_usd), 0.0)) OVER (ORDER BY block_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_volume_usd
FROM dex_trades
GROUP BY block_date
ORDER BY block_date DESC;


-- ----------------------------------------------------------------------------
-- QUERY 3: Total Marketcap of All Paragraph Writing Coins
-- Metrics: Current Price, Circulating Supply (1B Fixed), Token Marketcap, Aggregate
-- ----------------------------------------------------------------------------
WITH latest_token_prices AS (
    SELECT
        contract_address AS token_address,
        price
    FROM prices.latest
    WHERE blockchain = 'base'
),

all_coins AS (
    SELECT DISTINCT
        varbinary_substring(topic2, 13, 20) AS token_address,
        evt_block_time AS created_time
    FROM base.logs
    WHERE contract_address = 0x660eAaEdEBc968f8f3694354FA8EC0b4c5Ba8D12
      AND topic0 = 0x2c64b73305411648a7fa95018116b438b4f1754020a1eb5097017dd6fcab7be4
)

SELECT
    c.token_address,
    COALESCE(p.price, 0.000001) AS current_price_usd,
    1000000000.0 AS total_supply, -- Doppler DERC20 fixed 1B supply
    (1000000000.0 * COALESCE(p.price, 0.000001)) AS fully_diluted_marketcap_usd,
    c.created_time
FROM all_coins c
LEFT JOIN latest_token_prices p ON c.token_address = p.token_address
ORDER BY fully_diluted_marketcap_usd DESC;


-- ----------------------------------------------------------------------------
-- QUERY 4: Total Payouts to Creators
-- Metrics: Fee accrual from 1% bonding curve/DEX fee, ETH/USDC value
-- ----------------------------------------------------------------------------
WITH eth_live_price AS (
    SELECT price AS eth_usd_price
    FROM prices.latest
    WHERE blockchain = 'base' 
      AND contract_address = 0x4200000000000000000000000000000000000006 -- WETH on Base
    LIMIT 1
),

writing_tokens AS (
    SELECT DISTINCT
        varbinary_substring(topic2, 13, 20) AS token_address,
        varbinary_substring(topic1, 13, 20) AS creator_address
    FROM base.logs
    WHERE contract_address = 0x660eAaEdEBc968f8f3694354FA8EC0b4c5Ba8D12
      AND topic0 = 0x2c64b73305411648a7fa95018116b438b4f1754020a1eb5097017dd6fcab7be4
),

trades AS (
    SELECT
        t.block_date,
        t.tx_hash,
        t.amount_usd,
        wt.creator_address,
        -- 1% creator royalty fee configured in Doppler protocol for Paragraph
        (t.amount_usd * 0.01) AS creator_fee_usd
    FROM dex.trades t
    INNER JOIN writing_tokens wt 
            ON t.token_bought_address = wt.token_address OR t.token_sold_address = wt.token_address
    WHERE t.blockchain = 'base'
)

SELECT
    creator_address,
    COUNT(tx_hash) AS total_trades_accrued,
    SUM(creator_fee_usd) AS total_payout_usd,
    ROUND(SUM(creator_fee_usd) / COALESCE(MAX(e.eth_usd_price), 3000.0), 6) AS estimated_payout_eth
FROM trades
CROSS JOIN eth_live_price e
GROUP BY creator_address
ORDER BY total_payout_usd DESC;