const COINGECKO_API_URL = "https://api.coingecko.com/api/v3/simple/price";

export const getTokenPrices = async () => {
  try {
    const response = await fetch(
      `${COINGECKO_API_URL}?ids=bitcoin,ethereum,usd-coin&vs_currencies=usd`
    );
    const data = await response.json();
    return {
      BTC: data.bitcoin.usd,
      ETH: data.ethereum.usd,
      USDC: data["usd-coin"].usd,
    };
  } catch (error) {
    console.error("Error fetching token prices:", error);
    return { BTC: 0, ETH: 0, USDC: 1 }; // Default values
  }
};
