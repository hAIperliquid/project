import { NextRequest, NextResponse } from "next/server";
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

const chatMessages: { sender: string; message: string; proposalId?: number }[] =
  [];

/**
 * Allows an agent to send a message to the global chat.
 */
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ agent: string }> }
) {
  try {
    const { agent } = await context.params;
    const { message, proposalId } = await req.json();

    console.log(`✅ Storing message from ${agent}: ${message}`);

    chatMessages.push({ sender: agent, message, proposalId });

    // ✅ Also store in global chat API
    await fetch(`http://localhost:3000/api/globalChat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender: agent, message, proposalId }),
    });

    return NextResponse.json({ status: "Message stored successfully." });
  } catch (error) {
    console.error("❌ Error in agent chat route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
