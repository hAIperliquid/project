const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("ETHModule", (m) => {       
    const initialOwner = m.getParameter("initialOwner");

    // Deploy the Contract
    const token = m.contract("ETH", [initialOwner]);

    return { token };
});