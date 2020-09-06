'use strict';

const ioredis = require('ioredis');

let client = null;

function getClient() {
  if (client) {
    return client;
  }
  try {
    client = new ioredis();
    return client;
  } catch (err) {
    console.error('Error in initializing redis client', err);
    throw err;
  }
}

async function setKey(key, value, ttl = null) {
  try {
    const val = JSON.stringify(value);
    if (ttl === null) {
      return await getClient().set(key, val);
    }

    const relativeTTL = ttl - (new Date().valueOf());
    return await getClient().set(key, val, 'PX', Math.max(0, relativeTTL));
  } catch (err) {
    console.error('error in setKey', key, err);
    throw err;
  }
}

async function getKey(key) {
  try {
    const value = await getClient().get(key);
    return JSON.parse(value);
  } catch (err) {
    console.error('error in getKey', key, err);
    throw err;
  }
}

module.exports = {
  setKey,
  getKey,
};
