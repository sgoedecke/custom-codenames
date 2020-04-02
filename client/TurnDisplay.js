import React from 'react';

const TurnDisplay = ({
  endTurn,
  gameState: {
    playing, redPlayers, bluePlayers, redLeader, blueLeader, currentTurn, turn
  },
}) => {
  if (!playing) { return null; }

  const playerId = window.socket.id;
  const playersColor = redPlayers.indexOf(playerId) >= 0 ? 'red' : 'blue';
  const playersTurn = playersColor === currentTurn;
  const playersLeader = playersColor == 'red' ? redLeader : blueLeader;
  const isLeader = playerId === playersLeader;

  return (
    <div className="turnDisplay">
      <p class="turn-text">
        Current turn: <span class={`${currentTurn}-text`}>{currentTurn}</span>
      </p>
      {
        playersTurn && !isLeader ? (
          <button onClick={endTurn}>End turn</button>
        ) : (
          isLeader ? <p className="waiting-text">Waiting for team...</p> : <p className="waiting-text">Waiting for turn...</p>
        )
      }
    </div>
  );
};

export default TurnDisplay;
