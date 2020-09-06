'use strict';

const { getUserOptionByTweet, setUserOptionByTweet } = require('../service/options');

async function getUserOption(req, res) {
  try {
    const { userId } = req.user;
    const { tweetId } = req.query;
    const { optionId = null } = await getUserOptionByTweet(userId, tweetId) || {};
    return res.status(200).json({ optionId });
  } catch (err) {
    console.log('Error occured', err.message);
    res.status(500).json({ message: 'Internal server error occured!!!' });
  }
}

async function setUserOption(req, res) {
  try {
    const { userId } = req.user;
    const { tweetId, optionId } = req.body;
    await setUserOptionByTweet(userId, tweetId, optionId);
    return res.status(200).json({ tweetId, optionId });
  } catch (err) {
    console.log('Error occured', err.message);
    res.status(500).json({ message: 'Internal server error occured!!!' });
  }
}

module.exports = {
  getUserOption,
  setUserOption,
};
