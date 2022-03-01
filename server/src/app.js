require('dotenv').config();

const express = require('express');
const PORT = process.env.PORT || 4000;
const db = require('./configs/connectDb');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mainRouter = require('./routes/mainRouter');
const sendMail = require('./utils/sendEmail');
const { createServer } = require('http');
const { Server } = require('socket.io');

//Connect database
db();

//Create app server
const app = express();
const httpServer = createServer(app);

//Setting socket
const io = new Server(httpServer, {
  cors: {
    origin: process.env.URL_CLIENT,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('connection');
  socket.emit('status', 'Hello from Socket.io');

  socket.on('disconnect', () => {
    console.log('client disconnected');
  });

  socket.on('join_room', (id) => {
    socket.join(id)
  });

  socket.on('leave_room', (id) => {
    socket.leave(id)
  });

  socket.on('new_comment', (id) => {
    socket.broadcast.to(id).emit('new_comment');
  })
});

//Config middleware
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost/3000',
    methods: 'POST, GET, PATCH, PUT, DELETE',
    credentials: true,
  })
);

//Routes
mainRouter(app);

//Server listen PORT
httpServer.listen(PORT, () => {
  console.log(`Server listen at http://localhost:${PORT}`);
});
