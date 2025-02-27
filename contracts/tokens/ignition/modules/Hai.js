const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("HAIModule", (m) => {       
    const initialOwner = m.getParameter("initialOwner");

    // Deploy the Contract
    const token = m.contract("HAI", [initialOwner]);

    return { token };
});