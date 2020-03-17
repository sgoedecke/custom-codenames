var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

// serve entrypoint
app.get('/', function(req, res){
  res.sendFile(__dirname + '/assets/index.html');
});

// serve js and css 
app.use('/assets', express.static(__dirname + '/assets'));

gameStates = {}

io.on('connection', function(socket){
  // associate socket with game room from hash param
  const roomName = socket.handshake.query.roomName;
  if (!roomName) {
    console.log('user connected with no room')
    return
  }
  console.log('user connected to ' + roomName)
  socket.join(roomName);

  // if there's no game object associated with this room, create one
  // TODO: clean up the game when it's finished to avoid leaking memory
  currentGame = gameStates[roomName]
  if (!currentGame) {
    gameStates[roomName] = {}
  }
  console.log('Game states: ' + JSON.stringify(gameStates))

  // handle game events
  socket.on('game state update', function(msg){
    console.log('sending ' + JSON.stringify(msg) + ' to ' + roomName)
    // TODO: maintain game state server side instead of just overwriting
    gameStates[roomName] = msg
    console.log('sending ' + JSON.stringify(gameStates[roomName]) + ' to ' + roomName)
    io.to(roomName).emit('game state update', gameStates[roomName]);
  });

  socket.on('chat message', function(msg){
    console.log('sending ' + JSON.stringify(msg) + ' to ' + roomName)
    io.to(roomName).emit('chat message', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
