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

io.on('connection', (socket) => {
  // associate socket with game room from hash param
  const { roomName } = socket.handshake.query;
  if (!roomName) { return; }
  socket.join(roomName);

  // if there's no game object associated with this room, create one
  // TODO: clean up the game when it's finished to avoid leaking memory
  let currentGame = gameStates[roomName];
  if (!currentGame) {
    gameStates[roomName] = new CodenamesGame();
    currentGame = gameStates[roomName]
  }
  currentGame.addPlayer(socket.id);
  io.to(roomName).emit('game state update', gameStates[roomName].serialize());

  // handle game events
  socket.on('sync', () => { // handle sync request from client
    if (!currentGame) { return }
    socket.emit('game state update', currentGame.serialize());
  });

  socket.on('claim leader', () => {
    if (!currentGame) { return }
    currentGame.assignLeader(socket.id);
    console.log(`sending ${JSON.stringify(currentGame.serialize())} to ${roomName}`);
    io.to(roomName).emit('game state update', currentGame.serialize());
  });

  socket.on('chooseTile', (msg) => {
    if (!currentGame) { return }
    currentGame.chooseTile(msg, socket.id);
    console.log(`sending ${JSON.stringify(currentGame.serialize())} to ${roomName}`);
    io.to(roomName).emit('game state update', currentGame.serialize());
  });


  // handle chat
  socket.on('chat message', (msg) => {
    console.log(`sending ${JSON.stringify(msg)} to ${roomName}`);
    io.to(roomName).emit('chat message', msg);
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
