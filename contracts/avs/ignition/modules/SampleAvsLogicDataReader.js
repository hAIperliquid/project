const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("SampleAvsLogicDataReaderModule", (m) => {  

    // Deploy the Contract
    const sampleAvsLogicDataReader = m.contract("SampleAvsLogicDataReader", ['0x426b372645E195eaB6AEa117D106a9e2766F373e']);

    return { sampleAvsLogicDataReader };
});