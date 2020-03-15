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

io.on('connection', function(socket){
  const roomName = socket.handshake.query.roomName;
  if (!roomName) {
    console.log('user connected with no room')
    return
  }

  console.log('user connected to ' + roomName)
  // TODO: if there's no game object associated with this room, create one
  socket.join(roomName);

  socket.on('chat message', function(msg){
    console.log('sending ' + msg + ' to ' + roomName)
    io.to(roomName).emit('chat message', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
