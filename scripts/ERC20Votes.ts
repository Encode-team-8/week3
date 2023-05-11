import { ethers } from "hardhat";
import { MyERC20Votes__factory } from "../typechain-types";

const MINT_VALUE = ethers.utils.parseUnits("10");

async function main() {
  const [deployer, acc1, acc2] = await ethers.getSigners();
  const contractFactory = new MyERC20Votes__factory(deployer);
  const contract = await contractFactory.deploy();
  const receipt = await contract.deployTransaction.wait();
  console.log(`Contract: ${contract.address} at Block ${receipt.blockNumber}`);

  const mintTx = await contract.mint(acc1.address, MINT_VALUE);
  const mintTxReceipt = await mintTx.wait();
  console.log(
    `Minted: ${ethers.utils.formatUnits(MINT_VALUE)} tokens to ${
      acc1.address
    } at Block ${mintTxReceipt.blockNumber}`
  );
  const balanceBN = await contract.balanceOf(acc1.address);
  console.log(
    `Address ${acc1.address} holds ${ethers.utils.formatUnits(
      balanceBN
    )} tokens.`
  );
  const votes = await contract.getVotes(acc1.address);
  console.log(
    `Address ${acc1.address} has ${ethers.utils.formatUnits(votes)} votes.`
  );
  const delegateTx = await contract.connect(acc1).delegate(acc1.address);
  await delegateTx.wait();
  const votesAfter = await contract.getVotes(acc1.address);
  console.log(
    `Address ${acc1.address} has ${ethers.utils.formatUnits(
      votesAfter
    )} votes after self-delegating.`
  );
  const transferTx = await contract
    .connect(acc1)
    .transfer(acc2.address, MINT_VALUE.div(2));
  await transferTx.wait();
  const votes1AfterTransfer = await contract.getVotes(acc1.address);
  console.log(
    `Address ${acc1.address} has ${ethers.utils.formatUnits(
      votes1AfterTransfer
    )} votes after transferring tokens.`
  );
  const votes2AfterTransfer = await contract.getVotes(acc2.address);
  console.log(
    `Address ${acc2.address} has ${ethers.utils.formatUnits(
      votes2AfterTransfer
    )} after transfer`
  );
  const votes2Delegate = await contract.connect(acc2).delegate(acc2.address);
  await votes2Delegate.wait();
  const votes2AfterDelegate = await contract.getVotes(acc2.address);
  console.log(
    `Address ${acc2.address} has ${ethers.utils.formatUnits(
      votes2AfterDelegate
    )} votes after self-delegating.`
  );
}

main().catch((err) => {
  console.log(err);
  process.exitCode = 1;
});
