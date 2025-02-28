import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

/**
 * API route to send agent messages to Firestore.
 */
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ agent: string }> }
) {
  try {
    const { agent } = await context.params;

    if (!agent) {
      return NextResponse.json(
        { error: "Agent is required in the URL path" },
        { status: 400 }
      );
    }

    // Extract message payload
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Valid message is required" },
        { status: 400 }
      );
    }

    console.log(`✅ Storing message from ${agent}: ${message}`);

    // Store message in Firestore
    await addDoc(collection(db, "chatMessages"), {
      sender: agent,
      message,
      timestamp: serverTimestamp(),
    });

    return NextResponse.json({ status: "Message stored successfully." });
  } catch (error) {
    console.error("❌ Error storing agent message:", error);
    return NextResponse.json(
      { error: "Failed to store message", details: (error as Error).message },
      { status: 500 }
    );
  }
}
