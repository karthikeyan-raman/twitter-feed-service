'use strict';

const path = require('path');

module.exports = {
  entry: './lib/static/app.jsx',
  output: {
    path: path.resolve(__dirname, './lib/public'),
    publicPath: '/public/',
    filename: 'bundle.js',
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /(node_modules)/,
      loader: 'babel-loader',
      options: {
        presets: ['env', 'react'],
      },
    },
    {
      test: /\.css?$/,
      exclude: /(node_modules)/,
      use: ['style-loader', 'css-loader'],
    },
    ],
  },
};
