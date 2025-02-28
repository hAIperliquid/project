"use client";
import { useState, useEffect } from "react";
import Web3 from "web3";

import { TREASURY_ABI } from "@/utils/treasuryABI";
import { ERC20_ABI } from "@/utils/ERC20ABI";
import {
  BITCOIN_ADDRESS,
  ETHEREUM_ADDRESS,
  USDC_ADDRESS,
  PROTOCOL_TREASURY,
} from "@/constants/protocol";

export default function ContractRead() {
  const [balances, setBalances] = useState({
    bitcoin: "",
    ethereum: "",
    usdc: "",
    userBitcoin: "",
    userEthereum: "",
    userUsdc: "",
  });

  const getWeb3Instance = () => {
    if (!process.env.NEXT_PUBLIC_RPC_URL) {
      alert("Environment variables not set.");
      return null;
    }
    return new Web3(process.env.NEXT_PUBLIC_RPC_URL);
  };

  async function getTokenBalance(tokenAddress, key) {
    const web3 = getWeb3Instance();
    if (!web3) return;

    try {
      const contract = new web3.eth.Contract(ERC20_ABI, tokenAddress);
      const balance = await contract.methods
        .balanceOf(PROTOCOL_TREASURY)
        .call();
      if (balance) {
        setBalances((prev) => ({
          ...prev,
          [key]: (Number(balance) / 10 ** 18).toString(),
        }));
      }
    } catch (error) {
      console.error(`Error fetching ${key} balance:`, error);
    }
  }

  async function getUserBalance(tokenAddress, key) {
    const web3 = getWeb3Instance();
    if (!web3) return;

    try {
      const contract = new web3.eth.Contract(TREASURY_ABI, PROTOCOL_TREASURY);
      const balance = await contract.methods
        .getBalance(tokenAddress, "0x74EF2a3c2CC1446643Ab59e5b65dd86665521F1c")
        .call();
      if (balance) {
        setBalances((prev) => ({
          ...prev,
          [key]: (Number(balance) / 10 ** 18).toString(),
        }));
      }
    } catch (error) {
      console.error(`Error fetching ${key} balance:`, error);
    }
  }

  useEffect(() => {
    getTokenBalance(BITCOIN_ADDRESS, "bitcoin");
    getTokenBalance(ETHEREUM_ADDRESS, "ethereum");
    getTokenBalance(USDC_ADDRESS, "usdc");
  }, []);

  return (
    <div className="flex flex-col space-y-2">
      <p>Protocols Bitcoin: {balances.bitcoin}</p>
      <p>Users Bitcoin: {balances.userBitcoin}</p>
      <p>Protocols Ethereum: {balances.ethereum}</p>
      <p>Users Ethereum: {balances.userEthereum}</p>
      <p>Protocols USDC: {balances.usdc}</p>
      <p>Users USDC: {balances.userUsdc}</p>
      <button onClick={() => getTokenBalance(BITCOIN_ADDRESS, "bitcoin")}>
        Refresh Bitcoin Balance
      </button>
      <button onClick={() => getUserBalance(BITCOIN_ADDRESS, "userBitcoin")}>
        Get User Bitcoin Balance
      </button>
      <button onClick={() => getTokenBalance(ETHEREUM_ADDRESS, "ethereum")}>
        Refresh Ethereum Balance
      </button>
      <button onClick={() => getUserBalance(ETHEREUM_ADDRESS, "userEthereum")}>
        Get User Ethereum Balance
      </button>
      <button onClick={() => getTokenBalance(USDC_ADDRESS, "usdc")}>
        Refresh USDC Balance
      </button>
      <button onClick={() => getUserBalance(USDC_ADDRESS, "userUsdc")}>
        Get User USDC Balance
      </button>
    </div>
  );
}
