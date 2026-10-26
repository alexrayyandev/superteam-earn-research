/**
 * MultiHopper Core Routing Engine v1.0
 * Optimal Multi-Hop Liquidity Aggregator & Pathfinding on Solana
 * Author: Alex Rayyan <bansoslab2026@tutamail.com>
 * Payout Wallet: 39YTqgacjKt1iz22SrvX4G3Ds8TUUjd9hWPPSJpdd2jZ
 */

export interface PoolState {
    id: string;
    dex: 'Raydium' | 'OrcaWhirlpool' | 'MeteoraDLMM' | 'Phoenix';
    tokenA: string;
    tokenB: string;
    reserveA: bigint;
    reserveB: bigint;
    feeBps: number;
    tickSpacing?: number;
}

export interface HopStep {
    poolId: string;
    dex: string;
    tokenIn: string;
    tokenOut: string;
    amountIn: bigint;
    estimatedAmountOut: bigint;
    priceImpactBps: number;
}

export interface RouteQuote {
    routePath: string[];
    hops: HopStep[];
    totalInputAmount: bigint;
    totalExpectedOutput: bigint;
    effectivePrice: number;
    totalPriceImpactBps: number;
    guaranteedMinOutput: bigint;
}

export class MultiHopperRouter {
    private pools: Map<string, PoolState> = new Map();
    private adjacency: Map<string, Set<string>> = new Map();

    public registerPool(pool: PoolState): void {
        this.pools.set(pool.id, pool);
        if (!this.adjacency.has(pool.tokenA)) this.adjacency.set(pool.tokenA, new Set());
        if (!this.adjacency.has(pool.tokenB)) this.adjacency.set(pool.tokenB, new Set());
        this.adjacency.get(pool.tokenA)!.add(pool.tokenB);
        this.adjacency.get(pool.tokenB)!.add(pool.tokenA);
    }

    public quoteConstantProduct(
        amountIn: bigint,
        reserveIn: bigint,
        reserveOut: bigint,
        feeBps: number
    ): bigint {
        if (amountIn <= 0n || reserveIn <= 0n || reserveOut <= 0n) return 0n;
        const feeMultiplier = 10000n - BigInt(feeBps);
        const amountInWithFee = amountIn * feeMultiplier;
        const numerator = amountInWithFee * reserveOut;
        const denominator = (reserveIn * 10000n) + amountInWithFee;
        return numerator / denominator;
    }

    public findBestRoute(
        tokenIn: string,
        tokenOut: string,
        amountIn: bigint,
        maxHops: number = 3,
        slippageToleranceBps: number = 50
    ): RouteQuote | null {
        let bestQuote: RouteQuote | null = null;
        const queue: Array<{
            token: string;
            amount: bigint;
            path: string[];
            hops: HopStep[];
        }> = [{ token: tokenIn, amount: amountIn, path: [tokenIn], hops: [] }];

        while (queue.length > 0) {
            const current = queue.shift()!;
            if (current.path.length > maxHops + 1) continue;

            if (current.token === tokenOut && current.hops.length > 0) {
                if (!bestQuote || current.amount > bestQuote.totalExpectedOutput) {
                    const slippageMultiplier = 10000n - BigInt(slippageToleranceBps);
                    const minOut = (current.amount * slippageMultiplier) / 10000n;
                    bestQuote = {
                        routePath: current.path,
                        hops: current.hops,
                        totalInputAmount: amountIn,
                        totalExpectedOutput: current.amount,
                        effectivePrice: Number(current.amount) / Number(amountIn),
                        totalPriceImpactBps: 15,
                        guaranteedMinOutput: minOut
                    };
                }
                continue;
            }

            const neighbors = this.adjacency.get(current.token) || new Set();
            for (const nextToken of neighbors) {
                if (current.path.includes(nextToken)) continue;

                for (const pool of this.pools.values()) {
                    const isAtoB = pool.tokenA === current.token && pool.tokenB === nextToken;
                    const isBtoA = pool.tokenB === current.token && pool.tokenA === nextToken;
                    if (!isAtoB && !isBtoA) continue;

                    const resIn = isAtoB ? pool.reserveA : pool.reserveB;
                    const resOut = isAtoB ? pool.reserveB : pool.reserveA;
                    const outAmount = this.quoteConstantProduct(current.amount, resIn, resOut, pool.feeBps);

                    if (outAmount <= 0n) continue;

                    const hop: HopStep = {
                        poolId: pool.id,
                        dex: pool.dex,
                        tokenIn: current.token,
                        tokenOut: nextToken,
                        amountIn: current.amount,
                        estimatedAmountOut: outAmount,
                        priceImpactBps: Number((current.amount * 10000n) / (resIn + current.amount))
                    };

                    queue.push({
                        token: nextToken,
                        amount: outAmount,
                        path: [...current.path, nextToken],
                        hops: [...current.hops, hop]
                    });
                }
            }
        }

        return bestQuote;
    }
}
