const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  entry: './src/index',
  output: {
    filename: 'bscroll.js',
    library: 'BScroll',
    libraryTarget: 'umd',
    publicPath: '/assets/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src')],
        query: {
          presets: ['es2015', 'stage-2'],
          plugins: ['transform-runtime', 'add-module-exports']
        }
      }
    ]
  }
};