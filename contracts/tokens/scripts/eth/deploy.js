const hre = require("hardhat");

const ETHModule = require("../../ignition/modules/ETH.js");

async function main() {
    // Deploy Mock Bitcoin Token
    const {token} = await hre.ignition.deploy(ETHModule, {
        parameters: {ETHModule: {initialOwner: "0x74EF2a3c2CC1446643Ab59e5b65dd86665521F1c"}}
    });

    // Fetch the Token Address
    const contractAddress = await token.getAddress();
    console.log(`Mock ETH Token deployed: ${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
      console.error(error);
      process.exit(1);
  });