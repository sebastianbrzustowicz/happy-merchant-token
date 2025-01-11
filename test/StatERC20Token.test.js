const StatERC20Token = artifacts.require("StatERC20Token");

contract("StatERC20Token", accounts => {
    let token;
    const [owner, recipient] = accounts;
    const decimals = 9;
    const initialSupply = 1000000;

    beforeEach(async () => {
        token = await StatERC20Token.new(initialSupply);
    });

    it("should have the correct name and symbol", async () => {
        const name = await token.name();
        const symbol = await token.symbol();
        assert.equal(name, "StatERC20Token", "Token name is incorrect");
        assert.equal(symbol, "STAT", "Token symbol is incorrect");
    });

    it("should assign the total supply to the owner", async () => {
        const totalSupply = await token.totalSupply();
        const ownerBalance = await token.balanceOf(owner);
        assert.equal(totalSupply.toString(), (initialSupply * (10 ** decimals)).toString(), "Total supply is incorrect");
        assert.equal(ownerBalance.toString(), (initialSupply * (10 ** decimals)).toString(), "Owner's balance is incorrect");
    });

    it("should transfer tokens correctly", async () => {
        const transferAmount = 100 * (10 ** decimals);

        await token.transfer(recipient, transferAmount, { from: owner });

        const recipientBalance = await token.balanceOf(recipient);
        const ownerBalance = await token.balanceOf(owner);

        assert.equal(recipientBalance.toString(), transferAmount.toString(), "Recipient did not receive the correct amount of tokens");
        assert.equal(ownerBalance.toString(), ((initialSupply * (10 ** decimals)) - transferAmount).toString(), "Owner's balance is incorrect after transfer");
    });

    it("should approve and transfer tokens through allowance", async () => {
        const approveAmount = 200 * (10 ** decimals);

        await token.approve(recipient, approveAmount, { from: owner });
        await token.transferFrom(owner, recipient, approveAmount, { from: recipient });

        const recipientBalance = await token.balanceOf(recipient);
        const ownerBalance = await token.balanceOf(owner);

        assert.equal(recipientBalance.toString(), approveAmount.toString(), "Recipient did not receive the correct amount of tokens after approval");
        assert.equal(ownerBalance.toString(), ((initialSupply * (10 ** decimals)) - approveAmount).toString(), "Owner's balance is incorrect after approval transfer");
    });

    it("should fail if transferring more than balance", async () => {
        let errorThrown = false;

        try {
            await token.transfer(recipient, (initialSupply + 1) * (10 ** decimals), { from: owner });
        } catch (error) {
            errorThrown = true;
            assert(error.message.includes("ERC20: insufficient balance"), "Expected 'insufficient balance' error, but got a different error");
        }

        assert.equal(errorThrown, true, "Expected transfer to fail due to insufficient balance");
    });

});
