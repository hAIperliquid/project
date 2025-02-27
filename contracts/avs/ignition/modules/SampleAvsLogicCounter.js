const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("SampleAvsLogicCounterModule", (m) => {  

    // Deploy the Contract
    const sampleAvsLogicCounter = m.contract("SampleAvsLogicCounter", ['0x426b372645E195eaB6AEa117D106a9e2766F373e']);

    return { sampleAvsLogicCounter };
});