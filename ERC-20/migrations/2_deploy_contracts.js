const StatToken = artifacts.require("StatToken");

module.exports = function(deployer) {
  deployer.deploy(StatToken, 1000000);
};