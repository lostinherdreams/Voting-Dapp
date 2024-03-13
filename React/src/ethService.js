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
        let account = accounts[0];
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
    const candidates = await contract.candidates;
    console.log(candidates);
};
