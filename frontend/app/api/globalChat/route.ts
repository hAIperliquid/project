import { NextResponse } from "next/server";

// ✅ Global chat message storage (should be stored in a DB eventually)
const chatMessages: {
  id: number;
  sender: string;
  message: string;
  timestamp: number;
}[] = [];

export async function POST(req: Request) {
  const { sender, message } = await req.json();

  if (!sender || !message) {
    return NextResponse.json(
      { error: "Missing sender or message" },
      { status: 400 }
    );
  }

  const newMessage = {
    id: chatMessages.length + 1,
    sender,
    message,
    timestamp: Date.now(), // ✅ Store when message was received
  };

  chatMessages.push(newMessage);

  console.log(`✅ Storing in Global Chat: ${sender}: ${message}`);

  return NextResponse.json({ success: true });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const lastTimestamp = parseInt(url.searchParams.get("since") || "0", 10);

  // ✅ Only return messages that were sent **after** the last known timestamp
  const newMessages = chatMessages.filter(
    (msg) => msg.timestamp > lastTimestamp
  );

  return NextResponse.json({ chat: newMessages });
}
