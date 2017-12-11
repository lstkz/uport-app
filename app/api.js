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

async function getSubmission(id, num) {
  const result = await contract.getSubmissionAsync(id, num);
  return {
    sender: result[0],
    data: result[1],
    timestamp: new Date(result[2].c[0] * 1000),
  };
}

function addSubmission(id, data) {
  return contract.addSubmissionAsync(id, data);
}


async function getChallengeWithSubmissions(id) {
  const challenge = await getChallenge(id);
  const promises = [];
  for (let i = 0; i < challenge.submissionCount; i += 1) {
    promises.push(getSubmission(id, i));
  }
  challenge.submissions = await Promise.all(promises);
  challenge.submissions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  const duplicates = {};
  challenge.submissions = challenge.submissions.filter(sub => {
    if (duplicates[sub.sender]) {
      return false;
    }
    duplicates[sub.sender] = true;
    return true;
  });
  return challenge;
}

export default {
  getChallenge,
  addSubmission,
  getSubmission,
  getChallengeWithSubmissions,
};
