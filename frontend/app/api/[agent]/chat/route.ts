import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
} from "firebase/firestore";

// import { getChatbotResponse } from "@/lib/chatbot";

// export async function POST(
//   req: NextRequest,
//   context: { params: Promise<{ agent: string }> }
// ) {
//   try {
//     const { agent } = await context.params;

//     const { message } = await req.json();

//     if (!message) {
//       return NextResponse.json(
//         { error: "Message is required" },
//         { status: 400 }
//       );
//     }

//     const response = await getChatbotResponse(agent, message);

//     if (typeof response !== "string") {
//       console.warn("Unexpected chatbot response:", response);
//       return NextResponse.json({ response: "Sorry, I couldn't process that." });
//     }

//     return NextResponse.json({ response });
//   } catch (error) {
//     console.error("Error in chatbot route:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

/**
 * API route to send agent messages to Firestore.
 */
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ agent: string }> }
) {
  try {
    const { agent } = await context.params;
    const { message, proposalId } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    console.log(`✅ Storing message from ${agent}: ${message}`);

    await addDoc(collection(db, "chatMessages"), {
      sender: agent,
      message,
      proposalId,
      timestamp: Date.now(),
    });

    return NextResponse.json({ status: "Message stored successfully." });
  } catch (error) {
    console.error("❌ Error storing agent message:", error);
    return NextResponse.json(
      { error: "Failed to store message" },
      { status: 500 }
    );
  }
}
