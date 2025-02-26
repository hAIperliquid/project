"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Agents } from "@/components/Agents";
import { GlobalChat } from "@/components/GlobalChat";

export default function Home() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-3xl font-bold mb-6">hAIperliquid Dashboard</h1>
        <Agents onSelectAgent={setSelectedAgent} />
      </main>
      <GlobalChat selectedAgent={selectedAgent} />
    </div>
  );
}
