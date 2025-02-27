"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

export function GlobalChat() {
  const [messages, setMessages] = useState<
    { id: string; sender: string; text: string; timestamp: number }[]
  >([]);
  const [agentStarted, setAgentStarted] = useState(false);

  /** Subscribe to Firestore chat messages */
  useEffect(() => {
    const q = query(
      collection(db, "chatMessages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        sender: doc.data().sender,
        text: doc.data().message.replace(/\n/g, "  \n"), // Ensure newlines work in markdown
        timestamp: doc.data().timestamp,
      }));

      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, []);

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
    <Card className="w-full lg:w-1/3 flex flex-col h-[400px] lg:h-screen">
      <CardHeader className="p-5 pt-6">
        <CardTitle>Global Chat</CardTitle>
      </CardHeader>

      <CardContent className="flex-grow overflow-hidden p-4 pt-0">
        <ScrollArea className="h-full">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center">No messages yet...</p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="flex justify-start mb-4">
                <div className="flex items-start flex-row">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                    <AvatarFallback>
                      {msg.sender[0]}
                      {msg.sender[msg.sender.length - 1]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="mx-2 py-2 px-3 rounded-lg bg-secondary text-black max-w-xs text-sm relative">
                    <p className="text-base font-semibold">{msg.sender}</p>
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                    <span className="w-full flex justify-end text-muted-foreground text-xs">
                      {formatTimestamp(msg.timestamp)}
                    </span>
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
