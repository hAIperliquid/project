const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("USDTModule", (m) => {       
    const initialOwner = m.getParameter("initialOwner");

    // Deploy the Contract
    const token = m.contract("USDT", [initialOwner]);

    return { token };
});