const baseConfig = require('./webpack.base.js');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const sPath = require('path');

module.exports = merge(baseConfig, {
  entry: sPath.join(__dirname, 'src', 'comment.ts'),
  output: {
    library: 'ColorPalette',
  },
  plugins: [new CleanWebpackPlugin([sPath.join(__dirname, 'dist')])],
});
