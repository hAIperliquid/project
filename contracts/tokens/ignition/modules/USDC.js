const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("USDCModule", (m) => {       
    const initialOwner = m.getParameter("initialOwner");

    // Deploy the Contract
    const token = m.contract("USDC", [initialOwner]);

    return { token };
});