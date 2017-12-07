const HDWalletProvider = require('truffle-hdwallet-provider');
const config = require('./config');

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8547,
      provider: () => new HDWalletProvider('evidence divert keen possible fiscal depart humble furnace quiz iron knee assume',
        'http://localhost:8545'),
      network_id: '*' // Match any network id
    },
    rinkeby: {
      gas: 4700000,
      network_id: 4,    // Official rinkeby network id
      provider: () => new HDWalletProvider(config.MNEMONIC, 'https://rinkeby.infura.io/'),
    },
  }
};
