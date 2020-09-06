'use strict';

const { getTimeline } = require('../service/timeline');

const getUserTimeline = async (req, res) => {
  try {
    const { user } = req;
    const timeline = await getTimeline(user);
    res.status(200).json(timeline);
  } catch (err) {
    console.log('Error occured', err.message);
    res.status(500).json({ message: 'Internal server error occured!!!' });
  }
};

module.exports = {
  getUserTimeline,
};
