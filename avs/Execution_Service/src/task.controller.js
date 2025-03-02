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

        console.log("Accepting Task Execution Request");
        console.log(req.body);
        let activity = req.body.activity;
        let category = 1;
        let tokenA = req.body.tokenA;
        let tokenB = req.body.tokenB;
        let pool = req.body.pool;
        const amountA = 2000000000n;
        const amountB = 2000000000n;
        const time = new Date();

        console.log("activity:", activity);
        console.log("category:", category);
        console.log("tokenA:", tokenA);
        console.log("tokenB:", tokenB);
        console.log("amountA:", amountA);
        console.log("amountB:", amountB);

        // Add Encoded Tx Details to Sign
        const data = ethers.AbiCoder.defaultAbiCoder().encode(["uint8", "uint8", "uint256", "uint256"],[activity, category, amountA, amountB]);
        console.log("Encoded Data to Sign:", data);

        const result = {
            activity,
            category,
            tokenA,
            tokenB,
            amountA: amountA.toString(),
            amountB: amountB.toString(),
            time: time.toISOString(),
            pool,
        }
        console.log("Uploaded Data to IPFS:", result);
        const cid = await dalService.publishJSONToIpfs(result);
        console.log("CID:", cid);
        await dalService.sendTask(cid, data, taskDefinitionId);
        return res.status(200).send(new CustomResponse({proofOfTask: cid, data: data, taskDefinitionId: taskDefinitionId}, "Task executed successfully"));
    } catch (error) {
        console.log(error)
        return res.status(500).send(new CustomError("Something went wrong", {}));
    }
})

router.post("/badexecution", async (req, res) => {
    console.log("Executing task");

    try {
        var taskDefinitionId = Number(req.body.taskDefinitionId) || 0;
        console.log(`taskDefinitionId: ${taskDefinitionId}`);

        const result = await oracleService.getPrice("ETHUSDT");
        result.price = 0;
        const cid = await dalService.publishJSONToIpfs(result);
        const data = "hello";
        await dalService.sendTask(cid, data, taskDefinitionId);
        return res.status(200).send(new CustomResponse({proofOfTask: cid, data: data, taskDefinitionId: taskDefinitionId}, "Task executed successfully"));
    } catch (error) {
        console.log(error)
        return res.status(500).send(new CustomError("Something went wrong", {}));
    }
})

router.get("/hello", async (req, res) => {
    return res.status(200).send(new CustomResponse({}, "Hello from execution service"));
})

module.exports = router
