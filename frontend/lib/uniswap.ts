import { request, gql } from "graphql-request";

const GRAPH_API_URL = `https://gateway.thegraph.com/api/${process.env.GRAPH_API_KEY}/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV`;
// const GRAPH_API_URL = `https://gateway.thegraph.com/api/${process.env.GRAPH_API_KEY}/subgraphs/id/GqzP4Xaehti8KSfQmv3ZctFSjnSUYZ4En5NRsiTbvZpz`;

/**
 * Format large numbers into readable formats (e.g., $1.2M, $3.5B)
 */
function formatCurrency(value: number): string {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
}

/**
 * Calculate a pool score to rank Uniswap yield opportunities.
 */
function calculatePoolScore(pool: any): number {
  const MIN_TVL_USD = 100_000,
    GOOD_TVL_USD = 1_000_000;
  const MIN_VOLUME_USD = 250_000,
    GOOD_VOLUME_USD = 500_000;
  const MIN_TX_COUNT = 100,
    GOOD_TX_COUNT = 1_000;

  // TVL Factor
  const tvlFactor = Math.min(
    1.0,
    Math.max(
      0.0,
      (parseFloat(pool.totalValueLockedUSD) - MIN_TVL_USD) /
        (GOOD_TVL_USD - MIN_TVL_USD)
    )
  );

  // Volume Factor
  const volumeFactor = Math.min(
    1.0,
    Math.max(
      0.0,
      (parseFloat(pool.volumeUSD) - MIN_VOLUME_USD) /
        (GOOD_VOLUME_USD - MIN_VOLUME_USD)
    )
  );

  // Transaction Factor
  const txFactor = Math.min(
    1.0,
    Math.max(
      0.0,
      (parseFloat(pool.txCount) - MIN_TX_COUNT) / (GOOD_TX_COUNT - MIN_TX_COUNT)
    )
  );

  // Weighted Score
  const weightedFactor = tvlFactor * 0.5 + volumeFactor * 0.3 + txFactor * 0.2;
  return weightedFactor;
}

/**
 * Fetch Uniswap pools and determine the top 5 yield positions.
 */
export async function findBestUniswapPositions() {
  const query = gql`
    {
      pools(first: 50, orderBy: volumeUSD, orderDirection: desc) {
        liquidity
        feeTier
        feesUSD
        token0Price
        token1Price
        volumeToken0
        volumeToken1
        volumeUSD
        txCount
        totalValueLockedToken0
        totalValueLockedToken1
        totalValueLockedUSD
        totalValueLockedETH
        token0 {
          id
          symbol
          name
          decimals
          totalSupply
          volume
          volumeUSD
          untrackedVolumeUSD
          feesUSD
          txCount
          poolCount
          totalValueLocked
          totalValueLockedUSD
          totalValueLockedUSDUntracked
          derivedETH
        }
        token1 {
          id
          symbol
          name
          decimals
          totalSupply
          volume
          volumeUSD
          untrackedVolumeUSD
          feesUSD
          txCount
          poolCount
          totalValueLocked
          totalValueLockedUSD
          totalValueLockedUSDUntracked
          derivedETH
        }
      }
    }
  `;

  try {
    const data = await request(GRAPH_API_URL, query);

    if (!data.pools || data.pools.length === 0) {
      return { message: "No liquidity pools found.", pools: [] };
    }

    data.pools.slice(0, 5).forEach((pool) => {
      console.log(pool);
    });

    // console.log(
    //   "Fetched Uniswap Pool Data:",
    //   JSON.stringify(data.pools, null, 2)
    // );

    // Rank pools by score and get the top 5
    // const sortedPools = data.pools
    //   .map((pool) => ({ ...pool, score: calculatePoolScore(pool) }))
    //   .sort((a, b) => b.score - a.score)
    //   .slice(0, 5);

    const sortedPools = data.pools.slice(0, 5);
    //   .sort((a, b) => parseFloat(b.volumeUSD) - parseFloat(a.volumeUSD))
    //   .slice(0, 5);

    // Format the top 5 pools for chat
    let message = "**Top 5 Uniswap Yield Opportunities:**\n\n";
    sortedPools.forEach((pool, index) => {
      message += `**${index + 1}. ${pool.token0.symbol} / ${
        pool.token1.symbol
      }**  \n`;
      message += `- **Fee Tier:** ${pool.feeTier / 10000}%  \n`;
      message += `- **Total Value Locked:** ${formatCurrency(
        parseFloat(pool.totalValueLockedUSD)
      )}  \n`;
      message += `- **24h Volume:** ${formatCurrency(
        parseFloat(pool.volumeUSD)
      )}  \n`;
    });

    // Select the best pool
    const bestPool = sortedPools[0];

    return {
      topPoolsMessage: message,
      bestPoolMessage: `**Selected the best pool for execution:**\n\n**Pool:** ${
        bestPool.token0.symbol
      } / ${bestPool.token1.symbol}  \n**Fee Tier:** ${
        bestPool.feeTier / 10000
      }%  \n**Total Value Locked:** ${formatCurrency(
        parseFloat(bestPool.totalValueLockedUSD)
      )}  \n**24h Volume:** ${formatCurrency(
        parseFloat(bestPool.volumeUSD)
      )}  \n\nRequesting approval for Task Execution`,
      bestPool,
      pools: sortedPools,
    };
  } catch (error) {
    console.error("Error fetching Uniswap data:", error);
    return { message: "Error fetching Uniswap data.", pools: [] };
  }
}
