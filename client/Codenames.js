import React from 'react';

class Codenames extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.syncState();
  }

  getClass(tile) {
    const { gameState } = this.props;
    if (!gameState.redTiles) { return ''; }

    let revealed = '';
    if (gameState.revealedTiles.indexOf(tile) >= 0) {
      revealed = ' revealedTile';
    }

    if (gameState.redTiles.indexOf(tile) >= 0) {
      return `redTile${revealed}`;
    }
    if (gameState.blueTiles.indexOf(tile) >= 0) {
      return `blueTile${revealed}`;
    }
    if (gameState.assassinTile === tile) {
      return `assassinTile${revealed}`;
    }

    return revealed;
  }

  render() {
    const { gameState, chooseTile } = this.props;
    const { gameType } = gameState;
    console.log('state', gameState);
    if (!gameState.tiles) { return null; }
    const { tiles } = gameState;
    return (
      <div className="game">
        <div className="tiles">
          { tiles.map((tile) => (
            <div key={tile} onClick={() => { chooseTile(tile); }} className={`${gameType}-tile ${this.getClass(tile)}`}>
              {tile}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Codenames;
