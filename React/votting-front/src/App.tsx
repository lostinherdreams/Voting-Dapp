import React, { useState, useEffect } from "react";
import { contract } from "./ethService";



const App = () => {
  const [candidates, setCandidates] = useState([]);

  const addCandidate = (name) => {
    const newCandidate = {
      address: ,
      name,
      votes: 0,
    };
    setCandidates([...candidates, newCandidate]);
  };

  const voteForCandidate = (candidateId) => {
    // Update the votes for the selected candidate
    const updatedCandidates = candidates.map((candidate) =>
      candidate.id === candidateId
        ? { ...candidate, votes: candidate.votes + 1 }
        : candidate
    );
    setCandidates(updatedCandidates);
  };

  return (
    <div>
      <h1>Voting App</h1>
      <CandidateList candidates={candidates} onVote={voteForCandidate} />
      <VotingForm onAddCandidate={addCandidate} onVote={voteForCandidate} />
    </div>
  );
};

export default App;