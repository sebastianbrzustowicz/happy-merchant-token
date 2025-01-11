const StatToken = artifacts.require("StatToken");

contract("StatToken", accounts => {
    let token;
    const [owner, recipient] = accounts;
    const decimals = 9;
    const initialSupply = 1000000;

    beforeEach(async () => {
        token = await StatToken.new(initialSupply);
    });

    it("should have the correct name and symbol", async () => {
        const name = await token.name();
        const symbol = await token.symbol();
        assert.equal(name, "StatToken");
        assert.equal(symbol, "STAT");
    });

    it("should assign the total supply to the owner", async () => {
        const totalSupply = await token.totalSupply();
        const ownerBalance = await token.balanceOf(owner);
        assert.equal(totalSupply.toString(), (initialSupply * (10 ** decimals)).toString());
        assert.equal(ownerBalance.toString(), (initialSupply * (10 ** decimals)).toString());
    });

    it("should transfer tokens correctly", async () => {
        const transferAmount = 100 * (10 ** decimals);

        await token.transfer(recipient, transferAmount, { from: owner });

        const recipientBalance = await token.balanceOf(recipient);
        const ownerBalance = await token.balanceOf(owner);

        assert.equal(recipientBalance.toString(), transferAmount.toString());
        assert.equal(ownerBalance.toString(), ((initialSupply * (10 ** decimals)) - transferAmount).toString());
    });

    it("should approve and transfer tokens through allowance", async () => {
        const approveAmount = 200 * (10 ** decimals);

        await token.approve(recipient, approveAmount, { from: owner });
        await token.transferFrom(owner, recipient, approveAmount, { from: recipient });

        const recipientBalance = await token.balanceOf(recipient);
        const ownerBalance = await token.balanceOf(owner);

        assert.equal(recipientBalance.toString(), approveAmount.toString());
        assert.equal(ownerBalance.toString(), ((initialSupply * (10 ** decimals)) - approveAmount).toString());
    });

    it("should fail if transferring more than balance", async () => {
      let errorThrown = false;
      
      try {
          await token.transfer(recipient, (initialSupply + 1) * (10 ** decimals), { from: owner });
      } catch (error) {
          errorThrown = true;
          assert(error.message.includes("ERC20: insufficient balance"), "Expected 'insufficient balance' error");
      }
  
      assert.equal(errorThrown, true, "Expected transfer to fail due to insufficient balance");
  });
  
});
