const hre = require("hardhat");
//const SampleAvsLogicCounterModule = require("../ignition/modules/SampleAvsLogicCounter.js");
//const SampleAvsLLogicDataReaderModule = require("../ignition/modules/SampleAvsLogicDataReader.js");
const haiperliquidAvsLogicModule = require("../ignition/modules/HAIperliquidAvsLogic");

async function main() {
    // Deploy HAI Token
    const {haiperliquidAvsLogic} = await hre.ignition.deploy(haiperliquidAvsLogicModule);

    // Fetch the Token Address
    const contractAddress = await haiperliquidAvsLogic.getAddress();
    console.log(`hAIperliquid AVS Data Deployed: ${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
      console.error(error);
      process.exit(1);
  });


// Deployment:
// npx hardhat run scripts/deploy.js --network polygonAmoy

// Treasury deployed: 0xC289d9d42A4d10D0E84e82D7Aa23d28F0Cab2d0d

// AVS Logic Deployed: 0x86F619b22AbBe87eD15AC942017f58e479bf9D6f
// AVS Logic Data Reader Deployed: 0xB8c3AA6aD5D412b5C683B331a0b5EFbf2984C70c
// hAIperliquid AVS Data Deployed: 0xa304a1BB1e5964ff829e283090943b6ee0aF1191

// Contract Verify:
// npx hardhat verify --network polygonAmoy 0xa304a1BB1e5964ff829e283090943b6ee0aF1191 0x426b372645E195eaB6AEa117D106a9e2766F373e 0xC289d9d42A4d10D0E84e82D7Aa23d28F0Cab2d0d 0x74EF2a3c2CC1446643Ab59e5b65dd86665521F1c