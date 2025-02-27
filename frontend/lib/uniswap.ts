import { request, gql } from "graphql-request";

const GRAPH_API_URL = `https://gateway.thegraph.com/api/${process.env.GRAPH_API_KEY}/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV`;

/**
 * Calculate pool score to determine the best Uniswap yield opportunity.
 */
function calculatePoolScore(pool: any) {
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
 * Fetch Uniswap pools and determine the best yield position.
 */
export async function findBestUniswapPosition() {
  const query = gql`
    {
      pools(first: 10, orderBy: totalValueLockedUSD, orderDirection: desc) {
        id
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
        feeTier
        totalValueLockedUSD
        volumeUSD
      }
    }
  `;

  try {
    const data = await request(GRAPH_API_URL, query);
    console.log("Uniswap data:", data);

    if (!data.pools || data.pools.length === 0) {
      return "No liquidity pools found.";
    }

    // Rank pools by score
    const bestPool = data.pools
      .map((pool) => ({ ...pool, score: calculatePoolScore(pool) }))
      .sort((a, b) => b.score - a.score)[0]; // Highest scoring pool

    return {
      message: `Found a high-yield Uniswap position:
      - Pool: ${bestPool.token0.symbol} / ${bestPool.token1.symbol}
      - Fee Tier: ${bestPool.feeTier / 10000}%
      - Total Value Locked: $${parseFloat(bestPool.totalValueLockedUSD).toFixed(
        2
      )}
      - 24h Volume: $${parseFloat(bestPool.volumeUSD).toFixed(2)}
      - Estimated Score: ${(bestPool.score * 100).toFixed(2)}

      Would you like to open this position?`,
      pool: bestPool,
    };
  } catch (error) {
    console.error("Error fetching Uniswap data:", error);
    return { message: "Error fetching Uniswap data." };
  }
}
