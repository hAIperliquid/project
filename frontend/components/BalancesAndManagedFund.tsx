"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
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

export function BalancesAndManagedFund() {
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("USDC");

  const handleDeposit = () => {
    console.log(`Depositing ${amount} ${token}`);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl">Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col justify-center">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Total Value</span>
            </div>
            <div className="text-3xl font-bold">$12,358.72</div>
            <div className="flex items-center mt-1">
              <ArrowUpRight className="text-green-500 mr-1" size={14} />
              <span className="text-green-500 text-sm font-medium">+3.3%</span>
              <span className="text-xs text-muted-foreground ml-2">
                vs last week
              </span>
            </div>
          </div>

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
