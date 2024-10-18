const io = require('socket.io')(3000, { cors: { origin: "*" } });
const users = {};

let onlineUsers = 0;

io.on('connection', (socket) => {
 
  onlineUsers += 1;
  io.emit('increaseUserCount', onlineUsers);

  socket.on('userJoined', (name) => {
    if (name && !users[socket.id]) {  
      console.log("New user", name);
      users[socket.id] = name;
      socket.broadcast.emit('user-joined', { name: users[socket.id], concurrentUsers: onlineUsers });
    }
  });

  socket.on('send', (data) => {
   
    if (users[socket.id]) {
      socket.broadcast.emit('receive', { message: data.message, name: users[socket.id], id: data.id });
    }
  });

  socket.on('disconnect', () => {
    if (users[socket.id]) {
    
      onlineUsers -= 1;
      socket.broadcast.emit('disconnected', { name: users[socket.id], concurrentUsers: onlineUsers });
      delete users[socket.id];
      io.emit('increaseUserCount', onlineUsers);
    }
  });
});
