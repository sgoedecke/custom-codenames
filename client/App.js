import React from 'react';
import { v4 as uuid } from 'uuid';
import { ThemeProvider, DEFAULT_THEME } from '@zendeskgarden/react-theming';
import { Grid, Row, Col } from '@zendeskgarden/react-grid';
import styled from 'styled-components';
import ChatPanel from './ChatPanel';
import Codenames from './Codenames';
import TeamDisplay from './TeamDisplay';
import AppHeader from './AppHeader';
import TurnDisplay from './TurnDisplay';

const theme = {
  ...DEFAULT_THEME,
  colors: {
    ...DEFAULT_THEME.colors,
    primaryHue: '#D79922',
  },
  borderRadii: {
    sm: '0',
    md: '0',
  },
};

const StyledRow = styled(Row)`
  margin-bottom: 30px;
`;


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      tiles: [],
      usernames: {},
      gameState: {},
    };
  }

  componentDidMount() {
    if (!this.props.roomName) { return; }

    window.socket.on('chat message', (msg, color) => {
      this.setState({ messages: [...this.state.messages, { message: msg, color }] });
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

  // TODO: this is a bit expensive for every update, maybe refactor to generating the
  // encoded tiles only when needed
  updateTiles(e) {
    const tiles = e.target.value.split('\n');
    const encodedTiles = btoa(JSON.stringify(tiles));
    this.setState({ tiles, encodedTiles });
  }

  render() {
    const { roomName, socketId } = this.props;
    const {
      messages, gameState, tiles, encodedTiles,
    } = this.state;
    const id = uuid();

    if (!roomName) {
      // TODO: extract to landing page component
      return (
        <div>
          <h1>Welcome!</h1>

          <p>To invite others to your game, just share the URL of your game with them</p>
          <a href={`?type=pictures&new#${id}`}>Start a random game with pictures!</a>
          <br />
          <a href={`?type=words&new#${id}?words`}>Start a random game with words!</a>
          <br />
          <a href={`?type=words&tiles=${encodedTiles}&new#${id}?words`}>Start a random game with tiles of your choice!</a>
          <br />
          <textarea
            onChange={this.updateTiles.bind(this)}
            value={tiles.join('\n')}
            placeholder="Separate tiles with new lines. Include at least 25 tiles and avoid duplicates."
          />
        </div>
      );
    }

    return (
      <ThemeProvider theme={theme}>
        <Grid gutters="md">
          <StyledRow justifyContent="center">
            <AppHeader gameState={gameState} socketId={socketId} roomName={roomName} usernames={this.state.usernames} />
          </StyledRow>
          <StyledRow alignItems="center" justifyContentMd="center">
            <Col md="auto">
              <Codenames gameState={gameState} syncState={this.syncState.bind(this)} chooseTile={this.chooseTile.bind(this)} />
            </Col>
            <Col md="auto">
              <TurnDisplay gameState={gameState} submitClue={this.submitClue.bind(this)} endTurn={this.endTurn.bind(this)} />
            </Col>
          </StyledRow>
          <StyledRow justifyContent="center">
            <TeamDisplay gameState={gameState} chooseLeader={this.chooseLeader.bind(this)} usernames={this.state.usernames} />
          </StyledRow>
          <Row justifyContent="center">
            <ChatPanel messages={messages} sendMessage={this.sendMessage.bind(this)} gameState={gameState} />
          </Row>
        </Grid>
      </ThemeProvider>
    );
  }
}

export default App;
