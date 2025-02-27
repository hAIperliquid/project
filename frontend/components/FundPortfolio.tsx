"use client";

import { useState, useEffect, JSX } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DollarSign, Bitcoin, EclipseIcon as Ethereum } from "lucide-react";

const COINGECKO_API_URL = "https://api.coingecko.com/api/v3/simple/price";

/** Hardcoded token balances */
const portfolio: { [key in "BTC" | "ETH" | "USDC"]: number } = {
  BTC: 100,
  ETH: 2000,
  USDC: 100000,
};

/** Icons for each token */
const tokenIcons: Record<string, JSX.Element> = {
  BTC: <Bitcoin className="text-orange-500" size={20} />,
  ETH: <Ethereum className="text-blue-500" size={20} />,
  USDC: <DollarSign className="text-green-500" size={20} />,
};

export function FundPortfolio() {
  const [prices, setPrices] = useState<{
    [key in "BTC" | "ETH" | "USDC"]?: number;
  }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const response = await fetch(
          `${COINGECKO_API_URL}?ids=bitcoin,ethereum,usd-coin&vs_currencies=usd`
        );
        const data = await response.json();
        setPrices({
          BTC: data.bitcoin.usd,
          ETH: data.ethereum.usd,
          USDC: data["usd-coin"].usd,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching token prices:", error);
      }
    }
    fetchPrices();
  }, []);

  /** Calculate total portfolio value */
  const totalValue = Object.keys(portfolio).reduce((acc, key) => {
    return acc + (prices[key] || 0) * portfolio[key];
  }, 0);

  return (
    <Card className="mb-4 p-5 flex flex-row">
      {/* Left: Total Portfolio Value */}
      <div className="w-1/2 flex flex-col justify-center items-center">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Total Funds</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {loading ? "Loading..." : `$${totalValue.toLocaleString()}`}
          </div>
        </CardContent>
      </div>

      {/* Right: Token List in Scrollable Area */}
      <div className="w-1/2">
        <ScrollArea className="h-40">
          {Object.entries(portfolio).map(([token, amount]) => {
            const price = prices[token] || 0;
            const value = amount * price;
            return (
              <Card
                key={token}
                className="flex justify-between items-center p-3 mb-2"
              >
                <div className="flex items-center space-x-3">
                  {tokenIcons[token]}
                  <div>
                    <p className="text-sm font-semibold">{token}</p>
                    <p className="text-xs text-gray-400">
                      {amount} {token}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">${value.toFixed(2)}</p>
                </div>
              </Card>
            );
          })}
        </ScrollArea>
      </div>
    </Card>
  );
}
