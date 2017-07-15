const webpack = require('webpack');

const config = {
  entry: './src/slider.ts',
  output: {
    filename: 'dist/slider.js'
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  module: {
    rules: [
      {test: /\.css$/, use: 'css-loader'},
      {test: /\.ts$/, use: 'ts-loader', exclude: /node_modules/}
    ]
  }
};

module.exports = config;