"use client"
import {Web3} from 'web3';
import {ethers} from 'ethers';
import {useState, useEffect} from 'react';

import { TREASURY_ABI } from '@/utils/treasuryABI';
import { ERC20_ABI } from '@/utils/ERC20ABI';
import { BITCOIN_ADDRESS, ETHEREUM_ADDRESS, USDC_ADDRESS, PROTOCOL_TREASURY } from '@/constants/protocol';

export default function ContractRead() {
    const [bitcoinBalance, setBitcoinBalance] = useState("");
    const [userBitcoin, setUserBitcoin] = useState("");
    const [ethereumBalance, setEthereumBalance] = useState("");
    const [usdcBalance, setUsdcBalance] = useState("");




    async function getBitcoinBalance(){
        if(!process.env.NEXT_PUBLIC_RPC_URL){
            alert('Env Variables Not Complete')
            return;
        }
        const web3 = new Web3(process.env.NEXT_PUBLIC_RPC_URL);

        // DO THE SAME THING FOR ALL COIN, BUT CHANGE FROM BITCOIN_ADDRESS TO OTHER TOKEN
        const contract = new web3.eth.Contract(ERC20_ABI, BITCOIN_ADDRESS);
        const balance = await contract.methods.balanceOf(PROTOCOL_TREASURY).call();
        if(balance){
            const amount = Number(balance) / 10**18;
            setBitcoinBalance(amount.toString());
        }
    }

    async function getUserBitcoinBalance(){
        if(!process.env.NEXT_PUBLIC_RPC_URL){
            alert('Env Variables Not Complete')
            return;
        }
        const web3 = new Web3(process.env.NEXT_PUBLIC_RPC_URL);
        const contract =  new web3.eth.Contract(TREASURY_ABI, PROTOCOL_TREASURY);
        const balance = await contract.methods.getBalance(BITCOIN_ADDRESS, '0x74EF2a3c2CC1446643Ab59e5b65dd86665521F1c').call();
        if(balance){
            console.log(balance.toString());
            const amount = Number(balance) / 10**18;
            console.log(amount.toString());
            setUserBitcoin(amount.toString());
        }
    }

    return(
    <div className="flex flex-col">
        <p>Protocol's Bitcoin: {bitcoinBalance}</p>
        <p>User's Bitcoin: {userBitcoin}</p>
        <p>Protocol's Ethereum: {ethereumBalance}</p>
        <p>Protocol's USDC: {usdcBalance}</p>
        <button onClick={getBitcoinBalance}>Get Bitcoin Balance</button>
        <button onClick={getUserBitcoinBalance}>Get User Bitcoin Balance</button>
    </div>)
}