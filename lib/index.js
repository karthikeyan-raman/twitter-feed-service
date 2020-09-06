'use strict';

const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const http = require('http');
const socket = require('socket.io');
const { routes } = require('./routes');
const { SocketsManager } = require('./service/sockets-manager');
const { SESSION_OPTIONS } = require('./constants');

const app = express();
const jsonParser = bodyParser.json();
const port = 8000;

const server = http.createServer(app);
const io = socket(server);

app.use(session(SESSION_OPTIONS));
app.use(jsonParser);
SocketsManager.init(io);
app.use((req, _, next) => {
  req.io = io;
  if (req.query && req.query.socketId) {
    req.session.socketId = req.query.socketId;
  }
  next();
});

app.use('/api/twitter-feed-service/v0/', routes(io));
app.use('/api/twitter-feed-service/v0/', express.static(path.join(__dirname, 'public')));

server.listen(port, () => {
  console.log('listening on *:8000');
});
