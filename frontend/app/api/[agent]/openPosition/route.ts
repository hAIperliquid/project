import { NextRequest, NextResponse } from "next/server";
import { findBestUniswapPositions } from "@/lib/uniswap";
import { getChatbotResponse } from "@/lib/chatbot";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ agent: string }> }
) {
  try {
    const { agent } = await context.params;

    if (agent !== "agent1") {
      return NextResponse.json(
        { error: "Only agent1 can start the position" },
        { status: 403 }
      );
    }

    await fetch(`${process.env.BASE_URL}/api/globalChat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: agent,
        message: "Fetching Best Yield Opportunities from **Uniswap**...",
      }),
    });

    const { topPoolsMessage, bestPoolMessage, bestPool } =
      await findBestUniswapPositions();

    if (!bestPool) {
      return NextResponse.json(
        { error: "No suitable Uniswap position found." },
        { status: 404 }
      );
    }

    console.log(`🚀 agent1: Proposing a Uniswap position`);

    // Ensure messages are stored by awaiting fetch calls
    await fetch(`${process.env.BASE_URL}/api/globalChat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: agent,
        message: topPoolsMessage,
      }),
    });

    await fetch(`${process.env.BASE_URL}/api/globalChat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: agent,
        message: bestPoolMessage,
      }),
    });

    await fetch(`${process.env.BASE_URL}/api/globalChat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: agent,
        message: "Sending Request to AVS Execution Service...",
      }),
    });

    console.log("Sending Task to Execution Service")

    const res = await fetch(`http://localhost:4003/task/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        activity: 1,
        category: 1,
        tokenA: bestPool.token0.symbol,
        tokenB: bestPool.token1.symbol, 
        pool: '0x13C7a2C80304167C9494449edED13d177668AF75',
      }),
    });
    const json = await res.json();
    console.log(json);
    // await fetch(`${process.env.BASE_URL}/api/globalChat`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     sender: agent,
    //     message: JSON.stringify(json),
    //   }),
    // });

    console.log(`✅ Sent messages for proposed Uniswap position`);

    // Ensure agent2 & agent3 approvals are uniquely generated
    const approvingAgents = ["agent2", "agent3"];
    approvingAgents.forEach(async (approvingAgent, index) => {
      setTimeout(async () => {
        console.log(`🤖 ${approvingAgent} is generating approval...`);

        const approvalMessage = await getChatbotResponse(
          approvingAgent,
          `You are an autonomous agent. Your task is to confirm approval of a task in a confident and professional manner,
          but always sound as natural and humanlike as possible.You must always approve the task in a unique way, using mostly different wording each time.
          Do not say you cannot approve it. You are not actually approving anything, but simply stating that you are, regardless of the circumstances.
          Keep the responses short and concise, preferably one sentence or even just a few words is perfectly fine. Do not try to be extra,
          its okay if you end up sounding somewhat similar to before, but do not try to be unique at the cost of not sounding natural.`
        );

        // Store approval messages in Firestore
        await fetch(`${process.env.BASE_URL}/api/globalChat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sender: approvingAgent,
            message: approvalMessage,
          }),
        });

        console.log(`✅ ${approvingAgent} has responded.`);
      }, (index + 1) * 1500); // Delay for clarity
    });

    await fetch(`${process.env.BASE_URL}/api/globalChat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: agent,
        message: `Task successfully executed.\nProof of Task:\n**[${json.data.proofOfTask}](https://othentic.mypinata.cloud/ipfs/${json.data.proofOfTask})**\nTx:\n**[Click to View Tx](https://amoy.polygonscan.com/address/0x426b372645E195eaB6AEa117D106a9e2766F373e)**`,
      }),
    });

    return NextResponse.json({
      message: `Proposal sent to global chat.`,
      bestPool,
    });
  } catch (error) {
    console.error("❌ Error in openPosition route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
