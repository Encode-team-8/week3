import { ethers } from 'ethers';
import { Ballot__factory } from '../typechain-types';
require('dotenv').config();

const CONTRACT_ADDRESS = '0x9B41bc4De53eC3E7ac104015D25e4cA61256D864';

async function main() {
  const args = process.argv;
  const argValues = args.slice(2);

  if (argValues.length <= 0) throw new Error('Missing address');
  if (argValues.length > 1)
    throw new Error('Can only delegate to a single address');
  // getAddress will throw error if address is invalid
  const addressTo = ethers.utils.getAddress(argValues[0]);

  // Choose your provider
  const provider = new ethers.providers.InfuraProvider(
    'sepolia',
    process.env.INFURA_API_KEY
  );

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? '', provider);
  console.log(`Connected to the wallet address ${wallet.address}`);

  const signer = wallet.connect(provider);

  // 1: Attach Contract
  const ballotCF = new Ballot__factory(signer);
  console.log('Attaching to contract ...');
  const ballotC = ballotCF.attach(CONTRACT_ADDRESS);
  console.log(`Attached to Ballot contract at ${ballotC.address}`);

  // 2: Delegate vote to address provided
  const TxReceipt = await ballotC.delegate(addressTo, { gasLimit: 200000 });
  console.log({ TxReceipt });
  console.log(`Vote has been delegated to ${addressTo}!`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
