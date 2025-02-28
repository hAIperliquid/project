const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("TreasuryV2Module", (m) => {

  const treasury = m.contract("TreasuryV2", ["0xa304a1BB1e5964ff829e283090943b6ee0aF1191", "0x74EF2a3c2CC1446643Ab59e5b65dd86665521F1c"]);

  return { treasury };
});
