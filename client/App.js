import React from 'react';
import ChatPanel from './ChatPanel';
import Codenames from './Codenames';
import TeamDisplay from './TeamDisplay';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      gameState: {},
    };
  }

  componentDidMount() {
    if (!this.props.roomName) { return; }

    window.socket.on('chat message', (msg) => {
      this.setState({ messages: [...this.state.messages, msg] });
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

  render() {
    const { roomName, socketId } = this.props;
    const { messages, gameState } = this.state;

    if (!roomName) {
      // TODO: extract to landing page component
      return (<div>Go to #some-room to start a new game</div>);
    }

    return (
      <div>
        <div className="header">
          <h1>
            Currently playing in
            { roomName }
          </h1>
          You are
          {' '}
          { socketId }
          <br />
          Game is
          {' '}
          <b>{ gameState.playing ? 'playing' : 'not playing' }</b>
        </div>
        <Codenames gameState={gameState} syncState={this.syncState.bind(this)} chooseTile={this.chooseTile.bind(this)} />
        <TeamDisplay gameState={gameState} chooseLeader={this.chooseLeader.bind(this)} />
        <ChatPanel messages={messages} sendMessage={this.sendMessage.bind(this)} />
      </div>
    );
  }
}

export default App;
