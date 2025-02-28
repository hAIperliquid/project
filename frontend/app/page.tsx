"use client";

import { BalancesAndManagedFund } from "@/components/BalancesAndManagedFund";
import { FundPortfolio } from "@/components/FundPortfolio";
import { Agents } from "@/components/Agents";
import { GlobalChat } from "@/components/GlobalChat";
import ContractRead from "@/components/testing/ContractRead";
import Web3JSTesting from "@/components/testing/Web3JS";

export default function Home() {
  return (
    <div className="flex h-screen">
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-3xl font-bold mb-6">hAIperliquid Dashboard</h1>
        <BalancesAndManagedFund />
        <FundPortfolio />
        <Agents />
        <ContractRead />
        <Web3JSTesting />
      </main>
      <GlobalChat />
    </div>
  );
}
