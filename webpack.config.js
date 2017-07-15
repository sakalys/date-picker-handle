const webpack = require('webpack');

const config = {
  entry: './src/range.js',
  output: {
    filename: 'dist/range.js'
  },
  module: {
    rules: [{
      test: /\.js$/, // files ending with .js
      exclude: /node_modules/, // exclude the node_modules directory
      loader: "babel-loader" // use this (babel-core) loader
    }]
  }
};

module.exports = config;