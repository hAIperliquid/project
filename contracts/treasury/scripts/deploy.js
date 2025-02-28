const hre = require("hardhat");

const TreasuryModule = require("../ignition/modules/Treasury");

async function main() {
  

    const {treasury} = await hre.ignition.deploy(TreasuryModule);
    const treasuryAddress = await treasury.getAddress();
    console.log(`Treasury deployed: ${treasuryAddress}`);
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


// Contract Verify:
// npx hardhat verify --network polygonAmoy 0xC289d9d42A4d10D0E84e82D7Aa23d28F0Cab2d0d 0x74EF2a3c2CC1446643Ab59e5b65dd86665521F1c 0x74EF2a3c2CC1446643Ab59e5b65dd86665521F1c
// npx hardhat verify --network polygonAmoy 0xF778172389A7AC66E3989Fb2c8Ce127FdC3c58a3 0x88ad8906909211929a71fE5A070e651b588D98e4 0x69E91edE2DD58542f560ec976C160e37C8C256FB


// npx hardhat verify --contract contracts/USDT.sol:USDT --network polygonAmoy 0x0504eF1192366Ac7Bf90c03964C53358C172A1A6 0x74EF2a3c2CC1446643Ab59e5b65dd86665521F1c


