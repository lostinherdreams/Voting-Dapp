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
        
        return account;
    } catch (error) {
        console.error("Error getting user address:", error.message);
        throw error;
    }
};

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
    console.log(candidates);
    return candidates;
};

export const hasVoted = async () => {
    const has = await contract.hasVoted(account);
    console.log(has);
    return has;
}

export async function addCandidate(name){
    try{
        await contract.connect(signer).addCandidate(name);
    }catch(error){
        console.error("Error adding candidate:", error);
        throw error; 
    }
}

export async function vote(name){
    try{
        await contract.connect(signer).vote(name);
    }catch(error){
        console.error("Error voting:", error);
        throw error; 
    }
}