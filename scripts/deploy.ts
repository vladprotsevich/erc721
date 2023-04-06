import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();
  const MyNft = await ethers.getContractFactory("MyNFT", signer);

  // Start deployment, returning a promise that resolves to a contract object
  const myNFT = await MyNft.deploy()
  await myNFT.deployed()
  console.log("Contract deployed to address:", myNFT.address)  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
