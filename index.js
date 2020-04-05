const express = require('express');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const CodenamesGame = require('./server/codenames').default;

// serve entrypoint
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/assets/index.html`);
});

// serve js and css
app.use('/assets', express.static(`${__dirname}/assets`));

const gameStates = {};
const userMapping = {};

io.on('connection', (socket) => {
  // associate socket with game room from hash param
  const { roomName, type, tiles } = socket.handshake.query;
  if (!roomName) { return; }
  // default to pictures game type
  const gameType = type || 'pictures';

  socket.join(roomName);

  const emitGameUpdate = () => {
    if (!gameStates[roomName]) { return; }
    const players = Object.keys((io.sockets.adapter.rooms[roomName] || { sockets: {} }).sockets);
    players.forEach((player) => {
      io.to(player).emit('game state update', gameStates[roomName].serialize(player));
    });
  };

  // if there's no game object associated with this room, create one
  // TODO: clean up the game when it's finished to avoid leaking memory
  let currentGame = gameStates[roomName];
  if (!currentGame) {
    gameStates[roomName] = new CodenamesGame(gameType, tiles);
    currentGame = gameStates[roomName];
  }
  currentGame.addPlayer(socket.id);
  emitGameUpdate();

  // handle players leaving
  socket.on('disconnect', () => {
    if (!currentGame) { return; }
    currentGame.removePlayer(socket.id);
    emitGameUpdate();
  });

  // handle game events
  socket.on('sync', () => { // handle request for game state from client
    if (!currentGame) { return; }
    emitGameUpdate();
  });

  socket.on('chooseLeader', () => {
    if (!currentGame) { return; }
    currentGame.assignLeader(socket.id);
    emitGameUpdate();
  });

  socket.on('chooseTile', (msg) => {
    if (!currentGame) { return; }
    const success = currentGame.chooseTile(msg, socket.id);

    const user = userMapping[socket.id] || socket.id;
    if (success) { io.to(roomName).emit('chat message', `${user} chose tile ${msg}`, currentGame.getPlayerColor(socket.id)); }
    emitGameUpdate();
  });

  socket.on('endTurn', () => {
    if (!currentGame) { return; }
    const success = currentGame.endTurn(socket.id);

    const user = userMapping[socket.id] || socket.id;
    if (success) { io.to(roomName).emit('chat message', `${user} ended the turn`, currentGame.getPlayerColor(socket.id)); }
    emitGameUpdate();
  });

  socket.on('submitClue', (clue, guesses) => {
    if (!currentGame) { return; }
    currentGame.submitClue(clue, guesses, socket.id);
    emitGameUpdate();
  });

  // handle chat
  socket.on('setUsername', (msg) => {
    userMapping[socket.id] = msg;
    io.to(roomName).emit('usernames', userMapping);
  });

  socket.on('chat message', (msg) => {
    console.log(`sending ${JSON.stringify(msg)} to ${roomName}`);
    const user = userMapping[socket.id] || socket.id;
    io.to(roomName).emit('chat message', `${user}:\n ${msg}`, currentGame.getPlayerColor(socket.id));
  });
});

http.listen(process.env.PORT || 3000, () => {
  console.log('listening on *:', process.env.PORT || 3000);
});
