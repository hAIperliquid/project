const hre = require("hardhat");

const HAIModule = require("../ignition/modules/Hai.js");

async function main() {
    // Deploy HAI Token
    const {token} = await hre.ignition.deploy(HAIModule, {
        parameters: {HAIModule: {initialOwner: "0x74EF2a3c2CC1446643Ab59e5b65dd86665521F1c"}}
    });

    // Fetch the Token Address
    const contractAddress = await token.getAddress();
    console.log(`USA Token deployed: ${contractAddress}`);

    // Define the amount to mint (e.g., 1,000,000 tokens with 18 decimals)
    const mintAmount = hre.ethers.utils.parseUnits("1000000", 18);

    // Automatically mint tokens to the owner address
    const tx = await token.mint("0x74EF2a3c2CC1446643Ab59e5b65dd86665521F1c", mintAmount);
    await tx.wait();

    console.log(`Minted ${mintAmount.toString()} tokens to the owner.`);
    
    // // Use The Existing Token Address From V1 Deployment
    // const contractAddress = '0x2EF308295579A58E1B95cD045B7af2f9ec7931f8'

    // if(contractAddress) {
    //     // Deploy Network State Contract
    //     const {networkState} = await hre.ignition.deploy(NetworkStateModule, {
    //         parameters: {NetworkStateModule: {contractAddress}}
    //     });
    //     console.log(`Network State Contract deployed: ${await networkState.getAddress()}`);
    // }else{
    //     console.log("USA Token not found!");
    // }
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
// npx hardhat verify --network polygonAmoy 0x5E559412a9Ea6552829ee8E833bF4947b2e1DdD0 0x74EF2a3c2CC1446643Ab59e5b65dd86665521F1c

// npx hardhat verify --contract contracts/USDC.sol:USDC --network polygonAmoy 0x69E91edE2DD58542f560ec976C160e37C8C256FB 0x74EF2a3c2CC1446643Ab59e5b65dd86665521F1c


// HAI Token deployed: 0x5E559412a9Ea6552829ee8E833bF4947b2e1DdD0
// Mock BTC Token deployed: 0x39683204f4822A75A3264a9e6583e9105fAD3fAc
// Mock ETH Token deployed: 0x88ad8906909211929a71fE5A070e651b588D98e4
// Mock USDT Token deployed: 0x0504eF1192366Ac7Bf90c03964C53358C172A1A6
// Mock USDC Token deployed: 0x69E91edE2DD58542f560ec976C160e37C8C256FB

// USA Token deployed: 0x5E559412a9Ea6552829ee8E833bF4947b2e1DdD0