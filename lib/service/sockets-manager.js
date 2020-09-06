'use strict';

let sockets = new Map();

class SocketsManager {
  static setSocket(key, value) {
    sockets.set(key, value);
  }

  static getSocket(key) {
    return sockets.get(key);
  }

  static deleteSocket(key) {
    return sockets.delete(key);
  }

  static getKeys() {
    return sockets.keys();
  }

  static getAll() {
    return sockets.entries();
  }

  static deleteAll() {
    sockets = new Set();
  }

  static getSocketByUser(userId) {
    for (const [key, value] of sockets.entries()) {
      if (value === userId) {
        return key;
      }
    }
  }

  static getSocketBySocketId(socketId) {
    for (const [key] of sockets.entries()) {
      if (key.id === socketId) {
        return key;
      }
    }
  }

  static init(io) {
    io.sockets.on('connection', (socket) => {
      SocketsManager.setSocket(socket, null);

      socket.on('disconnect', () => {
        console.log('Got disconnect!');
        SocketsManager.deleteSocket(socket);
      });
    });
  }
}

module.exports = {
  SocketsManager,
};
