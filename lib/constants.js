'use strict';

// TODO Should be stored in cloud service ex: AWS Secret Manager etc for security and to support secret rotation

const COOKIE_SECRET = '18C943BE05CFB2F8E6066A3C6A9ABBDBDB352EE6EB91C40505D85C27E46832ABC39AEAA6C5F1E45F052754BE2DF2C425C05268C4A0FDCEC70BF2D58C3B8D1EA3';

exports.TWITTER_SECRETS = {
  consumerKey: '',
  consumerSecret: '',
  callbackUrl: 'http://localhost:8000/api/twitter-feed-service/v0/login/callback',
};

exports.SESSION_OPTIONS = {
  secret: COOKIE_SECRET,
  cookie: {
    maxAge: 269999999999,
    secure: false,
  },
  saveUninitialized: true,
  resave: true,
};
