import React from 'react';
import { v4 as uuid } from 'uuid';
import ChatPanel from './ChatPanel';
import Codenames from './Codenames';
import TeamDisplay from './TeamDisplay';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      usernames: {},
      gameState: {},
    };
  }

  componentDidMount() {
    if (!this.props.roomName) { return; }

    window.socket.on('chat message', (msg) => {
      this.setState({ messages: [...this.state.messages, msg] });
    });

    window.socket.on('usernames', (msg) => {
      this.setState({ usernames: msg });
    });

    window.socket.on('game state update', (gameState) => {
      console.log('got update', gameState);
      this.setState({ gameState });
    });
  }

  sendMessage(msg) {
    window.socket.emit('chat message', msg);
  }

  // request a new copy of the state from the server. called after the
  // component loads
  syncState() {
    window.socket.emit('sync');
  }

  chooseTile(tile) {
    console.log('choosing tile', tile);
    window.socket.emit('chooseTile', tile);
  }

  chooseLeader(player) {
    console.log('choosing leader', player);
    window.socket.emit('chooseLeader', player);
  }

  updateName() {
    const name = window.prompt('Enter your name');
    if (name !== null && name !== '') {
      window.socket.emit('setUsername', name);
    }
  }

  render() {
    const { roomName, socketId } = this.props;
    const { messages, gameState } = this.state;

    if (!roomName) {
      // TODO: extract to landing page component
      return (
        <div>
          <h1>Welcome!</h1>

          <a href={`?new#${uuid()}`}>Start a random game!</a>

          <p>To invite others to your game, just share the URL of your game with them</p>
        </div>
      );
    }

    return (
      <div>
        <div className="header">
          { gameState.winner ? (
            <h1>
              Winner:
              { gameState.winner }
              {' '}
              team!
            </h1>
          )
            : (
              <h1>
                Currently playing in
                {' '}
                { roomName }
              </h1>
            ) }

          <div className={(gameState.redPlayers || []).indexOf(window.socket.id) >= 0 ? 'playerRed' : 'playerBlue'}>
            You are
            {' '}
            { this.state.usernames[socketId] || socketId }

            <button onClick={this.updateName}>Change name</button>
          </div>
          Game is
          {' '}
          <b>{ gameState.playing ? 'playing' : 'not playing' }</b>
          { gameState.playing && (
          <p>
            Current turn:
            {gameState.currentTurn}
          </p>
          )}
        </div>
        <Codenames gameState={gameState} syncState={this.syncState.bind(this)} chooseTile={this.chooseTile.bind(this)} />
        <TeamDisplay gameState={gameState} chooseLeader={this.chooseLeader.bind(this)} usernames={this.state.usernames} />
        <ChatPanel messages={messages} sendMessage={this.sendMessage.bind(this)} />
      </div>
    );
  }
}

export default App;
