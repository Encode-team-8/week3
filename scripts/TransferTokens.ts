import { ethers } from "ethers";
import { MyERC20Votes__factory } from "../typechain-types/factories/contracts/MyERC20Votes__factory";
require("dotenv").config();

const CONTRACT_ADDRESS = "0x4f0098aa358a89d50af9323c3130c12f0a26da1d";
const MINT_VALUE = ethers.utils.parseUnits("10");

async function main() {
  const provider = new ethers.providers.InfuraProvider(
    "sepolia",
    process.env.INFURA_API_KEY
  );
  const wallet1 = new ethers.Wallet(
    process.env.PRIVATE_KEY_ACC1 ?? "",
    provider
  );
  const wallet2 = new ethers.Wallet(
    process.env.PRIVATE_KEY_ACC2 ?? "",
    provider
  );

  const signer1 = wallet1.connect(provider);
  const signer2 = wallet2.connect(provider);

  const tokenFactory = new MyERC20Votes__factory(signer1);
  const tokenContract = tokenFactory.attach(CONTRACT_ADDRESS);

  const transferTx = await tokenContract
    .connect(signer1)
    .transfer(signer2.address, MINT_VALUE.div(2));
  console.log(
    `Address ${signer1.address} is transferring ${ethers.utils.formatUnits(
      MINT_VALUE.div(2)
    )} tokens to ${signer2.address}...\n\n`
  );
  await transferTx.wait();
  const votes1AfterTransfer = await tokenContract.getVotes(signer1.address);
  console.log(
    `Address ${signer1.address} has ${ethers.utils.formatUnits(
      votes1AfterTransfer
    )} voting power after transfer.\n\n`
  );
  const votes2AfterTransfer = await tokenContract.getVotes(signer2.address);
  console.log(
    `Address ${signer2.address} has ${ethers.utils.formatUnits(
      votes2AfterTransfer
    )} voting power after transfer.\n\n`
  );

  console.log(`Transfer Tx: ${transferTx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
