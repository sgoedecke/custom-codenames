import React from 'react';


const TeamDisplay = ({ gameState: { redPlayers, bluePlayers } }) => {
  if (!redPlayers) { return null; } // TODO: add default props above and remove these checks
  return (
    <div className="players">
      <div className="red-team">
        <h3>Red team:</h3>
        { redPlayers.map((p) => (<div>{p}</div>)) }
      </div>
      <div className="blue-team">
        <h3>Blue team:</h3>
        { bluePlayers.map((p) => (<div>{p}</div>)) }
      </div>
    </div>
  );
};

export default TeamDisplay;
