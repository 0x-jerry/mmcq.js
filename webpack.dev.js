const CopyWebpackPlugin = require('copy-webpack-plugin');
const baseConfig = require('./webpack.base.js');
const merge = require('webpack-merge');
const sPath = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(baseConfig, {
  devServer: {
    contentBase: [
      sPath.join(__dirname, 'dist'),
      sPath.join(__dirname, 'static'),
      sPath.join(__dirname, 'index.html'),
      sPath.join(__dirname, 'index.ts'),
    ],
    compress: true,
    port: process.env.PORT,
    hot: true,
    watchContentBase: true,
  },
  devtool: 'source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin([{ from: './static', to: 'static' }]),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: sPath.join(__dirname, 'index.html'),
    }),
  ],
});
