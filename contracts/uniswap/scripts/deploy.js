const hre = require("hardhat");

const MockAMMModule = require("../ignition/modules/MockAMM.js");

async function main() {
    // Mock Token Addresses
    const USDT = '0x0504eF1192366Ac7Bf90c03964C53358C172A1A6'
    const BTC = '0x39683204f4822A75A3264a9e6583e9105fAD3fAc'
    const ETH = '0x88ad8906909211929a71fE5A070e651b588D98e4'
    
    // Deploy Mock AMM Pool
    // const {mockAmm: btc_usdt_pool } = await hre.ignition.deploy(MockAMMModule, {
    //     parameters: {MockAMMModule: {tokenA: BTC, tokenB: USDT}}
    // });

    // const btc_usdt_pool_address = await btc_usdt_pool.getAddress();
    // console.log(`Mock AMM Pool deployed: ${btc_usdt_pool_address}`);

    const {mockAmm: btc_usdt_pool } = await hre.ignition.deploy(MockAMMModule, {
        parameters: {MockAMMModule: {tokenA: BTC, tokenB: USDT}}
    });

    const btc_usdt_pool_address = await btc_usdt_pool.getAddress();
    console.log(`Mock AMM Pool deployed: ${btc_usdt_pool_address}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
      console.error(error);
      process.exit(1);
  });


// Deployment:
// npx hardhat run scripts/deploy.js --network polygonAmoy

// Contract Verify:
// npx hardhat verify --network polygonAmoy 0xAdc2743E7C1ef414f08FbC595D991c437B5FEaD7 0x39683204f4822A75A3264a9e6583e9105fAD3fAc 0x0504eF1192366Ac7Bf90c03964C53358C172A1A6

// npx hardhat verify --contract contracts/USDT.sol:USDT --network polygonAmoy 0x0504eF1192366Ac7Bf90c03964C53358C172A1A6 0x74EF2a3c2CC1446643Ab59e5b65dd86665521F1c

// Pool Addresses:
// Mock BTC-USDT Pool deployed: 0xAdc2743E7C1ef414f08FbC595D991c437B5FEaD7





// HAI Token deployed: 0x5E559412a9Ea6552829ee8E833bF4947b2e1DdD0
// Mock BTC Token deployed: 0x39683204f4822A75A3264a9e6583e9105fAD3fAc
// Mock ETH Token deployed: 0x88ad8906909211929a71fE5A070e651b588D98e4
// Mock USDT Token deployed: 0x0504eF1192366Ac7Bf90c03964C53358C172A1A6


// USA Token deployed: 0x5E559412a9Ea6552829ee8E833bF4947b2e1DdD0