import React from 'react';

class Codenames extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.syncState();
  }

  render() {
    const { gameState, chooseTile } = this.props;
    console.log('state', gameState);
    if (!gameState.tiles) { return null; }
    const { tiles } = gameState;
    return (
      <div className="game">
        <div className="tiles">
          { tiles.map((tile) => (
            <div key={tile} onClick={() => { chooseTile(tile); }} className="tile">{tile}</div>
          ))}
        </div>
      </div>
    );
  }
}

export default Codenames;
