// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const { ethers } = require("hardhat");
const delay = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));

async function main() {


  const VotingApp = await ethers.getContractFactory("VotingApp");

  const deadline = 900; // 900 days

  // Deploy the contract
  console.log("[ 🧐 ] Deploying...");
  const votingApp = await VotingApp.deploy(deadline);
  console.log("[ ✅ ] VotingApp deployed to:", await votingApp.getAddress());

  //waiting for the ...
  console.log(
    `[ ☕️ ] Waiting...`
  );

  await delay(10000);

  //Verify the contract
  console.log("[ 🧐 ] Verifying...");
  await run('verify:verify', {
    address: await votingApp.getAddress(),
    constructorArguments: [
      deadline
    ]
  });
  console.log(`[ ✅ ] Contract's source code verified on block explorer.`);
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
