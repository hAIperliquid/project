const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("MockAmmV2Model", (m) => {
  const tokenA = m.getParameter("tokenA");
  const tokenB = m.getParameter("tokenB");

  const mockAmm = m.contract("MockAmmV2", [tokenA, tokenB]);

  return { mockAmm };
});
