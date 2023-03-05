const { ethers } = require("hardhat");

const main = async () => {
  const contractFactory = await ethers.getContractFactory("TaskContract");
  const contract = await contractFactory.deploy();
  await contract.deployed();
  console.log("contract deployed tp :", contract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log("error");
    process.exit(1);
  }
};

runMain();

//0x351282C64C15064ddDE6EbF13C7d41Cc1e54d029
