import { request, gql } from "graphql-request";

const GRAPH_API_URL = `https://gateway.thegraph.com/api/${process.env.GRAPH_API_KEY}/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV`;

/**
 * Fetch Uniswap pools and determine the best yield position.
 *
 * @returns The best liquidity position for yield farming.
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

    // Find the best pool based on highest TVL
    const bestPool = data.pools[0];

    return {
      message: `Found a high-yield Uniswap position:
      - Pool: ${bestPool.token0.symbol} / ${bestPool.token1.symbol}
      - Fee Tier: ${bestPool.feeTier / 10000}%
      - Total Value Locked: $${parseFloat(bestPool.totalValueLockedUSD).toFixed(
        2
      )}
      - 24h Volume: $${parseFloat(bestPool.volumeUSD).toFixed(2)}

      Would you like to open this position?`,
      pool: bestPool,
    };
  } catch (error) {
    console.error("Error fetching Uniswap data:", error);
    return { message: "Error fetching Uniswap data." };
  }
}
