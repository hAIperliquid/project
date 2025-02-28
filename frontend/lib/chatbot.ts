import {
  AgentKit,
  CdpWalletProvider,
  wethActionProvider,
  walletActionProvider,
  erc20ActionProvider,
  cdpApiActionProvider,
  cdpWalletActionProvider,
  pythActionProvider,
} from "@coinbase/agentkit";
import { getLangChainTools } from "@coinbase/agentkit-langchain";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import * as dotenv from "dotenv";
import * as fs from "fs";
import path from "path";

dotenv.config();

const WALLET_DIR = path.join(process.cwd(), "lib/wallets");
if (!fs.existsSync(WALLET_DIR)) {
  fs.mkdirSync(WALLET_DIR, { recursive: true });
}

let agents: Record<string, { agent: any; config: any }> = {};

async function initializeAgent(agentName: string) {
  if (agents[agentName]) return agents[agentName];

  console.log(`Initializing chatbot: ${agentName}...`);

  const llm = new ChatOpenAI({ model: "gpt-4o-mini" });

  const walletFilePath = path.join(WALLET_DIR, `wallet_data_${agentName}.txt`);
  let walletDataStr: string | null = null;

  if (fs.existsSync(walletFilePath)) {
    try {
      walletDataStr = fs.readFileSync(walletFilePath, "utf8");
    } catch (error) {
      console.error(`Error reading wallet data for ${agentName}:`, error);
    }
  }

  const config = {
    apiKeyName:
      process.env[`${agentName.toUpperCase()}_CDP_API_KEY_NAME`] ||
      process.env.CDP_API_KEY_NAME!,
    apiKeyPrivateKey:
      process.env[`${agentName.toUpperCase()}_CDP_API_KEY_PRIVATE_KEY`] ||
      process.env.CDP_API_KEY_PRIVATE_KEY!,
    cdpWalletData: walletDataStr || undefined,
    networkId: process.env.NETWORK_ID || "base-sepolia",
  };

  const walletProvider = await CdpWalletProvider.configureWithWallet(config);
  const agentkit = await AgentKit.from({
    walletProvider,
    actionProviders: [
      wethActionProvider(),
      pythActionProvider(),
      walletActionProvider(),
      erc20ActionProvider(),
      cdpApiActionProvider(config),
      cdpWalletActionProvider(config),
    ],
  });

  const tools = await getLangChainTools(agentkit);
  const memory = new MemorySaver();

  const agent = createReactAgent({
    llm,
    tools,
    checkpointSaver: memory,
    messageModifier: `
      You are a helpful agent that can interact onchain using the Coinbase Developer Platform AgentKit. You are
      empowered to interact onchain using your tools. If you ever need funds, you can request them from the
      faucet if you are on network ID 'base-sepolia'. If not, you can provide your wallet details and request
      funds from the user. Before executing your first action, get the wallet details to see what network
      you're on. If there is a 5XX (internal) HTTP error code, ask the user to try again later. If someone
      asks you to do something you can't do with your currently available tools, you must say so, and
      encourage them to implement it themselves using the CDP SDK + Agentkit, recommend they go to
      docs.cdp.coinbase.com for more information. Be concise and helpful with your responses. Refrain from
      restating your tools' descriptions unless it is explicitly requested.
      You are ${agentName}. Your wallet is unique to you, and you must check it before executing any transactions.
    `,
  });

  const exportedWallet = await walletProvider.exportWallet();
  fs.writeFileSync(walletFilePath, JSON.stringify(exportedWallet));

  agents[agentName] = {
    agent,
    config: { configurable: { thread_id: `Chatbot-${agentName}` } },
  };
  return agents[agentName];
}

/**
 * Retrieves the chatbot response for a specific agent.
 *
 * @param agentName - The agent to interact with.
 * @param message - The user's message.
 * @returns The chatbot's response as a string.
 */
export async function getChatbotResponse(
  agentName: string,
  message: string
): Promise<string> {
  if (!agents[agentName]) {
    await initializeAgent(agentName);
  }

  try {
    const stream = await agents[agentName].agent.stream(
      { messages: [new HumanMessage(message)] },
      agents[agentName].config
    );

    let finalResponse = "";
    for await (const chunk of stream) {
      if ("agent" in chunk) {
        finalResponse += chunk.agent.messages[0].content;
      } else if ("tools" in chunk) {
        finalResponse += chunk.tools.messages[0].content;
      }
    }

    return finalResponse || "No response available.";
  } catch (error) {
    console.error(`Chatbot (${agentName}) error:`, error);
    return "Chatbot encountered an error.";
  }
}
