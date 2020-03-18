import React from 'react';

class Codenames extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { gameState, updateGameState } = this.props;
    return (
      <div className="game">
        Game state:
        { JSON.stringify(gameState) }
        <br />
        <button onClick={() => { updateGameState({ ...gameState, [Math.random().toString(36)]: 'is updated' }); }}>Update game state</button>
      </div>
    );
  }
}

export default Codenames;
