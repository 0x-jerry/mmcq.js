const merge = require('webpack-merge');
const path = require('path');

const baseConfig = {
  entry: './lib/ExtImgColor.js',
  mode: 'production',
  output: {
    library: 'ExtImgColor'
  },
  module: {
    rules: [{
      test: /.js?$/,
      include: [path.resolve(__dirname, 'lib')],
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env']
      }
    }]
  },
};

module.exports = [
  merge(baseConfig, {
    output: {
      filename: 'ExtImgColor-window.js',
      libraryTarget: 'umd2'
    }
  }),
  merge(baseConfig, {
    output: {
      filename: 'ExtImgColor-node.js',
      libraryTarget: 'commonjs2'
    }
  })
];
