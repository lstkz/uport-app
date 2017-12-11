import {web3} from '../uportSetup';

// Callback handler for whether it was mined or not
const waitForMined = (txHash, response, pendingCB, successCB) => {
  if (response.blockNumber) {
    successCB();
  } else {
    pendingCB();
    pollingLoop(txHash, response, pendingCB, successCB);
  }
};

// Recursive polling to do continuous checks for when the transaction was mined
const pollingLoop = (txHash, response, pendingCB, successCB) => {
  setTimeout(() => {
    web3.eth.getTransaction(txHash, (error, res) => {
      if (error) { throw error; }
      waitForMined(txHash, res || {blockNumber: null}, pendingCB, successCB);
    });
  }, 1000); // check again in one sec.
};

export default waitForMined;
