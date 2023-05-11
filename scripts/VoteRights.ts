import * as dotenv from 'dotenv';
import { ethers } from 'hardhat';
import { Ballot__factory } from '../typechain-types';
dotenv.config();

async function main() {
  const args = process.argv.slice(2);
  const addressToGiveVote = args[0];

  const CONTRACT_ADDRESS = '0x9B41bc4De53eC3E7ac104015D25e4cA61256D864';

  const provider = new ethers.providers.InfuraProvider(
    'sepolia',
    process.env.INFURA_API_KEY
  );
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? '', provider);
  console.log(`Using wallet address ${wallet.address}`);

  const lastBlock = await provider.getBlock('latest');
  console.log(`The last block is ${lastBlock.number}`);

  const signer = wallet.connect(provider);
  const balance = await signer.getBalance();
  console.log(`Balance is ${balance} WEI`);
  const ballotFactory = new Ballot__factory(signer);
  const ballotContract = await ballotFactory.attach(CONTRACT_ADDRESS);

  console.log(`Giving voting rights to ${addressToGiveVote}`);
  const tx = await ballotContract
    .connect(signer)
    .giveRightToVote(addressToGiveVote, { gasLimit: 200000 });
  await tx.wait();
  console.log(
    `Voting rights given to ${addressToGiveVote} at transaction ${tx.hash}`
  );
}

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});
