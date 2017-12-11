import Promise from 'bluebird';
import data from '../build/contracts/TopCoderChallenges.json';
import {web3} from './uportSetup';

export default function getContract() {
  const abi = web3.eth.contract(data.abi);
  return Promise.promisifyAll(abi.at(data.networks['4'].address));
}
