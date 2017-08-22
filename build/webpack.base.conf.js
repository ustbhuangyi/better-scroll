var path = require('path')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
var utils = require('./utils')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

var srcAndExample = [resolve('src'), resolve('example')]

module.exports = {
  entry: {
    app: './example/main.js'
  },
  output: {
    path: config.dev.path,
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath,
    filename: '[name].js',
    chunkFilename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'scroll': resolve('src'),
      'example': resolve('example'),
      'common': resolve('example/common')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: srcAndExample,
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: srcAndExample,
        query: {
          presets: ['es2015', 'stage-2'],
          plugins: ['transform-runtime', 'add-module-exports']
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
    ]
  }
}
