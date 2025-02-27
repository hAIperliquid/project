const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("MockAMMModule", (m) => {
  const tokenA = m.getParameter("tokenA");
  const tokenB = m.getParameter("tokenB");

  const mockAmm = m.contract("MockAMM", [tokenA, tokenB]);

  return { mockAmm };
});
