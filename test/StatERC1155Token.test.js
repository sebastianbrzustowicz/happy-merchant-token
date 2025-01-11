const StatERC1155Token = artifacts.require("StatERC1155Token");

contract("StatERC1155Token", (accounts) => {
  let token;
  const [owner, addr1, addr2] = accounts;

  beforeEach(async () => {
    token = await StatERC1155Token.new();
  });

  it("should mint tokens correctly", async () => {
    await token.mint(addr1, 1, 100, { from: owner });
    const balance = await token.balanceOf(addr1, 1);
    assert.equal(balance.toString(), "100", "Incorrect balance for token 1 after mint");

    const stats = await token.getOnChainStatistics();
    assert.equal(stats[0].toString(), "0", "Expected totalTransfers to be 0 after mint");
    assert.equal(stats[1].toString(), "1", "Expected totalMints to be 1 after mint");
    assert.equal(stats[2].toString(), "0", "Expected totalBatchMints to be 0 after mint");
  });

  it("should mint batch tokens correctly", async () => {
    const receipt = await token.mintBatch(addr1, [1, 2], [100, 200], { from: owner });
  
    const balance1 = await token.balanceOf(addr1, 1);
    const balance2 = await token.balanceOf(addr1, 2);
    assert.equal(balance1.toString(), "100", "Incorrect balance for token 1 after minting batch");
    assert.equal(balance2.toString(), "200", "Incorrect balance for token 2 after minting batch");
  
    const event = receipt.logs.find(log => log.event === "TransferBatch");
    assert.ok(event, "TransferBatch event not emitted after batch mint");
  
    const stats = await token.getOnChainStatistics();
    assert.equal(stats[0].toString(), "0", "Expected totalTransfers to be 0 after batch mint");
    assert.equal(stats[1].toString(), "0", "Expected totalMints to be 0 after batch mint");
    assert.equal(stats[2].toString(), "1", "Expected totalBatchMints to be 1 after batch mint");
  });

  it("should transfer tokens correctly", async () => {
    await token.mint(addr1, 1, 100, { from: owner });
    await token.safeTransferFrom(addr1, addr2, 1, 50, { from: addr1 });

    const balance1 = await token.balanceOf(addr1, 1);
    const balance2 = await token.balanceOf(addr2, 1);
    assert.equal(balance1.toString(), "50", "Incorrect balance for token 1 at addr1 after transfer");
    assert.equal(balance2.toString(), "50", "Incorrect balance for token 1 at addr2 after transfer");

    const stats = await token.getOnChainStatistics();
    assert.equal(stats[0].toString(), "1", "Expected totalTransfers to be 1 after transfer");
    assert.equal(stats[1].toString(), "1", "Expected totalMints to be 1 after transfer");
    assert.equal(stats[2].toString(), "0", "Expected totalBatchMints to be 0 after transfer");
  });

  it("should batch transfer tokens correctly", async () => {
    await token.mintBatch(addr1, [1, 2], [100, 200], { from: owner });
    await token.safeBatchTransferFrom(addr1, addr2, [1, 2], [50, 100], { from: addr1 });
  
    const balance1_1 = await token.balanceOf(addr1, 1);
    const balance1_2 = await token.balanceOf(addr1, 2);
    const balance2_1 = await token.balanceOf(addr2, 1);
    const balance2_2 = await token.balanceOf(addr2, 2);
  
    assert.equal(balance1_1.toString(), "50", "Incorrect balance for token 1 at addr1 after batch transfer");
    assert.equal(balance1_2.toString(), "100", "Incorrect balance for token 2 at addr1 after batch transfer");
    assert.equal(balance2_1.toString(), "50", "Incorrect balance for token 1 at addr2 after batch transfer");
    assert.equal(balance2_2.toString(), "100", "Incorrect balance for token 2 at addr2 after batch transfer");
  
    const stats = await token.getOnChainStatistics();
    assert.equal(stats[0].toString(), "1", "Expected totalTransfers to be 1 after batch transfer");
    assert.equal(stats[1].toString(), "0", "Expected totalMints to be 0 after batch transfer");
    assert.equal(stats[2].toString(), "1", "Expected totalBatchMints to be 1 after batch transfer");
  });

  it("should return correct on-chain statistics", async () => {
    const stats = await token.getOnChainStatistics();
    assert.equal(stats[0].toString(), "0", "Expected totalTransfers to be 0 initially");
    assert.equal(stats[1].toString(), "0", "Expected totalMints to be 0 initially");
    assert.equal(stats[2].toString(), "0", "Expected totalBatchMints to be 0 initially");

    await token.mint(addr1, 1, 100, { from: owner });
    await token.safeTransferFrom(addr1, addr2, 1, 50, { from: addr1 });

    const newStats = await token.getOnChainStatistics();
    assert.equal(newStats[0].toString(), "1", "Expected totalTransfers to be 1 after mint and transfer");
    assert.equal(newStats[1].toString(), "1", "Expected totalMints to be 1 after mint and transfer");
    assert.equal(newStats[2].toString(), "0", "Expected totalBatchMints to be 0 after mint and transfer");
  });
});
