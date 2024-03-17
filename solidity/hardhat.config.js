require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const INFURA_API_KEY = process.env.API_KEY;

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const POLYGON_API_KEY = process.env.POLYGON_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.24",
    networks: {
        mumbai: {
            url: `https://polygon-mumbai.infura.io/v3/${INFURA_API_KEY}`,
            accounts: [PRIVATE_KEY],
            chainId: 80001,
        },
        Amoy: {
            url: `https://polygon-amoy.infura.io/v3/${INFURA_API_KEY}`,
            accounts: [PRIVATE_KEY],
        },
    },
    etherscan: {
        apiKey: {
            polygonMumbai: POLYGON_API_KEY,
        },
    },
    paths: {
        artifacts: "./artifacts",
    },
    mocha: {
        timeout: 20000,
    },
    sourcify: {
        // Disabled by default
        // Doesn't need an API key
        enabled: true,
    },
};
