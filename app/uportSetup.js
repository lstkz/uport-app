import { Connect, SimpleSigner, MNID } from 'uport-connect';

const uport = new Connect('Lukasz\'s new app', {
  clientId: '2p29FgRchsgc8zzsmLL1yQUF6UMrqTKzchz',
  network: 'rinkeby',
  signer: SimpleSigner('562d8040e6d19c852c7ff341c83d9a27c6d1fc2e8758f20e8dfb0ff17f30232c')
});

const web3 = uport.getWeb3();
export { web3, uport, MNID };
