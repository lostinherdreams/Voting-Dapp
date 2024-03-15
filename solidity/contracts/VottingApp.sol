// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingApp {
    address public owner;
    uint public votingStart;
    uint public deadline;

    struct Candidate {
        address candidateAddress;
        string name;
        uint votes;
    }
    
    Candidate[] public candidates;
    mapping(address => bool) public hasVoted;

    event AddCandidate(address indexed candidate, string name);
    event Voted(address indexed voter, string choice);

    modifier onlyOwner() {
        require(owner == msg.sender, "Only admin!");
        _;
    }

    modifier notExpired() {
        require(block.timestamp <= votingStart + deadline * 1 days, "Expired!");
        _;
    }

    modifier alreadyVoted(address voter) {
        require(!hasVoted[voter], "You have already voted!");
        _;
    }

    modifier unavailableName(string memory name) {
        require(isNameAvailable(name), "Your chosen name is already taken!");
        _;
    }

    modifier alreadyCandidate(address candidate) {
        require(notCandidate(candidate), "You are already a candidate!");
        _;
    }

    modifier validChoice(string memory name) {
        require(!isNameAvailable(name), "Not a valid candidate!");
        _;
    }

    constructor(uint _deadline) {
        owner = msg.sender;
        deadline = _deadline;
        votingStart = block.timestamp;
    }

    function getRemainingTime() public view returns (uint256) {
        uint votingEnd = votingStart + deadline * 1 days;
        if (block.timestamp >= votingEnd) {
            return 0;
        }
        return votingEnd - block.timestamp;
    }

    function getCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }

    function vote(string memory choice) external notExpired alreadyVoted(msg.sender) validChoice(choice) {
        for (uint i = 0; i < candidates.length; i++) {
            if (keccak256(abi.encodePacked(candidates[i].name)) == keccak256(abi.encodePacked(choice))) {
                candidates[i].votes++;
                hasVoted[msg.sender] = true;
                emit Voted(msg.sender, choice);
                return;
            }
        }
    }

    function addCandidate(string memory name) external alreadyCandidate(msg.sender) notExpired unavailableName(name) {
        Candidate memory candid = Candidate(msg.sender, name, 0);
        candidates.push(candid);
        emit AddCandidate(msg.sender, name);
    }

    function notCandidate(address _candidate) public view returns (bool) {
        for (uint i = 0; i < candidates.length; i++) {
            if (candidates[i].candidateAddress == _candidate) return false;
        }
        return true;
    }

    function isNameAvailable(string memory _name) public view returns (bool) {
        for (uint i = 0; i < candidates.length; i++) {
            if (keccak256(abi.encodePacked(candidates[i].name)) == keccak256(abi.encodePacked(_name))) return false;
        }
        return true;
    }
}
