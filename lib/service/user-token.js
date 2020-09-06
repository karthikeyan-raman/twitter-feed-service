'use strict';

const { v4: uuidv4 } = require('uuid');
const redis = require('../dal/redis');

async function setToken(user) {
  const sessionKey = uuidv4();
  await redis.setKey(sessionKey, user);
  return sessionKey;
}

function getToken(key) {
  return redis.getKey(key);
}

module.exports = {
  setToken,
  getToken,
};
