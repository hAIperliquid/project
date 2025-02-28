require('dotenv').config();
const dalService = require("./dal.service");
const oracleService = require("./oracle.service");

async function validate(proofOfTask) {

  try {
      const taskResult = await dalService.getIPfsTask(proofOfTask);
      let isApproved = false;

      const activity = taskResult.activity;
      const category = taskResult.category;
      const tokenA = taskResult.tokenA;
      const tokenB = taskResult.tokenB;
      const amountA = taskResult.amountA;
      const amountB = taskResult.amountB;
      const poolTVL = taskResult.poolTVL;

      // Check Validity of the Task Proof
      if(!activity || !category || !tokenA || !tokenB || !amountA || !amountB || !poolTVL){
        return false;
      }

      // Check whether category is True and is allowed
      // Currently Treasury Contract only allows two tasks for yield strategy (BTC-ETH) and (ETH-USDC)
      if(taskResult.category == 1){
        if(tokenA === "BTC" && tokenB === "ETH"){
          isApproved = true;
        }
      }
      else if(taskResult.category == 2){
        if(tokenA === "ETH" || tokenB === "USDC"){
          isApproved = true;
        }
      }
      return isApproved;
    } catch (err) {
      console.error(err?.message);
      return false;
    }
  }
  
  module.exports = {
    validate,
  }