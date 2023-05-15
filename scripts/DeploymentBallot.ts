import * as dotenv from "dotenv";
import { ethers } from "hardhat";
dotenv.config();

const PROPOSALS_MAP = ["Sugar", "Spice", "Everything Nice"];
const TARGET_BLOCK = 3491300;
const CONTRACT_ADDRESS = "0x4f0098aa358a89d50af9323c3130c12f0a26da1d";

async function main() {
  const provider = new ethers.providers.InfuraProvider(
    "sepolia",
    process.env.INFURA_API_KEY
  );
  const wallet = new ethers.Wallet(
    process.env.PRIVATE_KEY_ACC1 ?? "",
    provider
  );
  const signer = wallet.connect(provider);

  /**
   * Deploy ballot contract
   */
  const ballotFactory = await ethers.getContractFactory(
    "TokenizedBallot",
    signer
  );
  const ballotContract = await ballotFactory.deploy(
    PROPOSALS_MAP.map(ethers.utils.formatBytes32String),
    CONTRACT_ADDRESS,
    TARGET_BLOCK,
    { gasLimit: 20000000 }
  );
  const deployTx = await ballotContract.deployTransaction.wait();
  await ballotContract.deployed();
  console.log(
    `The ballot contract was deployed at the address ${ballotContract.address} at block ${deployTx.blockNumber}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
