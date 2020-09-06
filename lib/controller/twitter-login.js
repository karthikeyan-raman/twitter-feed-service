'use strict';

const userToken = require('../service/user-token');
const { SocketsManager } = require('../service/sockets-manager');
const { login: twitterLogin, getTwitterUserToken, resetSinceKey } = require('../service/twitter-login');

const setupSocket = (socketId, userId) => {
  const socket = SocketsManager.getSocketBySocketId(socketId);
  SocketsManager.setSocket(socket, userId);
  SocketsManager.setSocket(`usersocket:${userId}`, socket);
  return socket;
};

const login = async (req, res) => {
  try {
    const { tokenSecret, url } = await twitterLogin();
    req.session.tokenSecret = tokenSecret;
    return res.redirect(url);
  } catch (err) {
    console.log('Error occured', err.message);
    res.status(500).json({ message: 'Internal server error occured!!!' });
  }
};

const loginCallback = async (req, res) => {
  try {
    const { socketId } = req.session;
    const { oauth_token: oauthToken, oauth_verifier: oauthVerifier } = req.query;
    const user = await getTwitterUserToken(oauthToken, oauthVerifier, req.session.tokenSecret);
    const sessionKey = await userToken.setToken(user);
    delete req.session.tokenSecret; req.session.sessionId = sessionKey;
    setupSocket(socketId, user.userId);
    req.io.in(socketId).emit('session', sessionKey);
    await resetSinceKey(user.userId);
    res.end();
  } catch (err) {
    console.log('Error occured', err.message);
    res.status(500).json({ message: 'Internal server error occured!!!' });
  }
};

module.exports = {
  login,
  loginCallback,
};
