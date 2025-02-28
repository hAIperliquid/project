"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BarChart2, Trophy } from "lucide-react";

const agentData = [
  {
    name: "agent1",
    avatar: "/chillguy.png",
    performance: "+12.5%",
    trades: 156,
    winRate: "68%",
    specialty: "Trend Following",
  },
  {
    name: "agent2",
    avatar: "/sadpepe.jpg",
    performance: "+8.7%",
    trades: 420,
    winRate: "72%",
    specialty: "Mean Reversion",
  },
  {
    name: "agent3",
    avatar: "/dogwifhat.jpg",
    performance: "+15.2%",
    trades: 69,
    winRate: "65%",
    specialty: "Arbitrage",
  },
];

export function Agents() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Agents</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {agentData.map((agent) => (
          <Card
            key={agent.name}
            className={
              "hover:shadow-lg overflow-hidden relative ring-1 ring-primary shadow-lg"
            }
          >
            <div className="relative">
              <div className={"h-16 bg-primary"}></div>
              <Avatar className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-24 h-24 border-4 border-background z-10">
                <AvatarImage
                  src={agent.avatar}
                  alt={agent.name}
                  className="object-cover w-full h-full"
                />
                <AvatarFallback>
                  {agent.name[0]}
                  {agent.name[agent.name.length - 1]}
                </AvatarFallback>
              </Avatar>
              <div className="absolute top-2 right-2 bg-background rounded-full p-1 shadow-md">
                <Trophy className="text-yellow-500 w-4 h-4" />
                <span className="absolute top-full left-1/2 transform -translate-x-1/2 text-xs font-bold mt-1 bg-background px-1 rounded">
                  {agent.winRate}
                </span>
              </div>
            </div>
            <CardHeader className="pt-14 text-center flex flex-col justify-center items-center">
              <h3 className="text-xl font-semibold z-20">{agent.name}</h3>
              <Badge
                variant="secondary"
                className="mt-2 text-center justify-center w-fit rounded-full"
              >
                {agent.specialty}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-center flex justify-around flex-wrap gap-4">
                <div className="flex flex-col items-center">
                  <TrendingUp className="text-green-500 mb-1" />
                  <div className="text-sm font-medium">Performance</div>
                  <div className="text-lg font-bold text-green-500">
                    {agent.performance}
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <BarChart2 className="text-blue-500 mb-1" />
                  <div className="text-sm font-medium">Trades</div>
                  <div className="text-lg font-bold">{agent.trades}</div>
                </div>
              </div>
            </CardContent>
            <div className="absolute inset-0 bg-primary opacity-10 pointer-events-none"></div>
          </Card>
        ))}
      </div>
    </div>
  );
}
