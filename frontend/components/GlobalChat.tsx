"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/** Ensure messages display properly */
export function GlobalChat() {
  const [messages, setMessages] = useState<
    { id: string; sender: string; text: string; timestamp: number }[]
  >([]);
  const [agentStarted, setAgentStarted] = useState(false);
  const [lastTimestamp, setLastTimestamp] = useState(0);

  /** Fetch only new messages */
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/globalChat?since=${lastTimestamp}`);
        const data = await response.json();

        if (!data.chat || data.chat.length === 0) {
          return;
        }

        setMessages((prev) => {
          const newMessages = data.chat.map((msg) => ({
            id: `${msg.id}-${msg.timestamp}`, // Ensure each message has a unique key
            sender: msg.sender,
            text: msg.message.replace(/\n/g, "  \n"), // Ensure newlines work in markdown
            timestamp: msg.timestamp,
          }));

          return [...prev, ...newMessages]; // Properly append new messages
        });

        setLastTimestamp(data.chat[data.chat.length - 1].timestamp);
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

  /** Format timestamps into readable times */
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="w-full lg:w-96 flex flex-col h-[400px] lg:h-screen">
      <CardHeader>
        <CardTitle>Global Chat</CardTitle>
      </CardHeader>

      <CardContent className="flex-grow overflow-hidden p-3">
        <ScrollArea className="h-full">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center">No messages yet...</p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="flex justify-end mb-4 mr-3">
                <div className="flex items-start flex-row-reverse">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                    <AvatarFallback>{msg.sender[0]}</AvatarFallback>
                  </Avatar>
                  <div className="mx-2 p-3 rounded-lg bg-secondary text-black max-w-xs text-sm">
                    <p className="text-base font-bold">
                      {msg.sender}{" "}
                      <span className="text-gray-500 text-xs italic font-medium pl-1">
                        {formatTimestamp(msg.timestamp)}
                      </span>
                    </p>
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
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
