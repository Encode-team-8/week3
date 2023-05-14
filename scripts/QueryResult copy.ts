import { ethers } from 'hardhat';
import { Ballot__factory } from '../typechain-types';
require('dotenv').config();

const CONTRACT_ADDRESS = '0x9B41bc4De53eC3E7ac104015D25e4cA61256D864';

async function main() {
  const provider = new ethers.providers.InfuraProvider(
    'sepolia',
    process.env.INFURA_API_KEY
  );

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? '', provider);

  const signer = wallet.connect(provider);
  const balance = await signer.getBalance();
  console.log(`Wallet balance: ${balance} Wei`);

  // 1: Attach Contract
  const ballotCF = new Ballot__factory(signer);
  console.log('Attaching to contract ...');
  const ballotC = ballotCF.attach(CONTRACT_ADDRESS);
  console.log(`Attached to Ballot contract at ${ballotC.address}`);

  // 2: Query winning proposal
  let winningName = await ballotC.winnerName();
  console.log(
    `winning proposal is ${ethers.utils.parseBytes32String(winningName)}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
