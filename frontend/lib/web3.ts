import Web3 from "web3";
import { ERC20_ABI } from "@/utils/ERC20ABI";
import { TREASURY_ABI } from "@/utils/treasuryABI";
import { PROTOCOL_TREASURY } from "@/constants/protocol";

const getWeb3Instance = () => {
  if (!process.env.NEXT_PUBLIC_RPC_URL) {
    alert("Environment variables not set.");
    return null;
  }
  return new Web3(process.env.NEXT_PUBLIC_RPC_URL);
};

export const getTokenBalance = async (tokenAddress: string) => {
  const web3 = getWeb3Instance();
  if (!web3) return "0";

  try {
    const contract = new web3.eth.Contract(ERC20_ABI, tokenAddress);
    const balance = await contract.methods.balanceOf(PROTOCOL_TREASURY).call();
    return (Number(balance) / 10 ** 18).toString();
  } catch (error) {
    console.error(`Error fetching protocol balance:`, error);
    return "0";
  }
};

export const getUserBalance = async (
  tokenAddress: string,
  userAddress: string
) => {
  const web3 = getWeb3Instance();
  if (!web3) return "0";

  try {
    const contract = new web3.eth.Contract(TREASURY_ABI, PROTOCOL_TREASURY);
    const balance = await contract.methods
      .getBalance(tokenAddress, userAddress)
      .call();
    return (Number(balance) / 10 ** 18).toString();
  } catch (error) {
    console.error(`Error fetching user balance:`, error);
    return "0";
  }
};
