"use client"
import {Web3} from 'web3';
import {ethers} from 'ethers';
import {useState, useEffect} from 'react';

import { ATTESTATION_CENTER } from '@/constants/protocol';
import { ATTESTATION_ABI } from '@/utils/attestationABI';


export default function Web3JSTesting() {
    const [data, setData] = useState("");
    const [taskNumber, setTaskNumber] = useState("");
    const [baseFee, setBaseFee] = useState("");

    async function fetchData(){
        console.log(process.env.NEXT_PUBLIC_RPC_URL);
        console.log(process.env.NEXT_PUBLIC_PRIVATE_KEY);
        if(!process.env.NEXT_PUBLIC_RPC_URL || !process.env.NEXT_PUBLIC_PRIVATE_KEY){
            alert('Env Variables Not Complete')
            return;
        }
        // delay 2 seconds
        console.log("Running Fetch Data")
        await new Promise(resolve => setTimeout(resolve, 2000));

        const web3 = new Web3(process.env.NEXT_PUBLIC_RPC_URL);
        const abi =  ['function createNewTaskDefinition(string,(uint256,uint256,uint256,uint256,uint256,uint256,uint256[])) external']; 
        
        const sender = web3.eth.accounts.wallet.add(process.env.NEXT_PUBLIC_PRIVATE_KEY)[0];
        console.log(sender);
        if(!sender){
            alert('Invalid Private Key');
            return;
        }

        const balance = await web3.eth.getBalance(sender.address);
        if(!balance){
            alert('Invalid Balance');
            return;
        }
        console.log('Balance is:', balance.toString());
        setData(balance.toString());
    
    }

    async function getNumOfOperators(){
        if(!process.env.NEXT_PUBLIC_RPC_URL){
            alert('Env Variables Not Complete')
            return;
        }
        const web3 = new Web3(process.env.NEXT_PUBLIC_RPC_URL);
        const contract = new web3.eth.Contract(ATTESTATION_ABI, ATTESTATION_CENTER);
    
        const numOfOperators = await contract.methods.numOfActiveOperators().call();
        console.log(numOfOperators);
    }

    async function getTaskNumber(){
        if(!process.env.NEXT_PUBLIC_RPC_URL){
            alert('Env Variables Not Complete')
            return;
        }
        const web3 = new Web3(process.env.NEXT_PUBLIC_RPC_URL);
        const contract = new web3.eth.Contract(ATTESTATION_ABI, ATTESTATION_CENTER);
    
       const taskNumber = await contract.methods.taskNumber().call();
       if(!taskNumber){
        alert("AVS Tasks Not Found");
        return;
       }
       console.log(taskNumber);
       setTaskNumber(taskNumber.toString());
    }

    async function getBaseFee(){
        if(!process.env.NEXT_PUBLIC_RPC_URL){
            alert('Env Variables Not Complete')
            return;
        }
        console.log("Getting Base Fee")
        const web3 = new Web3(process.env.NEXT_PUBLIC_RPC_URL);
        const contract = new web3.eth.Contract(ATTESTATION_ABI, ATTESTATION_CENTER);
    
        const baseRewardFee = await contract.methods.baseRewardFee().call();
        console.log("Base Reward Fee:", baseFee);
        if(!baseRewardFee){
            console.log("Base Fee Not Found");
            return;
        }
        setBaseFee(baseRewardFee.toString());
    }

    async function getOperator(){
        const web3 = new Web3(process.env.NEXT_PUBLIC_RPC_URL);
        const contract = new web3.eth.Contract(ATTESTATION_ABI, ATTESTATION_CENTER);
        console.log("Trying to call Attestation Center")
        const operatorPaymentDetails = await contract.methods.getOperatorPaymentDetail(4).call();
        console.log(operatorPaymentDetails);
    }

    async function requestPayment(){
        if(!process.env.NEXT_PUBLIC_MULTISIG_PRIVATE_KEY){
            alert('Env Variables Not Complete')
            return;
        }
        const web3 = new Web3(process.env.NEXT_PUBLIC_RPC_URL);
        const contract = new web3.eth.Contract(ATTESTATION_ABI, ATTESTATION_CENTER);
        const sender = web3.eth.accounts.wallet.add(process.env.NEXT_PUBLIC_MULTISIG_PRIVATE_KEY)[0];
        const nonce = await web3.eth.getTransactionCount(sender.address, 'pending');
        console.log("Sender:", sender.address);
        console.log("Nonce:", nonce);  
        

        // console.log("Trying to call Attestation Center")
        // const operatorPaymentDetails = await contract.methods.requestPayment(4).send({from: sender.address});
        // console.log(operatorPaymentDetails);

        const tx = {
            from: sender.address,
            to: ATTESTATION_CENTER,
            data: contract.methods.requestPayment(4).encodeABI(),
            gas: 300000,
            gasPrice: await web3.eth.getGasPrice(),
            nonce: nonce,
        };
        console.log(tx);
        console.log("Signing & Sending Transaction");
        const signedTx = await web3.eth.accounts.signTransaction(tx, process.env.NEXT_PUBLIC_MULTISIG_PRIVATE_KEY);
        console.log(signedTx);
        const otherSigned = sender.signTransaction(tx);
        console.log(otherSigned);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log(receipt);
    }

    async function setAvsLogic(){
        if(!process.env.NEXT_PUBLIC_PRIVATE_KEY){
            alert('Env Variables Not Complete')
            return;
        }
        const web3 = new Web3(process.env.NEXT_PUBLIC_RPC_URL);
        const contract = new web3.eth.Contract(ATTESTATION_ABI, ATTESTATION_CENTER);
        const sender = web3.eth.accounts.wallet.add(process.env.NEXT_PUBLIC_PRIVATE_KEY)[0];

        const tx = {
            from: sender.address,
            to: ATTESTATION_CENTER,
            data: contract.methods.setAvsLogic('0xa304a1BB1e5964ff829e283090943b6ee0aF1191').encodeABI(),
            gas: 300000,
            gasPrice: await web3.eth.getGasPrice(),
        };
        console.log(tx);
        console.log("Signing & Sending Transaction");
        const signedTx = await web3.eth.accounts.signTransaction(tx, process.env.NEXT_PUBLIC_PRIVATE_KEY);
        console.log(signedTx);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log(receipt);
    }

    useEffect(()=>{
        fetchData();
        getTaskNumber();
        getBaseFee();
        //getOperator();
    }, [])
    
    
    return(
    <div className="flex flex-col">
        <p>Data: {data}</p>
        <p>Task Number: {taskNumber}</p>
        <p>Base Reward Fee: {baseFee}</p>
        <button onClick={getOperator}>Get Operator</button>   
        <button onClick={requestPayment}>Request Payment</button>
        <button onClick={setAvsLogic}>Set AVS Logic</button>
    </div>)


}