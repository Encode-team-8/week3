import * as dotenv from "dotenv";
import { ethers } from "hardhat";
import { MyERC20Token__factory } from "./../typechain-types/factories/contracts/MyERC20Token__factory";
dotenv.config();

const CONTRACT_ADDRESS = "0x4f0098aa358a89d50af9323c3130c12f0a26da1d";
const MINT_VALUE = ethers.utils.parseUnits("10");

async function main() {
  const provider = new ethers.providers.InfuraProvider(
    "sepolia",
    process.env.INFURA_API_KEY
  );
  const wallet = new ethers.Wallet(
    process.env.PRIVATE_KEY_ACC1 ?? "",
    provider
  );
  console.log(`Using wallet address ${wallet.address}...`);

  const signer = wallet.connect(provider);

  const tokenFactory = new MyERC20Token__factory(signer);
  const tokenContract = tokenFactory.attach(CONTRACT_ADDRESS);

  console.log(
    `Minting ${ethers.utils.formatUnits(MINT_VALUE)} tokens to ${
      wallet.address
    }...`
  );
  const tx = await tokenContract
    .connect(signer)
    .mint(wallet.address, MINT_VALUE, { gasLimit: 200000 });
  const txReceipt = await tx.wait();

  console.log(
    `Minted ${ethers.utils.formatUnits(MINT_VALUE)} tokens to ${
      wallet.address
    } at transaction ${tx.hash}.`
  );
}

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});
