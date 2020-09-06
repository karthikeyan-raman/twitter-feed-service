'use strict';

const { getTimeline, setupTweetStream } = require('../service/timeline');

const getUserTimeline = async (req, res) => {
  try {
    const { user } = req;
    const timeline = await getTimeline(user);
    setupTweetStream(user);
    res.status(200).json(timeline);
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
    console.log('Error occurred', message);
    res.status(500).json({ message: 'Internal server error occured!!!' });
  }
};

module.exports = {
  getUserTimeline,
};
