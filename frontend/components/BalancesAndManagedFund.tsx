"use client";

import { useEffect, useState } from "react";
import { getTokenBalance } from "@/lib/web3";
import { getTokenPrices } from "@/lib/coingecko";
import {
  BITCOIN_ADDRESS,
  ETHEREUM_ADDRESS,
  USDC_ADDRESS,
} from "@/constants/protocol";
import { ExternalLink, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TREASURY_CONTRACT_URL =
  "https://amoy.polygonscan.com/address/0xC289d9d42A4d10D0E84e82D7Aa23d28F0Cab2d0d";

export function BalancesAndManagedFund() {
  const [totalAUM, setTotalAUM] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("USDC");

  useEffect(() => {
    async function fetchData() {
      const [btc, eth, usdc] = await Promise.all([
        getTokenBalance(BITCOIN_ADDRESS),
        getTokenBalance(ETHEREUM_ADDRESS),
        getTokenBalance(USDC_ADDRESS),
      ]);

      const pricesData = await getTokenPrices();

      const totalValue =
        parseFloat(btc) * pricesData.BTC +
        parseFloat(eth) * pricesData.ETH +
        parseFloat(usdc);

      setTotalAUM(totalValue.toFixed(2));
    }

    fetchData();
  }, []);

  const handleDeposit = () => {
    console.log(`Depositing ${amount} ${token}`);
  };

  return (
    <Card className="mb-6 relative">
      <CardHeader className="flex gap-2 flex-row items-center">
        <CardTitle className="text-xl">Protocol Total AUM</CardTitle>
        <div className="text-muted-foreground text-xs flex items-center space-x-1">
          <a
            href={TREASURY_CONTRACT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 hover:text-blue-500 transition duration-150"
          >
            <span>View Treasury</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: AUM Overview */}
          <div className="flex flex-col justify-center">
            <div className="text-3xl font-bold">
              {totalAUM !== null
                ? `$${parseFloat(totalAUM).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                : "Loading..."}
            </div>
            <div className="flex items-center mt-1">
              <ArrowUpRight className="text-green-500 mr-1" size={14} />
              <span className="text-green-500 text-sm font-medium">+3.3%</span>
              <span className="text-xs text-muted-foreground ml-2">
                vs last week
              </span>
            </div>
          </div>

          {/* Right: Deposit Section */}
          <div className="flex flex-col justify-center">
            <div className="flex space-x-2 mb-2">
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-grow"
              />
              <Select value={token} onValueChange={setToken}>
                <SelectTrigger className="w-[100px] border-0 ring-0 shadow-none focus:ring-0 focus:shadow-none">
                  <SelectValue placeholder="Token" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USDC">USDC</SelectItem>
                  <SelectItem value="BTC">BTC</SelectItem>
                  <SelectItem value="ETH">ETH</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleDeposit} className="w-full text-black">
              Deposit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
