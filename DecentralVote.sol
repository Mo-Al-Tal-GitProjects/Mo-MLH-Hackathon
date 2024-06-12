// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DecentralVote {
    // Structure to store candidate details
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // Mapping to store the voter's address and their voting status
    mapping(address => bool) public voters;

    // Mapping to store candidate details with their ID
    mapping(uint => Candidate) public candidates;

    // Variable to keep track of the number of candidates
    uint public candidatesCount;

    // Event to be emitted when a vote is cast
    event votedEvent(uint indexed candidateId);

    // Constructor to initialize the contract with candidates
    constructor() {
        addCandidate("Alice");
        addCandidate("Bob");
    }

    // Function to add a candidate (private, can only be called within the contract)
    function addCandidate(string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    // Function to vote for a candidate
    function vote(uint _candidateId) public {
        // Require that the voter has not voted before
        require(!voters[msg.sender], "You have already voted.");
        
        // Require that the candidate is valid
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate.");

        // Record that the voter has voted
        voters[msg.sender] = true;

        // Update the candidate's vote count
        candidates[_candidateId].voteCount++;

        // Emit the voted event
        emit votedEvent(_candidateId);
    }
}
