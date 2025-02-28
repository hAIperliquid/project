const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("TreasuryModule", (m) => {

  const treasury = m.contract("Treasury", ["0x74EF2a3c2CC1446643Ab59e5b65dd86665521F1c", "0x74EF2a3c2CC1446643Ab59e5b65dd86665521F1c"]);

  return { treasury };
});
