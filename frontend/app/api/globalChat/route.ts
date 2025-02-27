import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
  serverTimestamp,
} from "firebase/firestore";

/**
 * Store a new chat message in Firestore.
 */
export async function POST(req: NextRequest) {
  try {
    const { sender, message } = await req.json();

    if (!sender || !message) {
      return NextResponse.json(
        { error: "Missing sender or message" },
        { status: 400 }
      );
    }

    console.log(`Storing message from ${sender}: ${message}`);

    await addDoc(collection(db, "chatMessages"), {
      sender,
      message,
      timestamp: serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error storing message:", error);
    return NextResponse.json(
      { error: "Failed to store message" },
      { status: 500 }
    );
  }
}

/**
 * Fetch all messages from Firestore in order.
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const lastTimestamp = parseInt(url.searchParams.get("since") || "0", 10);

    const q = query(
      collection(db, "chatMessages"),
      where("timestamp", ">", lastTimestamp),
      orderBy("timestamp", "asc")
    );

    const querySnapshot = await getDocs(q);
    const messages = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ chat: messages });
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
