import { ethers } from "hardhat";
import { TokenizedBallot__factory } from "../typechain-types/factories/contracts/TokenizedBallot.sol/TokenizedBallot__factory";
require("dotenv").config();

const BALLOT_ADDRESS = "0xAD21b9F74993F8DBf4028e06b9C4d9FC03f9D537";

async function main() {
  const provider = new ethers.providers.InfuraProvider(
    "sepolia",
    process.env.INFURA_API_KEY
  );
  const wallet1 = new ethers.Wallet(
    process.env.PRIVATE_KEY_ACC1 ?? "",
    provider
  );

  const signer1 = wallet1.connect(provider);

  const tokenizedBallotFactory = new TokenizedBallot__factory(signer1);
  const tokenizedBallotContract = tokenizedBallotFactory.attach(BALLOT_ADDRESS);
  const deployedProposals = await tokenizedBallotContract.getProposals();
  console.log(
    `Latest ballot numbers:\n${deployedProposals
      .map((proposal, i) => `  Prop ${i + 1}: ${proposal.join(" -- ")}\n`)
      .join("")}\n`
  );
  const getCurrentLeader = await tokenizedBallotContract.winningProposal();

  console.log(
    `Proposal ${getCurrentLeader.add(1)} is currently leading the vote.`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
