"use client";

import { useEffect, useState } from "react";
import { getUserBalance } from "@/lib/web3";
import { getTokenPrices } from "@/lib/coingecko";
import {
  BITCOIN_ADDRESS,
  ETHEREUM_ADDRESS,
  USDC_ADDRESS,
} from "@/constants/protocol";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DollarSign, Bitcoin } from "lucide-react";
import { EthereumIcon } from "./ui/EthereumIcon";

const userAddress = "0x74EF2a3c2CC1446643Ab59e5b65dd86665521F1c";

export function FundPortfolio() {
  const [balances, setBalances] = useState({ BTC: "0", ETH: "0", USDC: "0" });
  const [prices, setPrices] = useState({ BTC: 0, ETH: 0, USDC: 1 });

  useEffect(() => {
    async function fetchData() {
      const [btc, eth, usdc] = await Promise.all([
        getUserBalance(BITCOIN_ADDRESS, userAddress),
        getUserBalance(ETHEREUM_ADDRESS, userAddress),
        getUserBalance(USDC_ADDRESS, userAddress),
      ]);
      setBalances({ BTC: btc, ETH: eth, USDC: usdc });

      const pricesData = await getTokenPrices();
      setPrices(pricesData);
    }

    fetchData();
  }, []);

  /** Calculate total portfolio value */
  const totalValue =
    parseFloat(balances.BTC) * prices.BTC +
    parseFloat(balances.ETH) * prices.ETH +
    parseFloat(balances.USDC);

  return (
    <Card className="mb-4 p-5 flex flex-row">
      <div className="w-1/2 flex flex-col justify-center items-center">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">User Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            $
            {totalValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </CardContent>
      </div>

      <div className="w-1/2">
        <ScrollArea className="h-full">
          {Object.entries(balances).map(([token, amount]) => {
            const price = prices[token] || 0;
            const value = parseFloat(amount) * price;
            return (
              <Card
                key={token}
                className="flex justify-between items-center p-3 mb-2"
              >
                <div className="flex items-center space-x-3">
                  {token === "BTC" ? (
                    <Bitcoin size={20} />
                  ) : token === "ETH" ? (
                    <EthereumIcon size={20} />
                  ) : (
                    <DollarSign size={20} />
                  )}
                  <div>
                    <p className="text-sm font-semibold">{token}</p>
                    <p className="text-xs text-gray-400">
                      {parseFloat(amount).toLocaleString(undefined)} {token}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">
                    $
                    {value.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </Card>
            );
          })}
        </ScrollArea>
      </div>
    </Card>
  );
}
