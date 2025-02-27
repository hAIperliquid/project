import { NextRequest, NextResponse } from "next/server";
import { findBestUniswapPosition } from "@/lib/uniswap";

/**
 * Automatically finds the best Uniswap position and sends proposal.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { agent: string } }
) {
  try {
    const { agent } = await params;

    if (agent !== "agent1") {
      return NextResponse.json(
        { error: "Only agent1 can start the position" },
        { status: 403 }
      );
    }

    const position = await findBestUniswapPosition();
    if (position === "No liquidity pools found." || !position.pool) {
      return NextResponse.json(
        { error: "No suitable Uniswap position found." },
        { status: 404 }
      );
    }

    const proposalId = Math.floor(Math.random() * 1000) + 1;
    console.log(`Agent1 proposing Uniswap position ${proposalId}`);

    const API_BASE_URL =
      process.env.API_BASE_URL || "http://localhost:3000/api";

    await fetch(`${API_BASE_URL}/globalChat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: agent,
        message: `I propose to open a Uniswap position:\n${position.message}\nRequesting approval for Task Execution with ID: ${proposalId}`,
        proposalId,
      }),
    });

    // Sequential agent approval
    const approvingAgents = ["agent2", "agent3"];
    for (const [index, approvingAgent] of approvingAgents.entries()) {
      await new Promise((resolve) => setTimeout(resolve, (index + 1) * 3000)); // Delay between approvals
      console.log(`${approvingAgent} approving task ${proposalId}...`);

      await fetch(`${API_BASE_URL}/${approvingAgent}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: approvingAgent,
          message: `I approve Task Execution with ID: ${proposalId}.\nSignature: ************`,
        }),
      });
    }

    return NextResponse.json({
      message: "Proposal sent to global chat.",
      proposalId,
      position,
    });
  } catch (error) {
    console.error("Error in openPosition route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
