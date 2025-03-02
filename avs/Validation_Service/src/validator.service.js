require('dotenv').config();
const dalService = require("./dal.service");
const oracleService = require("./oracle.service");
const allowedTokens = ["USDC", "WETH", "ETH", "BTC"];
const allowedPools = ["0x13C7a2C80304167C9494449edED13d177668AF75", "0xF778172389A7AC66E3989Fb2c8Ce127FdC3c58a3"];

async function validate(proofOfTask) {
  try {
      console.log("Validating Task");
      const taskResult = await dalService.getIPfsTask(proofOfTask);
      console.log(taskResult);
      let isApproved = false;

      const activity = taskResult.activity;
      const category = taskResult.category;
      const tokenA = taskResult.tokenA;
      const tokenB = taskResult.tokenB;
      const amountA = taskResult.amountA;
      const amountB = taskResult.amountB;
      const pool = taskResult.pool;
      const time = taskResult.time;

      // Check Validity of the Task Proof
      if(!activity || !category || !tokenA || !tokenB || !amountA || !amountB || !pool || !time) {
        
        return false;
      }
      console.log("Proof of Task Data Received")

      // Check if activity is 1
      if (activity !== 1) return false;

      // Check if category is between 1-3
      if (category < 1 || category > 3) return false;

      // Check if pools is in allowedPools
      if (!allowedPools.includes(pool)) return false;

      // Check if tokenA and tokenB are in allowedTokens
      if (!allowedTokens.includes(tokenA) || !allowedTokens.includes(tokenB)) return false;

      // Check if initiated time is less than one minute before
      const transactionTime = new Date(time).getTime();
      const currentTime = Date.now();
      if (currentTime - transactionTime > 60000) return false;

      console.log("Task Validation Successful");
      return true;
    } catch (err) {
      console.error(err?.message);
      return false;
    }
  }
  
  module.exports = {
    validate,
  }