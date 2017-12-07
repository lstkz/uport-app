pragma solidity ^0.4.17;

/*
 Usage from `truffle console`
 var tc = TopCoderChallenges.at(TopCoderChallenges.address)
 tc.addChallenge("Expired challenge", 1, 2)
 tc.addChallenge("Some challenge", 2, 1612504683, 'MIGJAoGBAM3CosR73CBNcJsLv5E90NsFt6qN1uziQ484gbOoule8leXHFbyIzPQRozgEpSpi\nwhr6d2/c0CfZHEJ3m5tV0klxfjfM7oqjRMURnH/rmBjcETQ7qzIISZQ/iptJ3p7Gi78X5ZMh\nLNtDkUFU9WaGdiEb+SnC39wjErmJSfmGb7i1AgMBAAE=');
 
 tc.getChallenge(2)
 tc.addSubmission(2, "<encrypted json>")
 tc.getSubmission(2, 0)
*/

contract TopCoderChallenges {
  struct Submission {
    address sender;
    string data;
    uint timestamp;
  }

  struct Challenge {
    string title;
    uint id;
    uint deadline;
    uint submissionCount;
    string publicKey;
    Submission[] submissions;
  }
  
  address public owner;
  
  mapping(uint => Challenge) public challenges;
  
  modifier restricted() {
    if (msg.sender == owner) _;
  }

  function TopCoderChallenges() public {
    owner = msg.sender;
  }
  
  // add or update a challenge
  // owner only
  function addChallenge(string title, uint id, uint deadline, string publicKey) public {
    challenges[id].title = title;
    challenges[id].id = id;
    challenges[id].deadline = deadline;
    challenges[id].publicKey = publicKey;
  }

  // get challenge details by id
  function getChallenge(uint challengeId) public view returns (
    string title,
    uint id,
    uint deadline,
    uint submissionCount
  ) {
    Challenge storage challenge = challenges[challengeId];
    require(challenge.id > 0);
    title = challenge.title;
    id = challenge.id;
    deadline = challenge.deadline;
    submissionCount = challenge.submissions.length;
  }

  // add a submission and check for deadline
  function addSubmission(uint challengeId, string data) public {
    Challenge storage challenge = challenges[challengeId];
    require(challenge.id > 0);
    require(challenge.deadline >= now);
    challenge.submissions.push(Submission(msg.sender, data, now));
  }

  // get a submission from the challenge
  function getSubmission(uint challengeId, uint num) public view returns (
    address sender,
    string data,
    uint timestamp
  ) {
    Challenge storage challenge = challenges[challengeId];
    require(challenge.id > 0);
    require(challenge.submissions.length > num && num >= 0);
    Submission storage submission = challenge.submissions[num];
    sender = submission.sender;
    data = submission.data;
    timestamp = submission.timestamp;
  }
}
