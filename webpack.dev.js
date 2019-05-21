const baseConfig = require('./webpack.base.js')
const merge = require('webpack-merge')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = merge(baseConfig, {
  devServer: {
    compress: true,
    hot: true,
    watchContentBase: true
  },
  devtool: 'source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin([{
      from: './static',
      to: 'static'
    }]),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, 'index.html')
    })
  ]
})
