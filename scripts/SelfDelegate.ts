import { ethers } from "ethers";
import { MyERC20Votes__factory } from "../typechain-types/factories/contracts/MyERC20Votes__factory";
require("dotenv").config();

const CONTRACT_ADDRESS = "0x4f0098aa358a89d50af9323c3130c12f0a26da1d";

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

  const tokenFactory = new MyERC20Votes__factory(signer2);
  const tokenContract = tokenFactory.attach(CONTRACT_ADDRESS);

  const balanceBN = await tokenContract.balanceOf(signer2.address);
  console.log(
    `Address ${signer2.address} holds ${ethers.utils.formatUnits(
      balanceBN
    )} tokens.\n\n`
  );
  const votes = await tokenContract.getVotes(signer2.address);
  console.log(
    `Address ${signer2.address} has ${ethers.utils.formatUnits(
      votes
    )} voting power.\n\n`
  );
  // const delegateTx = await tokenContract
  //   .connect(signer2)
  //   .delegate(signer2.address);
  // console.log(
  //   `Address ${signer2.address} is self-delegating their tokens into votes...`
  // );
  // await delegateTx.wait();
  // const votesAfter = await tokenContract.getVotes(signer2.address);
  // console.log(
  //   `Address ${signer2.address} has ${ethers.utils.formatUnits(
  //     votesAfter
  //   )} voting power after self-delegating.\n\n`
  // );
  // console.log(`Delegate Tx: ${delegateTx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
