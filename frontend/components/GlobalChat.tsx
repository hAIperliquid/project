"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

export function GlobalChat({
  selectedAgent,
}: {
  selectedAgent: string | null;
}) {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /** ✅ Sends user message to API and updates chat */
  const sendMessage = async () => {
    if (input.trim() === "" || !selectedAgent || loading) return;

    const userMessage = { sender: "You", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`/api/chat/${selectedAgent}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          { sender: selectedAgent, text: data.response },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "System", text: "Error: Unable to get response" },
        ]);
      }
    } catch (error) {
      console.error("Chat API error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "System", text: "Error: Network issue" },
      ]);
    }

    setLoading(false);
  };

  /** ✅ Allows "Enter" key to send message */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /** ✅ Adjusts textarea height dynamically */
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        100
      )}px`;
    }
  }, [input]);

  return (
    <Card className="w-full lg:w-96 flex flex-col h-[400px] lg:h-screen">
      <CardHeader>
        <CardTitle>
          Global Chat {selectedAgent ? `with ${selectedAgent}` : ""}
        </CardTitle>
      </CardHeader>

      {/* Chat messages */}
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex mb-4 ${
                msg.sender === "You" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-start ${
                  msg.sender === "You" ? "flex-row-reverse" : ""
                }`}
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                  <AvatarFallback>{msg.sender[0]}</AvatarFallback>
                </Avatar>
                <div
                  className={`mx-2 p-2 rounded-lg ${
                    msg.sender === "You" ? "bg-secondary" : "bg-accent"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            </div>
          ))}
          {loading && <p className="text-gray-500">Waiting for response...</p>}
        </ScrollArea>
      </CardContent>

      {/* Input area */}
      <CardFooter className="flex flex-col space-y-2">
        <div className="flex w-full space-x-2 items-end">
          <Textarea
            ref={textareaRef}
            placeholder={
              selectedAgent ? "Type your message..." : "Select an agent to chat"
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!selectedAgent || loading}
            className="min-h-[40px] max-h-[100px] resize-none border-border shadow-md"
            rows={1}
          />
          <Button
            onClick={sendMessage}
            disabled={!selectedAgent || loading}
            className="h-10 w-10 p-2"
          >
            <Send className="h-5 w-5" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
