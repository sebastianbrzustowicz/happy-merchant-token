const StatERC20Token = artifacts.require("StatERC20Token");
const StatERC721Token = artifacts.require("StatERC721Token");
const StatERC1155Token = artifacts.require("StatERC1155Token");

module.exports = function(deployer) {
  deployer.deploy(StatERC20Token, 1000000);
  deployer.deploy(StatERC721Token);
  deployer.deploy(StatERC1155Token);
};