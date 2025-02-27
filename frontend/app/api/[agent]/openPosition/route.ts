import { NextRequest, NextResponse } from "next/server";
import { findBestUniswapPositions } from "@/lib/uniswap";

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

    const { topPoolsMessage, bestPoolMessage, bestPool } =
      await findBestUniswapPositions();

    if (!bestPool) {
      return NextResponse.json(
        { error: "No suitable Uniswap position found." },
        { status: 404 }
      );
    }

    const proposalId = Math.floor(Math.random() * 1000) + 1;

    console.log(`🚀 agent1: Proposing Uniswap position ${proposalId}`);

    // Send top pools message
    await fetch(`${process.env.BASE_URL}/api/globalChat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: agent,
        message: topPoolsMessage,
        proposalId,
      }),
    });

    // Send best pool selection message
    await fetch(`${process.env.BASE_URL}/api/globalChat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: agent,
        message: bestPoolMessage,
        proposalId,
      }),
    });

    console.log(`✅ Sent messages for proposal ${proposalId}`);

    // ✅ Ensure agent2 & agent3 approvals are properly queued
    const approvingAgents = ["agent2", "agent3"];
    approvingAgents.forEach((approvingAgent, index) => {
      setTimeout(async () => {
        console.log(`🤖 ${approvingAgent} is approving task ${proposalId}...`);
        await fetch(`${process.env.BASE_URL}/api/${approvingAgent}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sender: approvingAgent,
            message: `I approve Task Execution with ID: ${proposalId}.\nSignature: ************`,
            proposalId,
          }),
        });
      }, (index + 1) * 3000); // Delay approvals for clarity
    });

    return NextResponse.json({
      message: "Proposal sent to global chat.",
      proposalId,
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
