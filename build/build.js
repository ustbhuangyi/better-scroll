var path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    libraryTarget: "umd",
    path: path.resolve('./dist'),
    filename: 'bscroll.js',
    chunkFilename: 'bscroll.min.js'
  },
  // resolve: {
  //   extensions: ['.js', '.vue', '.json'],
  //   alias: {
  //     'scroll': resolve('src'),
  //     'example': resolve('example'),
  //     'common': resolve('example/common')
  //   }
  // },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'stage-2'],
        plugins: ['transform-runtime', 'add-module-exports']
      }
    }]
  }
}
