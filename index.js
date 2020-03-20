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

  const emitGameUpdate = () => {
    if (!gameStates[roomName]) { return; }
    const players = Object.keys(io.sockets.adapter.rooms[roomName].sockets);
    players.forEach((player) => {
      io.to(player).emit('game state update', gameStates[roomName].serialize(player));
    });
  };

  // if there's no game object associated with this room, create one
  // TODO: clean up the game when it's finished to avoid leaking memory
  let currentGame = gameStates[roomName];
  if (!currentGame) {
    gameStates[roomName] = new CodenamesGame();
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
    currentGame.chooseTile(msg, socket.id);
    emitGameUpdate();
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
