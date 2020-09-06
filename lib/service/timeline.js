'use strict';

const Twitter = require('twitter-lite');

const { TWITTER_SECRETS } = require('../constants');

async function getTimeline(user) {
  const client = new Twitter({
    consumer_key: TWITTER_SECRETS.consumerKey,
    consumer_secret: TWITTER_SECRETS.consumerSecret,
    access_token_key: user.userToken,
    access_token_secret: user.userTokenSecret,
  });

  const tweets = await client.get('statuses/home_timeline');
  return tweets;
}

module.exports = {
  getTimeline,
};
