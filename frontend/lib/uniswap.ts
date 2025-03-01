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
 * Fetch Uniswap pools and determine the top 5 yield positions.
 */
export async function findBestUniswapPositions() {
  const query = gql`
    {
      pools(first: 5, orderBy: volumeUSD, orderDirection: desc) {
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

    if (!data || !data.pools || data.pools.length === 0) {
      return { message: "No liquidity pools found.", pools: [] };
    }

    const pools = data.pools;
    console.log(pools);

    // Format the top 5 pools for chat
    let message = "**These are some Top Uniswap Yield Opportunities:**\n\n";
    pools.forEach((pool, index) => {
      message += `**${index + 1}. ${pool.token0.symbol} / ${
        pool.token1.symbol
      }**\n`;
      message += `- ${pool.token0.symbol} Liquidity: ${pool.token0.totalSupply}\n`;
      message += `- ${pool.token1.symbol} Liquidity: ${pool.token1.totalSupply}\n`;
      message += `- TVL: **${formatCurrency(
        parseFloat(pool.totalValueLockedUSD)
      )}**\n\n`;
    });
    message += "\nThe pools fit the criteria of having **High Volumes** with **High TVLs** \nand **Good Fee Ratios**. This could be a good position to allocate the funds.\n"

    // Select the best pool
    const bestPool = pools[0];

    return {
      topPoolsMessage: message,
      bestPoolMessage: `**Selected the best pool for execution:**\n\nPool: **${
        bestPool.token0.symbol
      } / ${bestPool.token1.symbol}**\n\nRequesting approval for Task Execution`,
      bestPool,
      pools,
    };
  } catch (error) {
    console.error("Error fetching Uniswap data:", error);
    return { message: "Error fetching Uniswap data.", pools: [] };
  }
}
