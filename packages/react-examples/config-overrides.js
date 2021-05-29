const {
  override,
  addWebpackAlias,
  removeModuleScopePlugin,
} = require('customize-cra')
const path = require('path')

const resolve = (dir) => {
  return path.resolve(__dirname, dir)
}

const customWebpackConfig = (config) => {
  const oneOf = config.module.rules.find((rule) => rule.oneOf).oneOf

  // 修改 file-loader 配置
  oneOf.map((rule) => {
    if (
      Array.isArray(rule.test) &&
      rule.options.name === 'static/media/[name].[hash:8].[ext]'
    ) {
      rule.options.esModule = false
    }
    return rule
  })

  // 添加 stylus-loader
  const stylusLoader = {
    test: /\.styl$/,
    use: [
      {
        loader: 'style-loader',
      },
      {
        loader: 'css-loader',
      },
      {
        loader: 'stylus-loader',
      },
    ],
  }
  oneOf.unshift(stylusLoader)

  return config
}

module.exports = override(
  addWebpackAlias({
    '@': resolve('src'),
    common: resolve('common'),
  }),
  removeModuleScopePlugin(),
  customWebpackConfig
)
