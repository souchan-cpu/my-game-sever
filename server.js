const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: { origin: "*" }
});


let players = {};


io.on('connection', (socket) => {
  console.log('★Login:', socket.id);
  players[socket.id] = { x: 100, y: 100 };
  io.emit('currentPlayers', players);


  socket.on('playerMovement', (movementData) => {
    if (players[socket.id]) {
      players[socket.id].x = movementData.x;
      players[socket.id].y = movementData.y;
      socket.broadcast.emit('playerMoved', { id: socket.id, x: players[socket.id].x, y: players[socket.id].y });
    }
  });


  socket.on('disconnect', () => {
    console.log('👋 Logout:', socket.id);
    delete players[socket.id];
    io.emit('playerDisconnected', socket.id);
  });
});


const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log('🚀 Server running on port ' + PORT);
});