'use strict';

const redis = require('../dal/redis');

const getUserOptionByTweet = async (userId, tweetId) => {
  return redis.getKey(`${userId}:${tweetId}`);
};

const setUserOptionByTweet = async (userId, tweetId, optionId) => {
  return redis.setKey(`${userId}:${tweetId}`, { optionId });
};

module.exports = {
  getUserOptionByTweet,
  setUserOptionByTweet,
};
