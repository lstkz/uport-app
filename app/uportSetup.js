import {Connect, SimpleSigner, MNID} from 'uport-connect';

const uport = new Connect('Topcoder submissions', {
  clientId: '2oerGrezmiTrNaD41pUp9ZreBaNUcwvZWag',
  network: 'rinkeby',
  signer: SimpleSigner('793652ffe30a76b81a5b899b2f6fe85b5c3473f87128a74a12db13ebba1ed248')
});

const web3 = uport.getWeb3();
export {web3, uport, MNID};
