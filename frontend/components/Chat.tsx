"use client";

import { useState } from "react";

const agents = ["agent1", "agent2", "agent3"]; // Define available agents

export default function Chat() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string>(agents[0]); // Default to first agent

  const sendMessage = async () => {
    if (!selectedAgent || input.trim() === "") return;

    setMessages((prev) => [
      ...prev,
      { sender: `You (to ${selectedAgent})`, text: input },
    ]);
    setLoading(true);

    try {
      const response = await fetch(`/api/chat/${selectedAgent}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      if (typeof data.response !== "string") {
        console.warn("Unexpected response from server:", data);
        setMessages((prev) => [
          ...prev,
          { sender: selectedAgent, text: "Received invalid response." },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: selectedAgent, text: data.response },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: selectedAgent, text: "Error occurred." },
      ]);
    }

    setLoading(false);
    setInput("");
  };

  return (
    <div className="m-10 bg-white shadow-lg rounded-lg p-5">
      <h2 className="text-xl font-semibold mb-4">Global Chat</h2>

      {/* Dropdown for selecting the agent */}
      <select
        className="w-full p-2 border rounded mb-4"
        value={selectedAgent}
        onChange={(e) => setSelectedAgent(e.target.value)}
      >
        {agents.map((agent) => (
          <option key={agent} value={agent}>
            {agent}
          </option>
        ))}
      </select>

      {/* Chat messages */}
      <div className="h-80 overflow-y-auto border p-2 rounded">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-6 ${
              msg.sender.startsWith("You")
                ? "text-right bg-zinc-200 p-3 rounded-xl"
                : ""
            }`}
          >
            <strong>{msg.sender}: </strong> {msg.text}
          </div>
        ))}
        {loading && <div className="text-gray-500">Bot is typing...</div>}
      </div>

      {/* Input field */}
      <div className="flex mt-4">
        <input
          type="text"
          className="flex-grow p-2 border rounded-l"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-r"
          onClick={sendMessage}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
