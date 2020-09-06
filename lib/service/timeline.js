'use strict';

const Twitter = require('twitter-lite');

const e = require('express');
const { TWITTER_SECRETS } = require('../constants');
const redis = require('../dal/redis');
const { SocketsManager } = require('./sockets-manager');

async function getTimeline(user) {
  const client = new Twitter({
    consumer_key: TWITTER_SECRETS.consumerKey,
    consumer_secret: TWITTER_SECRETS.consumerSecret,
    access_token_key: user.userToken,
    access_token_secret: user.userTokenSecret,
  });

  const sinceKey = `since:${user.userId}`;
  const since_id = await redis.getKey(sinceKey) || undefined; // eslint-disable-line camelcase

  const queryParams = {
    count: 9,
    exclude_replies: true,
    include_entities: false,
  };

  const tweets = await client.get('statuses/home_timeline', { ...queryParams, ...(since_id ? { since_id } : {}) }); // eslint-disable-line camelcase

  if (tweets && tweets[0]) {
    await redis.setKey(sinceKey, tweets[0].id);
  }
  return tweets;
}

function setupTweetStream(user) {
  const intervalId = setInterval(async () => {
    try {
      const newTweets = await getTimeline(user);
      console.log(`Retrieved tweets for the ${user.userId}, count: ${newTweets.length}`);
      if (newTweets && newTweets[0]) {
        const sinceKey = `since:${user.userId}`;
        await redis.setKey(sinceKey, newTweets[0].id);
        const socket = SocketsManager.getSocket(`usersocket:${user.userId}`);
        await SocketsManager.setSocket(`interval:${socket.id}`, intervalId);
        if (socket) {
          socket.emit('newtweets', newTweets);
        }
      }
    } catch (err) {
      const message = err.message || err.message || (err.errors && err.errors[0] && err.errors[0].message) || err;
      if (err._headers) {
        const rateLimiting = {
          totalLimit: err._headers.get('x-rate-limit-limit'),
          limitRemaining: err._headers.get('x-rate-limit-remaining'),
          limitReset: err._headers.get('x-rate-limit-reset'),
        };
        console.log('Rate limiting details', rateLimiting);
      }
      console.log(`Error fetching new tweets for user: ${user.userId}`, message);
    }
  }, (1e4 * 3));
}

module.exports = {
  getTimeline,
  setupTweetStream,
};
