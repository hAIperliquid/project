const hre = require("hardhat");

const MockAmmV2Model = require("../ignition/modules/MockAmmV2.js");
const AmmETHUSDCModule = require("../ignition/modules/AmmETHUSDC.js");

async function main() {
    // Mock Token Addresses
    const USDT = '0x0504eF1192366Ac7Bf90c03964C53358C172A1A6'
    const USDC = '0x69E91edE2DD58542f560ec976C160e37C8C256FB'
    const BTC = '0x39683204f4822A75A3264a9e6583e9105fAD3fAc'
    const ETH = '0x88ad8906909211929a71fE5A070e651b588D98e4'
    
    // const {mockAmm: BTC_ETH } = await hre.ignition.deploy(MockAmmV2Model, {
    //     parameters: {MockAmmV2Model: {tokenA: BTC, tokenB: ETH}}
    // });

    // const BTC_ETH_ADDRESS = await BTC_ETH.getAddress();
    // console.log(`BTC_ETH Pool deployed: ${BTC_ETH_ADDRESS}`);

    const {mockAmm: ETH_USDC} = await hre.ignition.deploy(AmmETHUSDCModule, {
        parameters: {AmmETHUSDCModule: {tokenA: ETH, tokenB: USDC}}
    });
    const ETH_USDC_ADDRESS = await ETH_USDC.getAddress();
    console.log(`ETH_USDC Pool deployed: ${ETH_USDC_ADDRESS}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
      console.error(error);
      process.exit(1);
  });


// Deployment:
// npx hardhat run scripts/deploy.js --network polygonAmoy

// Pool Addresses:
// BTC_ETH Pool deployed: 0x13C7a2C80304167C9494449edED13d177668AF75
// ETH_USDC Pool deployed: 0xF778172389A7AC66E3989Fb2c8Ce127FdC3c58a3



// Contract Verify:
// npx hardhat verify --network polygonAmoy 0x13C7a2C80304167C9494449edED13d177668AF75 0x39683204f4822A75A3264a9e6583e9105fAD3fAc 0x88ad8906909211929a71fE5A070e651b588D98e4
// npx hardhat verify --network polygonAmoy 0xF778172389A7AC66E3989Fb2c8Ce127FdC3c58a3 0x88ad8906909211929a71fE5A070e651b588D98e4 0x69E91edE2DD58542f560ec976C160e37C8C256FB


// npx hardhat verify --contract contracts/USDT.sol:USDT --network polygonAmoy 0x0504eF1192366Ac7Bf90c03964C53358C172A1A6 0x74EF2a3c2CC1446643Ab59e5b65dd86665521F1c



// Pool Addresses:
// (V1) Mock BTC-USDT Pool deployed: 0xAdc2743E7C1ef414f08FbC595D991c437B5FEaD7