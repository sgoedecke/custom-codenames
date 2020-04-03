import React from 'react';
import { v4 as uuid } from 'uuid';
import { ThemeProvider, DEFAULT_THEME } from '@zendeskgarden/react-theming';
import ChatPanel from './ChatPanel';
import Codenames from './Codenames';
import TeamDisplay from './TeamDisplay';
import AppHeader from './AppHeader';
import TurnDisplay from './TurnDisplay';

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

  endTurn(player) {
    console.log('ending turn', player);
    window.socket.emit('endTurn');
  }

  submitClue(player, clue, guesses) {
    console.log('submitting clue', player, clue, guesses);
    window.socket.emit('submitClue', clue, guesses);
  }

  chooseLeader(player) {
    console.log('choosing leader', player);
    window.socket.emit('chooseLeader', player);
  }

  render() {
    const { roomName, socketId } = this.props;
    const { messages, gameState } = this.state;
    const id = uuid();

    if (!roomName) {
      // TODO: extract to landing page component
      return (
        <div>
          <h1>Welcome!</h1>

          <a href={`?type=pictures&new#${id}`}>Start a random game with pictures!</a>
          <br />
          <a href={`?type=words&new#${id}?words`}>Start a random game with words!</a>
          <p>To invite others to your game, just share the URL of your game with them</p>
        </div>
      );
    }

    return (
      <ThemeProvider theme={{ ...DEFAULT_THEME }}>
        <AppHeader gameState={gameState} socketId={socketId} roomName={roomName} usernames={this.state.usernames} />
        <Codenames gameState={gameState} syncState={this.syncState.bind(this)} chooseTile={this.chooseTile.bind(this)} />
        <TurnDisplay gameState={gameState} submitClue={this.submitClue.bind(this)} endTurn={this.endTurn.bind(this)} />
        <TeamDisplay gameState={gameState} chooseLeader={this.chooseLeader.bind(this)} usernames={this.state.usernames} />
        <ChatPanel messages={messages} sendMessage={this.sendMessage.bind(this)} />
      </ThemeProvider>
    );
  }
}

export default App;
