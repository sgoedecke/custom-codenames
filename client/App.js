import React from 'react';
import ChatPanel from './ChatPanel';
import Codenames from './Codenames';

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
      this.setState({ gameState });
    });
  }

  sendMessage(msg) {
    window.socket.emit('chat message', msg);
  }

  // TODO: think about preventing manual tampering
  updateGameState(gameState) {
    console.log(gameState);
    window.socket.emit('game state update', gameState);
  }

  render() {
    const { roomName } = this.props;
    const { messages, gameState } = this.state;

    if (!roomName) {
      // TODO: extract to landing page component
      return (<div>Go to #some-room to start a new game</div>);
    }

    return (
      <div>
        <h1>
          Currently playing in
          { roomName }
        </h1>
        <Codenames gameState={gameState} updateGameState={this.updateGameState.bind(this)} />
        <ChatPanel messages={messages} sendMessage={this.sendMessage.bind(this)} />
      </div>
    );
  }
}

export default App;
