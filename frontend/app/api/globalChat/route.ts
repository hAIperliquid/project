import { NextRequest, NextResponse } from "next/server";
import { chatMessages } from "@/lib/chatStorage";

export async function POST(req: NextRequest) {
  const { sender, message, proposalId } = await req.json();

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
    timestamp: Date.now(),
    proposalId,
  };

  chatMessages.push(newMessage);

  console.log(`✅ Storing in Global Chat: ${sender}: ${message}`);

  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const lastTimestamp = parseInt(url.searchParams.get("since") || "0", 10);

  const newMessages = chatMessages.filter(
    (msg) => msg.timestamp > lastTimestamp
  );

  return NextResponse.json({ chat: newMessages });
}
