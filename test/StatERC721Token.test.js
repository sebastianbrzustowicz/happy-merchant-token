const StatERC721Token = artifacts.require("StatERC721Token");

contract("StatERC721Token", (accounts) => {
    let token;
    const [owner, user1, user2] = accounts;

    beforeEach(async () => {
        token = await StatERC721Token.new();
    });

    it("should mint tokens correctly", async () => {
        const recipient = accounts[1];
  
        await token.mint(recipient, 1, 1);
  
        const balance = await token.balanceOf(recipient, 1);
        assert.equal(balance.toString(), "1", "Minting failed. Incorrect balance after minting");
  
        const transferEvents = await token.getPastEvents('TransferSingle');
        assert.equal(transferEvents.length, 1, "Transfer event not emitted after minting");
    });

    it("should transfer tokens correctly", async () => {
        await token.mint(user1, 1, 1); 
    
        await token.setApprovalForAll(user2, true, { from: user1 });
    
        await token.safeTransferFrom(user1, user2, 1, 1, { from: user2 });
    
        const balanceUser1 = await token.balanceOf(user1, 1);
        const balanceUser2 = await token.balanceOf(user2, 1);
    
        assert.equal(balanceUser1.toString(), "0", "User1 did not lose the token after transfer");
        assert.equal(balanceUser2.toString(), "1", "User2 did not receive the token after transfer");
    });

    it("should fail transfer if not the owner", async () => {
        await token.mint(user1, 1, 1);
        
        try {
            await token.safeTransferFrom(user2, user1, 1, 1);
            assert.fail("Transfer should have failed as user2 is not the owner of token");
        } catch (error) {
            assert.include(error.message, "ERC1155: caller is not owner nor approved", "Error message is incorrect when transfer is made by non-owner");
        }
    });

    it("should approve and get approval correctly", async () => {
        const recipient = accounts[1];
        const owner = accounts[0];
      
        await token.mint(owner, 1, 1);
      
        await token.setApprovalForAll(recipient, true, { from: owner });
      
        const approved = await token.isApprovedForAll(owner, recipient);
        assert.equal(approved, true, "Approval failed. Incorrect approval status");
      
        const approvalEvents = await token.getPastEvents('ApprovalForAll');
        assert.equal(approvalEvents.length, 1, "ApprovalForAll event not emitted after approval");
    });

    it("should set approval for all correctly", async () => {
        await token.setApprovalForAll(user2, true);
        const approved = await token.isApprovedForAll(owner, user2);
        assert.equal(approved, true, "Operator approval not set correctly. Approval for all failed");
    });

    it("should get on-chain statistics correctly", async () => {
        await token.mint(user1, 1, 1);
        await token.mint(user2, 1, 1);

        const stats = await token.getOnChainStatistics();
        assert.equal(stats[0].toString(), "0", "Minted tokens count is incorrect. Expected: 2");
        assert.equal(stats[1].toString(), "2", "Transfer count is incorrect. Expected: 0");
        assert.equal(stats[2].toString(), "0", "Approve count is incorrect. Expected: 0");
    });

    it("should fail transfer to zero address", async () => {
        await token.mint(user1, 1, 1);

        try {
            await token.safeTransferFrom(user1, "0x0000000000000000000000000000000000000000", 1, 1);
            assert.fail("Transfer to zero address should have failed. Transfer should not be allowed to zero address");
        } catch (error) {
            assert.include(error.message, "ERC1155: transfer to the zero address", "Error message is incorrect when transferring to zero address");
        }
    });
});
