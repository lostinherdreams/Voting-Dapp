import { ethers } from "ethers";
import { BigNumber } from "ethers";
import { contractAddress, contractAbi } from "./ethConfig";

//A connection to the Ethereum network .
//It provides read-only access to the Blockchain and its status.
const provider = new ethers.providers.Web3Provider(window.ethereum);

//The MetaMask plugin also allows signing transactions to
// send ether and pay to change state within the blockchain.
// For this, you need the account signer.
const signer = provider.getSigner();

//get account
let accounts = await ethereum.request({
    method: "eth_requestAccounts",
    params: [],
});
let account = accounts[0];

export const contract = new ethers.Contract(
    contractAddress,
    contractAbi,
    provider
);

//getting contract functions
export const getUserAddress = async () => {
    try {
        let accounts = await ethereum.request({
            method: "eth_requestAccounts",
            params: [],
        });
        return accounts[0];
    } catch (error) {
        window.alert("Error getting user address:", error.message);
        throw error;
    }
};

function extractErrorMessage(error) {
    if (error.data && error.data.message) {
        const match = error.data.message.match(/execution reverted: (.+)$/);
        if (match && match.length > 1) {
            return match[1];
        }
    }
    return error.message;
}

export const getRemainingTime = async () => {
    try {
        const time = await contract.getRemainingTime();
        const seconds = BigNumber.from(time);
        const days = seconds.div(60 * 60 * 24);
        return parseInt(days.toString());
    } catch (error) {
        console.error("Error getting remaining time:", error.message);
        throw error;
    }
};

export const getCandidates = async () => {
    const candidates = await contract.getCandidates();
    return candidates;
};

export const hasVoted = async () => {
    try {
        let accounts = await ethereum.request({
            method: "eth_requestAccounts",
            params: [],
        });
        account = accounts[0];

        const has = await contract.hasVoted(account);
        return has;
    } catch (error) {
        console.log(error);
    }
};

export async function addCandidate(name) {
    try {
        const tx = await contract.connect(signer).addCandidate(name);
        await tx.wait(1);
        alert(`${name} you are a candid now! `);
    } catch (error) {
        window.alert("Error adding candidate: " + filter(error));
        throw error;
    }
}

export async function vote(name) {
    try {
        const tx = await contract.connect(signer).vote(name);
        console.log(tx);
        await tx.wait(1);
        alert(`Voted!`);
    } catch (error) {
        window.alert("Error voting: " + filter(error));
        throw error;
    }
}

function filter(errorMessage) {
    const reasonStart = 'reason="';
    const reasonEnd = '", method=';
    const startIndex =
        errorMessage.toString().indexOf(reasonStart) + reasonStart.length;
    const endIndex = errorMessage.toString().indexOf(reasonEnd);
    return errorMessage.toString().substring(startIndex, endIndex);
}
