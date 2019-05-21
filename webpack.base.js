const isDev = process.env.NODE_ENV === 'development'
const sPath = require('path')

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: sPath.join(__dirname, 'src', 'index.ts'),
  output: {
    path: sPath.join(__dirname, 'dist'),
    publicPath: 'dist',
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        include: [
          sPath.join(__dirname, 'src')
        ],
        loader: 'ts-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx']
  }
}
