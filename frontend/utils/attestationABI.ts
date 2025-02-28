export const ATTESTATION_ABI = [
    {
        "inputs": [],
        "name": "numOfTotalOperators",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "numOfActiveOperators",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "taskNumber",
        "outputs": [
          {
            "internalType": "uint32",
            "name": "",
            "type": "uint32"
          }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "baseRewardFee",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    // Get Payment Details of an Operator
    {
        "inputs": [
          { "internalType": "uint256", "name": "_operatorId", "type": "uint256" }
        ],
        "name": "getOperatorPaymentDetail",
        "outputs": [
          {
            "components": [
              { "internalType": "address", "name": "operator", "type": "address" },
              { "internalType": "uint256", "name": "lastPaidTaskNumber", "type": "uint256" },
              { "internalType": "uint256", "name": "feeToClaim", "type": "uint256" },
              { "internalType": "uint8", "name": "paymentStatus", "type": "uint8" }
            ],
            "internalType": "struct AttestationCenter.PaymentDetails",
            "name": "",
            "type": "tuple"
          }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    // Request Payment for an operator
    {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_operatorId",
            "type": "uint256"
          }
        ],
        "name": "requestPayment",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    // Set AVS Logic
    {
        "inputs": [
          {
            "internalType": "contract IAvsLogic",
            "name": "_avsLogic",
            "type": "address"
          }
        ],
        "name": "setAvsLogic",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },

]