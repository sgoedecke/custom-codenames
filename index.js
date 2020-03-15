var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  const roomName = socket.handshake.query.roomName;
  if (!roomName) {
    console.log('user connected with no room')
    return
  }

  console.log('user connected to ' + roomName)
  socket.join(roomName);

  socket.on('chat message', function(msg){
    console.log('sending ' + msg + ' to ' + roomName)
    io.to(roomName).emit('chat message', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
