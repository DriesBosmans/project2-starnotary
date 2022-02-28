const { expect } = require("chai");
const { ethers } = require("hardhat");
require("dotenv").config();

describe("Starnotary 2 testing", () => {
  let Contract;
  let contract;
  let owner, addr1;
  let provider;
  const starName = "New star";
  const tokenId = 1;
  const differentTokenId = 2;
  const url = "http://127.0.0.1:8545";
  const infura = `https://rinkeby.infura.io/v3/${process.env.RINKEBY_KEY}`;
  // if not provided a network, homestead is used
  provider = new ethers.getDefaultProvider(url);

  before(async () => {});
  beforeEach(async () => {
    Contract = await ethers.getContractFactory("StarNotary");
    contract = await Contract.deploy();
    await contract.deployed();
    [owner, addr1] = await ethers.getSigners();
  });

  it("Should set the right owner", async () => {
    await expect(await contract.owner()).to.equal(owner.address);
  });

  it("can create a Star", async () => {
    let result = await contract.createStar(starName, tokenId);
    result = await contract.lookUptokenIdToStarInfo(tokenId);
    expect(result).to.equal(starName);
  });
  it("mints the star", async () => {
    await expect(contract.createStar(starName, tokenId))
      .to.emit(contract, "Transfer")
      .withArgs(
        "0x0000000000000000000000000000000000000000",
        owner.address,
        tokenId
      );
  });

  it("lets user1 put up their star for sale", async () => {
    await contract.createStar(starName, tokenId);
    await contract
      .connect(owner)
      .putStarUpForSale(tokenId, ethers.utils.parseEther("15000"));
    expect(await contract.starsForSale(tokenId)).to.equal(
      "15000000000000000000000"
    );
  });

  it("lets user1 get the funds after the sale", async () => {
    await contract.createStar(starName, tokenId);
    const price = 20000;
    await contract.putStarUpForSale(tokenId, price);
    const initialOwnerBalance = parseInt(await owner.getBalance());
    await contract.connect(addr1).buyStar(tokenId, { value: 30000 });
    const finalBalance = parseInt(await owner.getBalance());
    const sum = initialOwnerBalance + price;
    expect(finalBalance).to.equal(sum);
  });

  it("doesnt let user2 put up a star for sale from user1", async () => {
    await contract.createStar(starName, tokenId);
    // expect to be reverted
    await expect(
      contract.connect(addr1).putStarUpForSale(tokenId, 1)
    ).to.be.revertedWith("You can't sell the Star you don't own");
  });

  it("lets user2 buy a star, if it is put up for sale", async () => {
    await contract.createStar(starName, tokenId);
    await contract.putStarUpForSale(tokenId, ethers.utils.parseEther("1500"));
    await contract
      .connect(addr1)
      .buyStar(tokenId, { value: ethers.utils.parseEther("1501") });
    expect(await contract.ownerOf(tokenId)).to.equal(addr1.address);
  });

  it("has correct name", async () => {
    expect(await contract.name()).to.equal("Nottystar");
  });

  it("has correct symbol", async function () {
    expect(await contract.symbol()).to.equal("NS");
  });

  // Implement Task 2 Add supporting unit tests

  it("can add the star name and star symbol properly", async () => {
    // 1. create a Star with different tokenId
    //2. Call the name and symbol properties in your Smart Contract and compare with the name and symbol provided
    
    await contract.createStar(starName, differentTokenId);
      
  });

  it("lets 2 users exchange stars", async () => {
    // 1. create 2 Stars with different tokenId
    // 2. Call the exchangeStars functions implemented in the Smart Contract
    // 3. Verify that the owners changed
    await contract.createStar(starName, tokenId);
    await contract.connect(addr1).createStar(starName, differentTokenId);
    await contract.exchangeStars(tokenId, differentTokenId);
    expect(await contract.ownerOf(tokenId)).to.equal(addr1.address);
    expect(await contract.ownerOf(differentTokenId)).to.equal(owner.address);
  });

  it("lets 2 users exchange stars, addr1 being the caller", async () => {
    // 1. create 2 Stars with different tokenId
    // 2. Call the exchangeStars functions implemented in the Smart Contract
    // 3. Verify that the owners changed
    await contract.createStar(starName, tokenId);
    await contract.connect(addr1).createStar(starName, differentTokenId);
    await contract.connect(addr1).exchangeStars(tokenId, differentTokenId);
    expect(await contract.ownerOf(tokenId)).to.equal(addr1.address);
    expect(await contract.ownerOf(differentTokenId)).to.equal(owner.address);
  });

  it("lets a user transfer a star", async () => {
    // 1. create a Star with different tokenId
    // 2. use the transferStar function implemented in the Smart Contract
    // 3. Verify the star owner changed.
    await contract.createStar(starName, tokenId);
    await contract.transferStar(addr1.address, tokenId);
    expect(await contract.ownerOf(tokenId)).to.equal(addr1.address);
  });

  it("lookUptokenIdToStarInfo test", async () => {
    // 1. create a Star with different tokenId
    // 2. Call your method lookUptokenIdToStarInfo
    // 3. Verify if you Star name is the same
    await contract.createStar(starName, tokenId);
    const name = await contract.lookUptokenIdToStarInfo(tokenId);
    expect(name).to.equal(starName);

  });

  it("check balances", async () => {
    console.log("owner.balance = " + (await owner.getBalance()));
    console.log("addr1.balance = " + (await addr1.getBalance()));
  });
});
