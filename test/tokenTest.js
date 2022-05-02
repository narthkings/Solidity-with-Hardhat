const {expect} = require("chai");

describe("Token", () => {
  let Token;
  let hardhatTokenInstance;
  let owner;
  let user1;
  let user2;
  let users;

  beforeEach(async () => {
    Token = await ethers.getContractFactory("Token");
    [owner, user1, user2] = await ethers.getSigners();
    hardhatTokenInstance = await Token.deploy();
  });

  describe("deployment", () => {
    it("Should set the right owner", async () => {
      expect(await hardhatTokenInstance.owner()).to.equal(owner.address);
    });

    it("Should assign total supply of tokens when deployed", async () => {
      const ownerBalance = await hardhatTokenInstance.balanceOf(owner.address); //get balance of owner
      const totalSupply = await hardhatTokenInstance.totalSupply(); //get total supply
      expect(ownerBalance).to.equal(totalSupply); //check if owner balance is equal to total supply
    });
  });

  describe("transfer", () => {
    it("Should transfer tokens from one account to another", async () => {
      //by default hardhat knows owner is the one sending token
      await hardhatTokenInstance.transfer(user1.address, 10);
      expect(await hardhatTokenInstance.balanceOf(user1.address)).to.equal(10);

      //but you can also specify the sender like this
      await hardhatTokenInstance.connect(user1).transfer(user2.address, 5);
      expect(await hardhatTokenInstance.balanceOf(user2.address)).to.equal(5);
    });

    it("Should fail if sender doesn't have enough tokens", async () => {
      const initialBalance = await hardhatTokenInstance.balanceOf(owner.address);
      await expect(
        hardhatTokenInstance.connect(user1).transfer(owner.address, 10)
      ).to.be.revertedWith("Not enough tokens");
      expect(await hardhatTokenInstance.balanceOf(owner.address)).to.equal(
        initialBalance
      );
    });
  });
});
