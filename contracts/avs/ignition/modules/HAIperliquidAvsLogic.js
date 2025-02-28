const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("haiperliquidAvsLogicModule", (m) => {  

    // Deploy the Contract
    const haiperliquidAvsLogic = m.contract("HAIperliquidAvsLogic", ['0x426b372645E195eaB6AEa117D106a9e2766F373e', '0xC289d9d42A4d10D0E84e82D7Aa23d28F0Cab2d0d', '0x74EF2a3c2CC1446643Ab59e5b65dd86665521F1c']);

    return { haiperliquidAvsLogic };
});