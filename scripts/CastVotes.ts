import { ethers } from 'hardhat';
import { Ballot__factory } from '../typechain-types';
require('dotenv').config();

const CONTRACT_ADDRESS = '0x9B41bc4De53eC3E7ac104015D25e4cA61256D864';

async function main() {
  const args = process.argv;
  const argValues = args.slice(2);
  if (argValues.length <= 0) throw new Error('Missing vote');
  if (argValues.length > 1) throw new Error('Can only cast a single vote');

  const vote = parseInt(argValues[0]);
  if (!Number.isInteger(vote)) throw new Error('Vote must be an integer');
  console.log('Vote is: ', vote);

  const provider = new ethers.providers.InfuraProvider(
    'sepolia',
    process.env.INFURA_API_KEY
  );

  const wallet = new ethers.Wallet(process.env.DELEGATED_KEY ?? '', provider);
  console.log(`Connected to the wallet address ${wallet.address}`);

  const signer = wallet.connect(provider);

  // 1: Attach Contract
  const ballotCF = new Ballot__factory(signer);
  console.log('Attaching to contract ...');
  const ballotC = ballotCF.attach(CONTRACT_ADDRESS);
  console.log(`Attached to Ballot contract at ${ballotC.address}`);

  // 2: Verify the Proposal exists
  const proposal = await ballotC.proposals(vote, { gasLimit: 200000 });
  console.log(`Proposal being voted on: ${proposal}`);

  // 3: Cast the vote
  const TxReceipt = await ballotC
    .connect(signer)
    .vote(vote, { gasLimit: 200000 });
  console.log(TxReceipt);

  console.log('Vote has been cast!');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
