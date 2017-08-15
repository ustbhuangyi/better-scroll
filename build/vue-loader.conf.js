var utils = require('./utils')
var config = require('../config')
var isProduction = process.env.NODE_ENV === 'production'

var babel = {
  presets: ['es2015', 'stage-2'],
  plugins: ['transform-runtime', 'add-module-exports']
}

var loaders = utils.cssLoaders({
  sourceMap: isProduction
    ? config.build.productionSourceMap
    : config.dev.cssSourceMap,
  extract: isProduction
})

Object.assign(loaders, {js: `babel-loader?${JSON.stringify(babel)}`})

module.exports = {
  loaders
}
