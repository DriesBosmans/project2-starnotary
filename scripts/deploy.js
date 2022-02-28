
const hre = require("hardhat");
const fs = require('fs');

async function main() {

  const StarNotary = await hre.ethers.getContractFactory("StarNotary");
  const starNotary = await StarNotary.deploy(); //pass arguments to constructor in contract

  await starNotary.deployed();

  console.log("starNotary deployed to:", starNotary.address);

  // this code writes the contract addresses to a local file named
  // config.js that we can use in the app
  fs.writeFileSync('./src/config.js', `
  export const contractAddress = "${starNotary.address}"
  export const ownerAddress = "${starNotary.signer.address}"
  `);
}



// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
