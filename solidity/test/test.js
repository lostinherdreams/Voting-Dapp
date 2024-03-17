// test/VotingApp.test.js

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VotingApp", function () {
    let votingApp;
    let owner;
    let candidate1;
    let candidate2;

    beforeEach(async () => {
        const VotingApp = await ethers.getContractFactory("VotingApp");
        votingApp = await VotingApp.deploy(7); // Set a 7-day deadline
        [owner, candidate1, candidate2] = await ethers.getSigners();
    });

    describe("Deployment", function () {
        it("Should set the correct owner", async function () {
            expect(await votingApp.owner()).to.equal(owner.address);
        });

        it("Should set the correct deadline", async function () {
            const deadline = await votingApp.deadline();
            expect(deadline).to.equal(7);
        });
    });

    describe("Adding Candidates", function () {
        it("Should add a new candidate", async function () {
            await votingApp.connect(candidate1).addCandidate("Candidate1");
            const candidates = await votingApp.getCandidates();
            expect(candidates.length).to.equal(1);
            expect(candidates[0].name).to.equal("Candidate1");
        });

        it("Should not allow adding a candidate with an existing name", async function () {
            await votingApp.connect(candidate2).addCandidate("Candidate1");
            await expect(
                votingApp.addCandidate("Candidate1")
            ).to.be.revertedWith("Your chosen name is already taken!");
        });

        it("Should not allow adding a candidate twice", async function () {
            await votingApp.connect(candidate1).addCandidate("imposter");
            await expect(
                votingApp.connect(candidate1).addCandidate("imposter")
            ).to.be.revertedWith("You are already a candidate!");
        });
    });

    describe("Voting", function () {
        beforeEach(async function () {
            await votingApp.addCandidate("Candidate1");
        });

        it("Should allow a voter to vote for a candidate", async function () {
            await votingApp.connect(candidate1).vote("Candidate1");
            const hasVoted = await votingApp.hasVoted(candidate1.address);
            expect(hasVoted).to.be.true;
            const candidates = await votingApp.getCandidates();
            expect(candidates[0].votes).to.equal(1);
        });

        it("Should not allow a voter to vote twice", async function () {
            await votingApp.connect(candidate1).vote("Candidate1");
            await expect(
                votingApp.connect(candidate1).vote("Candidate1")
            ).to.be.revertedWith("You have already voted!");
        });

        it("Should not allow voting for an invalid candidate", async function () {
            await expect(
                votingApp.connect(candidate2).vote("InvalidCandidate")
            ).to.be.revertedWith("Not a valid candidate!");
        });

        it("Should not allow voting after the deadline", async function () {
            await ethers.provider.send("evm_increaseTime", [8 * 24 * 60 * 60]); // Move time forward beyond deadline
            await expect(
                votingApp.connect(candidate2).vote("Candidate1")
            ).to.be.revertedWith("Expired!");
        });
    });
});
