"use strict";
const { Router } = require("express")
const CustomError = require("./utils/validateError");
const CustomResponse = require("./utils/validateResponse");
const oracleService = require("./oracle.service");
const dalService = require("./dal.service");
const { ethers, AbiCoder } = require('ethers');

const router = Router()

router.post("/execute", async (req, res) => {
    console.log("Task Execution Received");

    try {
        var taskDefinitionId = Number(req.body.taskDefinitionId) || 0;

        console.log("TESTING");
        const activity = 1;
        console.log("activity:", activity);
        const category = 1;
        console.log("category:", category);
        const tokenA = "BTC";
        console.log("tokenA:", tokenA);
        const tokenB = "ETH";
        console.log("tokenB:", tokenB);
        const amountA = 2000000000n;
        console.log("amountA:", amountA);
        const amountB = 2000000000n;
        console.log("amountB:", amountB);
        const time = new Date();

        console.log("activity:", activity);
        console.log("category:", category);
        console.log("tokenA:", tokenA);
        console.log("tokenB:", tokenB);
        console.log("amountA:", amountA);
        console.log("amountB:", amountB);

        const data = ethers.AbiCoder.defaultAbiCoder().encode(["uint8", "uint8", "uint256", "uint256"],[activity, category, amountA, amountB]);
        //const data = "hello";
        console.log("Encoded Data to Sign:", data);

        const result = {
            activity,
            category,
            tokenA,
            tokenB,
            time: time.toISOString(),
        }
        const cid = await dalService.publishJSONToIpfs(result);
        console.log("CID:", cid);
        await dalService.sendTask(cid, data, taskDefinitionId);
        return res.status(200).send(new CustomResponse({proofOfTask: cid, data: data, taskDefinitionId: taskDefinitionId}, "Task executed successfully"));
    } catch (error) {
        console.log(error)
        return res.status(500).send(new CustomError("Something went wrong", {}));
    }
})

module.exports = router
