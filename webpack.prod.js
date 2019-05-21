const baseConfig = require('./webpack.base.js')
const merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const sPath = require('path')

module.exports = [
  merge(baseConfig, {
    entry: sPath.join(__dirname, 'src', 'index.ts'),
    output: {
      filename: 'index.js',
      path: sPath.join(__dirname, 'dist')
    },
    plugins: [new CleanWebpackPlugin([sPath.join(__dirname, 'dist')])]
  }),
  merge(baseConfig, {
    entry: sPath.join(__dirname, 'src', 'lib', 'core.ts'),
    output: {
      path: sPath.join(__dirname, 'dist'),
      filename: 'lib.js',
      libraryTarget: 'umd',
      globalObject: 'this'
    }
  })
]
