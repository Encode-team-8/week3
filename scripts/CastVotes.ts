import { ethers } from "hardhat";
import { TokenizedBallot__factory } from "../typechain-types/factories/contracts/TokenizedBallot.sol/TokenizedBallot__factory";
require("dotenv").config();

const BALLOT_ADDRESS = "0xAD21b9F74993F8DBf4028e06b9C4d9FC03f9D537";

// should only succeed if votes have been delegated and is target block from ballot deploy has already passed
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

  const tokenizedBallotFactory = new TokenizedBallot__factory(signer1);

  const tokenizedBallotContract = tokenizedBallotFactory.attach(BALLOT_ADDRESS);
  console.log(
    `Attached to Ballot contract at ${tokenizedBallotContract.address}`
  );

  const firstVoterFirstVote = await tokenizedBallotContract
    .connect(signer1)
    .vote(0, 15, { gasLimit: 20000000 });

  console.log(
    `Address ${signer1.address} used 7 votes on Proposal 1.\nVote Tx: ${firstVoterFirstVote.hash}\n\n`
  );
  const firstVoterSecondVoteTx = await tokenizedBallotContract
    .connect(signer1)
    .vote(1, 8, { gasLimit: 20000000 });
  console.log(
    `Address ${signer1.address} used remaining 8 votes on Proposal 2.\nVote Tx: ${firstVoterSecondVoteTx.hash}\n\n`
  );
  const secondVoterFirstVoteTx = await tokenizedBallotContract
    .connect(signer2)
    .vote(2, 5, { gasLimit: 20000000 });
  console.log(
    `Address ${signer2.address} used all 5 votes on Proposal 3.\nVote Tx: ${secondVoterFirstVoteTx.hash}\n\n`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
