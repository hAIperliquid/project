import { NextRequest, NextResponse } from "next/server";
import { findBestUniswapPosition } from "@/lib/uniswap";

/**
 * Automatically finds the best Uniswap position and sends proposal.
 */
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

    const position = await findBestUniswapPosition();
    if (position == "No liquidity pools found.") {
      return NextResponse.json(
        { error: "No suitable Uniswap position found." },
        { status: 404 }
      );
    }

    const proposalId = Math.floor(Math.random() * 1000) + 1;

    console.log(`🚀 agent1: Proposing Uniswap position ${proposalId}`);

    await fetch(`http://localhost:3000/api/globalChat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: agent,
        message: `I propose to open a Uniswap position:\n${position.message}\nRequesting approval for Task Execution with ID: ${proposalId}`,
        proposalId,
      }),
    });

    // ✅ Other agents approve in sequence (3s apart)
    const approvingAgents = ["agent2", "agent3"];
    approvingAgents.forEach((agent, index) => {
      setTimeout(async () => {
        console.log(`🤖 ${agent} is approving task ${proposalId}...`);
        await fetch(`http://localhost:3000/api/${agent}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sender: agent,
            message: `I approve Task Execution with ID: ${proposalId}.\nSignature: ************`,
          }),
        });
      }, (index + 1) * 3000);
    });

    return NextResponse.json({
      message: "Proposal sent to global chat.",
      proposalId,
      position,
    });
  } catch (error) {
    console.error("❌ Error in openPosition route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
