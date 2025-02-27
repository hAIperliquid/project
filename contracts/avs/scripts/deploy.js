const hre = require("hardhat");
const SampleAvsLogicCounterModule = require("../ignition/modules/SampleAvsLogicCounter.js");

async function main() {
    // Deploy HAI Token
    const {sampleAvsLogicCounter} = await hre.ignition.deploy(SampleAvsLogicCounterModule);

    // Fetch the Token Address
    const contractAddress = await sampleAvsLogicCounter.getAddress();
    console.log(`AVS Logic Deployed: ${contractAddress}`);

    // // Define the amount to mint (e.g., 1,000,000 tokens with 18 decimals)
    // const mintAmount = hre.ethers.utils.parseUnits("1000000", 18);

    // // Automatically mint tokens to the owner address
    // const tx = await token.mint("0x74EF2a3c2CC1446643Ab59e5b65dd86665521F1c", mintAmount);
    // await tx.wait();

    // console.log(`Minted ${mintAmount.toString()} tokens to the owner.`);
    
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

// AVS Logic Deployed: 0x86F619b22AbBe87eD15AC942017f58e479bf9D6f

// Contract Verify:
// npx hardhat verify --network polygonAmoy 0x86F619b22AbBe87eD15AC942017f58e479bf9D6f 0x426b372645E195eaB6AEa117D106a9e2766F373e