import { ethers } from "hardhat";
import { MyERC20Votes__factory } from "../typechain-types";
import { TokenizedBallot__factory } from "./../typechain-types/factories/contracts/TokenizedBallot.sol/TokenizedBallot__factory";

const MINT_VALUE = ethers.utils.parseUnits("10");
const PROPOSALS_MAP = ["Sugar", "Spice", "Everything Nice"];
const TARGET_BLOCK = 10;

async function main() {
  const [deployer, acc1, acc2] = await ethers.getSigners();
  const contractFactory = new MyERC20Votes__factory(deployer);
  const contract = await contractFactory.deploy();
  const receipt = await contract.deployTransaction.wait();
  console.log(
    `Contract: ${contract.address} at Block ${receipt.blockNumber}.\n\n`
  );

  const mintTx = await contract.mint(acc1.address, MINT_VALUE);
  const mintTxReceipt = await mintTx.wait();
  console.log(
    `Minted: ${ethers.utils.formatUnits(MINT_VALUE)} tokens to ${
      acc1.address
    } at Block ${mintTxReceipt.blockNumber}.\n\n`
  );
  const balanceBN = await contract.balanceOf(acc1.address);
  console.log(
    `Address ${acc1.address} holds ${ethers.utils.formatUnits(
      balanceBN
    )} tokens.\n\n`
  );
  const votes = await contract.getVotes(acc1.address);
  console.log(
    `Address ${acc1.address} has ${ethers.utils.formatUnits(
      votes
    )} voting power.\n\n`
  );
  const delegateTx = await contract.connect(acc1).delegate(acc1.address);
  await delegateTx.wait();
  const votesAfter = await contract.getVotes(acc1.address);
  console.log(
    `Address ${acc1.address} has ${ethers.utils.formatUnits(
      votesAfter
    )} voting power after self-delegating.\n\n`
  );
  const transferTx = await contract
    .connect(acc1)
    .transfer(acc2.address, MINT_VALUE.div(2));
  await transferTx.wait();
  const votes1AfterTransfer = await contract.getVotes(acc1.address);
  console.log(
    `Address ${acc1.address} is transferring ${ethers.utils.formatUnits(
      MINT_VALUE.div(2)
    )} tokens to ${acc2.address}.\n\n`
  );
  console.log(
    `Address ${acc1.address} has ${ethers.utils.formatUnits(
      votes1AfterTransfer
    )} voting power after transfer.\n\n`
  );
  const votes2AfterTransfer = await contract.getVotes(acc2.address);
  console.log(
    `Address ${acc2.address} has ${ethers.utils.formatUnits(
      votes2AfterTransfer
    )} voting power after transfer.\n\n`
  );
  const votes2Delegate = await contract.connect(acc2).delegate(acc2.address);
  await votes2Delegate.wait();
  const votes2AfterDelegate = await contract.getVotes(acc2.address);
  console.log(
    `Address ${acc2.address} has ${ethers.utils.formatUnits(
      votes2AfterDelegate
    )} voting power after self-delegating.\n\n`
  );
  const tokenizedBallotFactory = new TokenizedBallot__factory(deployer);
  const tokenizeBallotContract = await tokenizedBallotFactory.deploy(
    PROPOSALS_MAP.map(ethers.utils.formatBytes32String),
    contract.address,
    TARGET_BLOCK
  );
  const tokenizedBallotContractTx = await tokenizeBallotContract.deployed();

  const deployedProposals = await tokenizedBallotContractTx.getProposals();
  console.log(
    `Ballot polling after deployment:\n -- ${deployedProposals.join("\n -- ")}`
  );
}
main().catch((err) => {
  console.log(err);
  process.exitCode = 1;
});
