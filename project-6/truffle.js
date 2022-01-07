const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    }
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.7",    // Fetch exact version from solc-bin (default: truffle's version)
      docker: true,
      settings: {          // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 8000
        },
      },
      evmVersion: "london"
      // }
    }
  }
};