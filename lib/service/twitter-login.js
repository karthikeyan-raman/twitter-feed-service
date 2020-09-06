'use strict';

const LoginWithTwitter = require('login-with-twitter');
const { TWITTER_SECRETS } = require('../constants');

const Twitter = new LoginWithTwitter({
  consumerKey: TWITTER_SECRETS.consumerKey,
  consumerSecret: TWITTER_SECRETS.consumerSecret,
  callbackUrl: TWITTER_SECRETS.callbackUrl,
});

function getTwitterSecretAndUrl() {
  return new Promise((resolve, reject) => {
    return Twitter.login((err, tokenSecret, url) => {
      if (err) {
        reject(err);
      }
      return resolve({ tokenSecret, url });
    });
  });
}

const login = async () => {
  const { tokenSecret, url } = await getTwitterSecretAndUrl();
  return { tokenSecret, url };
};

function getTwitterUserToken(oauthToken, oauthVerifier, tokenSecret) {
  return new Promise((resolve, reject) => {
    return Twitter.callback({ oauth_token: oauthToken, oauth_verifier: oauthVerifier }, tokenSecret, (err, user) => {
      if (err) {
        return reject(err);
      }
      return resolve(user);
    });
  });
}

module.exports = {
  login,
  getTwitterUserToken,
};
