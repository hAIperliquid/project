const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("BTCModule", (m) => {       
    const initialOwner = m.getParameter("initialOwner");

    // Deploy the Contract
    const token = m.contract("BTC", [initialOwner]);

    return { token };
});