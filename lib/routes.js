'use strict';

const express = require('express');
const TwitterLogin = require('./controller/twitter-login');
const TwitterTimeLine = require('./controller/twitter-timeline');
const OptionController = require('./controller/options');
const { getToken } = require('./service/user-token');

const router = express.Router();

const authMiddleware = async (req, res, next) => {
  const { sessionId } = req.session || {};
  if (!sessionId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const user = await getToken(sessionId);
  req.user = user;
  next();
};
function routes(io) {
  const socketMiddleware = (req, _, next) => {
    req.io = io;
    if (req.query && req.query.socketId) {
      req.session.socketId = req.query.socketId;
    }
    next();
  };

  router.get('/ping', (_, res) => {
    res.status(200).json({ message: 'ok' });
  });

  router.get('/tweets', (_, res) => {
    res.sendFile(`${__dirname}/home.html`);
  });
  router.get('/twitter-login', TwitterLogin.login);
  router.get('/login/callback', socketMiddleware, TwitterLogin.loginCallback);

  router.get('/user-timeline', authMiddleware, TwitterTimeLine.getUserTimeline);
  router.get('/user-option', authMiddleware, OptionController.getUserOption);
  router.post('/user-option', authMiddleware, OptionController.setUserOption);
  return router;
}
module.exports = {
  routes,
};
