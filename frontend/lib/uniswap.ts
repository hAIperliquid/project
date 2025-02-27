import { request, gql } from "graphql-request";

// const GRAPH_API_URL = `https://gateway.thegraph.com/api/${process.env.GRAPH_API_KEY}/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV?chain=mainnet`;
const GRAPH_API_URL = `https://gateway.thegraph.com/api/${process.env.GRAPH_API_KEY}/subgraphs/id/GqzP4Xaehti8KSfQmv3ZctFSjnSUYZ4En5NRsiTbvZpz`;

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
  const minTVL = 100_000,
    maxTVL = 1_000_000;
  const minVolume = 50_000,
    maxVolume = 500_000;

  const tvlFactor = Math.min(
    1.0,
    Math.max(
      0.0,
      (parseFloat(pool.totalValueLockedUSD) - minTVL) / (maxTVL - minTVL)
    )
  );
  const volumeFactor = Math.min(
    1.0,
    Math.max(
      0.0,
      (parseFloat(pool.volumeUSD) - minVolume) / (maxVolume - minVolume)
    )
  );
  const feeFactor =
    parseFloat(pool.volumeUSD) * (parseFloat(pool.feeTier) / 1_000_000); // Estimated fee generation

  return tvlFactor * 0.5 + volumeFactor * 0.3 + feeFactor * 0.2;
}

/**
 * Fetch Uniswap pools and determine the top 5 yield positions.
 */
export async function findBestUniswapPositions() {
  const query = gql`
    {
      pools(first: 10, orderBy: totalValueLockedUSD, orderDirection: desc) {
        id
        token0 {
          id
          symbol
          decimals
        }
        token1 {
          id
          symbol
          decimals
        }
        feeTier
        totalValueLockedUSD
        volumeUSD
      }
    }
  `;

  try {
    const data = await request(GRAPH_API_URL, query);

    if (!data.pools || data.pools.length === 0) {
      return { message: "No liquidity pools found.", pools: [] };
    }

    // console log each pool
    data.pools.forEach((pool) => {
      console.log(pool);
    });

    // Rank pools by score and get the top 5
    const sortedPools = data.pools
      .map((pool) => ({ ...pool, score: calculatePoolScore(pool) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

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
      )}  \n\nRequesting approval for Task Execution...`,
      bestPool,
      pools: sortedPools,
    };
  } catch (error) {
    console.error("Error fetching Uniswap data:", error);
    return { message: "Error fetching Uniswap data.", pools: [] };
  }
}
