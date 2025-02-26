"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const agentNames = ["agent1", "agent2", "agent3"];

export function GlobalChat() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const sender = agentNames[Math.floor(Math.random() * agentNames.length)];
      const text = `Message from ${sender}: ${Math.random()
        .toString(36)
        .substring(7)}`;
      setMessages((prev) => [...prev, { sender, text }]);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="w-full lg:w-96 flex flex-col h-[400px] lg:h-screen">
      <CardHeader>
        <CardTitle>Global Chat</CardTitle>
      </CardHeader>

      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4">
          {messages.map((msg, index) => (
            <div key={index} className="flex mb-4 justify-start">
              <div className="flex items-start">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                  <AvatarFallback>{msg.sender[0]}</AvatarFallback>
                </Avatar>
                <div className="mx-2 p-2 rounded-lg bg-accent">
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
