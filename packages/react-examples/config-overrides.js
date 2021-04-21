const { override, addWebpackAlias, removeModuleScopePlugin } = require('customize-cra')
const path = require('path')

const resolve = (dir) => {
  return path.resolve(__dirname, dir)
}

const addStylus = () => (config) => {
  const stylusLoader = {
    test: /\.styl$/,
    use: [
      {
        loader: 'style-loader'
      },
      {
        loader: 'css-loader'
      },
      {
        loader: 'stylus-loader'
      }
    ]
  }
  const oneOf = config.module.rules.find((rule) => rule.oneOf).oneOf
  oneOf.unshift(stylusLoader)
  return config
}

module.exports = override(
  addWebpackAlias({
    '@': resolve('src'),
    common: resolve('common')
  }),
  removeModuleScopePlugin(),
  addStylus()
)
