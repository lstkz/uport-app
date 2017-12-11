import getContract from './contractSetup';

const contract = getContract();

async function getChallenge(id) {
  const result = await contract.getChallengeAsync(id);
  return {
    title: result[0],
    id: result[1].c[0],
    deadline: new Date(result[2].c[0] * 1000),
    publicKey: result[3],
    submissionCount: result[4].c[0],
  };
}

export default {
  getChallenge,
};
