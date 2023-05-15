// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

interface IMyVotingToken {
  function getPastVotes(address, uint256) external view returns (uint256);
}

contract TokenizedBallot {
    struct Proposal {
        bytes32 name;
        uint voteCount; 
    }

    struct DeployedProposal {
        string name;
        uint voteCount;
    }

    IMyVotingToken public tokenContract;
    Proposal[] public proposals;
    uint256 public targetBlockNumber;

    mapping(address => uint) public votesUsed;

    constructor(bytes32[] memory proposalNames, address _tokenContract, uint256 _targetBlockNumber) {
        tokenContract = IMyVotingToken(_tokenContract);
        targetBlockNumber = _targetBlockNumber;
        for (uint i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({
                name: proposalNames[i],
                voteCount: 0
            }));
        }
    }

    function getProposals() public view returns (DeployedProposal[] memory) {
        DeployedProposal[] memory result = new DeployedProposal[](proposals.length);
        for (uint i = 0; i < proposals.length; i++) {
            bytes32 name = proposals[i].name;
            bytes memory nameBytes = new bytes(32);
            assembly {
                mstore(add(nameBytes, 32), name)
            }
            string memory nameString = string(nameBytes);
            result[i] = DeployedProposal({
            name: nameString,
            voteCount: proposals[i].voteCount
        });
        }
        return result;
    }

    function votingPower(address _account) public view returns (uint256) {
      return tokenContract.getPastVotes(_account, targetBlockNumber) - votesUsed[_account];
    }

    
    function vote(uint proposal, uint256 _amount) external {
        require(votingPower(msg.sender) >= _amount, "Not enough voting power");
        votesUsed[msg.sender] += _amount;
        proposals[proposal].voteCount += _amount;
        
    }

    function winningProposal() public view
            returns (uint winningProposal_)
    {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    function winnerName() external view
            returns (bytes32 winnerName_)
    {
        winnerName_ = proposals[winningProposal()].name;
    }
}