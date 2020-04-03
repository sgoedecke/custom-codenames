import React from 'react';

const TurnDisplay = ({
  endTurn,
  submitClue,
  gameState: {
    playing, redPlayers, redLeader, blueLeader, currentTurn, turn
  },
}) => {
  if (!playing) { return null; }

  const playerId = window.socket.id;
  const playersColor = redPlayers.indexOf(playerId) >= 0 ? 'red' : 'blue';
  const playersTurn = playersColor === currentTurn;
  const playersLeader = playersColor == 'red' ? redLeader : blueLeader;
  const isLeader = playerId === playersLeader;
  return (
    <div className="turn-display">
      <p className="turn-text">
        Current turn: <span className={`${currentTurn}-text`}>{currentTurn}</span>
      </p>
      { playersTurn ? (
        <CurrentPlayerDisplay
          isLeader={isLeader}
          turn={turn}
          submitClue={(clue, guesses) => submitClue(playerId, clue, guesses)}
          endTurn={() => endTurn(playerId)} />
        ) : (
        <OpponentPlayerDisplay turn={turn} />
      )}
    </div>
  );
};

const CurrentPlayerDisplay = ({
  isLeader,
  turn,
  submitClue,
  endTurn,
}) => {
  return (
    <div>
      {turn.submitted && <TurnDetails clue={turn.clue} remainingGuesses={turn.remainingGuesses} />}
      {turn.submitted && (isLeader ? <p className="waiting-text">Waiting for teammates...</p> : <button onClick={endTurn}>End turn</button>)}
      {!turn.submitted && (isLeader ? <TurnDetailSubmission submitClue={submitClue} /> : <p className="waiting-text">Waiting for clue...</p>)}
    </div>
  )
};

const OpponentPlayerDisplay = ({
  turn
}) => {
  return (
    <div>
      {turn.submitted && <TurnDetails clue={turn.clue} remainingGuesses={turn.remainingGuesses} />}
      <p className="waiting-text">Waiting for turn...</p>
    </div>
  )
};

class TurnDetailSubmission extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clue: '',
      guesses: 0,
    };
  }

  render() {
    const { submitClue } = this.props;
    return(
      <form
        className='clue-form'
        action=''
        onSubmit={(e) => {
          e.preventDefault();
          if (this.state.clue && this.state.guesses > 0) {
            submitClue(this.state.clue, this.state.guesses);
          }
          this.setState({ clue: '', guesses: 0 });
          return false;
        }}
      >
        <label>Clue</label>
        <input onChange={(e) => { this.setState({ clue: e.target.value }); }} value={this.state.clue} />
        <br/>
        <label># of guesses</label>
        <input type='number' onChange={(e) => { this.setState({ guesses: e.target.value }); }} value={this.state.guesses} />
        <button>Submit</button>
      </form>
    )
  }
};

const TurnDetails = ({
  clue,
  remainingGuesses,
}) => {
  return (
    <p className='turn-details'>
      {`Clue: ${clue} Remaining guesses: ${remainingGuesses}`}
    </p>
  )
};

export default TurnDisplay;
