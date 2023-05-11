import { expect } from "chai";
import { ethers } from "hardhat";
import { Ballot } from "../typechain-types";

describe("Ballot", function () {
  let ballotC: Ballot;
  let proposals = [];
  proposals.push(ethers.utils.formatBytes32String("proposal1"));
  proposals.push(ethers.utils.formatBytes32String("proposal2"));
  proposals.push(ethers.utils.formatBytes32String("proposal3"));

  beforeEach(async function () {
    const ballotCF = await ethers.getContractFactory("Ballot");
    ballotC = await ballotCF.deploy(proposals);
    await ballotC.deployTransaction.wait();
  });

  describe("When the contract is deployed", function () {
    it("set the deployer address as chairperson", async function () {
      const signers = await ethers.getSigners();
      const deployer = signers[0].address;
      const chairperson = await ballotC.chairperson();
      expect(chairperson).to.eq(deployer);
    });

    it("has the provided proposals", async function () {
      for (let i = 0; i < proposals.length; i++) {
        const contractPropsal = await ballotC.proposals(i);
        expect(ethers.utils.parseBytes32String(contractPropsal.name)).to.eq(
          ethers.utils.parseBytes32String(proposals[i])
        );
      }
    });

    it("has zero votes for all proposals", async function () {
      for (let i = 0; i < proposals.length; i++) {
        const contractPropsal = await ballotC.proposals(i);
        expect(contractPropsal.voteCount).to.eq(0);
      }
    });

    it("sets the voting weight for chairperson to 1", async function () {
      const chairperson = await ballotC.chairperson();
      const chairpersonVoter = await ballotC.voters(chairperson);
      const weight = chairpersonVoter.weight;
      expect(weight).to.eq(1);
    });
  });
});
