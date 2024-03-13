import { ethers } from "ethers"
import { contractAddress, contractAbi } from "./ethConfig";

//A connection to the Ethereum network .
//It provides read-only access to the Blockchain and its status.
const provider = new ethers.providers.Web3Provider(window.ethereum)

//The MetaMask plugin also allows signing transactions to
// send ether and pay to change state within the blockchain.
// For this, you need the account signer.
const signer = provider.getSigner()

export const contract = new ethers.Contract(contractAddress, contractAbi, provider);

//getting contract functions

export const getUserAddress = async() =>{
    try {
        const userAddress = await signer.getAddress();
        return userAddress;
      } catch (error) {
        console.error("Error getting user address: ", error);
        return null;
      }
}