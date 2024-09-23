const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Replace this with your React app URL once deployed
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Rooms and Users Data
let users = {};

// Listen for connections
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join a chat room
  socket.on('joinRoom', ({ username, room }) => {
    socket.join(room);
    users[socket.id] = { username, room };

    // Welcome current user
    socket.emit('message', { user: 'admin', text: `${username}, welcome to ${room}!` });

    // Notify others in the room
    socket.broadcast.to(room).emit('message', { user: 'admin', text: `${username} has joined the room.` });
  });

  // Handle message sending
  socket.on('sendMessage', (message) => {
    const user = users[socket.id];
    io.to(user.room).emit('message', { user: user.username, text: message });
  });

  // Disconnect
  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      io.to(user.room).emit('message', { user: 'admin', text: `${user.username} has left the room.` });
      delete users[socket.id];
    }
  });
});

// Start the server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
