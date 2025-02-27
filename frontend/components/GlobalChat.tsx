"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/** Ensure messages display properly */
export function GlobalChat() {
  const [messages, setMessages] = useState<
    { id: string; sender: string; text: string; timestamp: number }[]
  >([]);
  const [agentStarted, setAgentStarted] = useState(false);
  const [lastTimestamp, setLastTimestamp] = useState(0); // Track last received timestamp

  /** Fetch only new messages */
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        console.log("Fetching messages...");
        const response = await fetch(`/api/globalChat?since=${lastTimestamp}`);
        const data = await response.json();

        if (!data.chat || data.chat.length === 0) {
          console.warn("No new messages received.");
          return;
        }

        console.log("Fetched new messages:", data.chat);

        setMessages((prev) => {
          const newMessages = data.chat.map((msg) => ({
            id: `${msg.id}-${msg.timestamp}`, // Ensure each message has a unique key
            sender: msg.sender,
            text: msg.message, // Ensure correct field is used
            timestamp: msg.timestamp,
          }));

          console.log("Merging new messages:", newMessages);

          return [...prev, ...newMessages]; // Properly append new messages
        });

        setLastTimestamp(data.chat[data.chat.length - 1].timestamp); // Update last timestamp
      } catch (error) {
        console.error("Error fetching chat messages:", error);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [lastTimestamp]);

  /** Auto-start agent1 after 3s */
  useEffect(() => {
    if (!agentStarted) {
      const timer = setTimeout(async () => {
        console.log("Auto-starting agent1...");
        try {
          await fetch("/api/agent1/openPosition");
          setAgentStarted(true);
        } catch (error) {
          console.error("Error auto-starting agent1:", error);
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [agentStarted]);

  return (
    <Card className="w-full lg:w-96 flex flex-col h-[400px] lg:h-screen">
      <CardHeader>
        <CardTitle>Global Chat</CardTitle>
      </CardHeader>

      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center">No messages yet...</p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="flex justify-end mb-4">
                <div className="flex items-start flex-row-reverse">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                    <AvatarFallback>{msg.sender[0]}</AvatarFallback>
                  </Avatar>
                  <div className="mx-2 p-2 rounded-lg bg-secondary text-black max-w-xs">
                    <p className="text-xs font-semibold">
                      {msg.sender}{" "}
                      <span className="text-gray-500 text-[10px]">
                        ({format(new Date(msg.timestamp), "HH:mm")})
                      </span>
                    </p>
                    <p className="text-sm">{msg.text || "Message missing!"}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
