module.exports = {
  plugins: [
    require('autoprefixer')({
      browsers: [
        "> 1%",
        "last 2 versions",
        "not ie <= 8",
        "iOS 8"
      ]
    })
  ]
}
