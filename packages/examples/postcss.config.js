module.exports = {
  plugins: [
    require('autoprefixer')({
      browsers: require('./package.json').browserslist
    })
  ]
}
