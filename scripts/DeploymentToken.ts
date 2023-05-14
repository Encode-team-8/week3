import * as dotenv from "dotenv";
import { ethers } from "hardhat";
dotenv.config();

async function main() {
  const provider = new ethers.providers.InfuraProvider(
    "sepolia",
    process.env.INFURA_API_KEY
  );
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);
  const signer = wallet.connect(provider);

  /**
   * Deploy token contract
   */
  const tokenFactory = await ethers.getContractFactory("MyERC20Votes", signer);
  const tokenContract = await tokenFactory.deploy({ gasLimit: 2000000 });
  const deployTx = await tokenContract.deployTransaction.wait();
  await tokenContract.deployed();
  console.log(
    `The token contract was deployed at the address ${tokenContract.address} at block ${deployTx.blockNumber}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
