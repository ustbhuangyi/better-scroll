const Config = require('webpack-chain')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const webpackBar = require('webpackbar')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const path = require('path')
const fs = require('fs')
const { e2e } = require('yargs').argv
const execa = require('execa')
const isProd = process.env.NODE_ENV === 'production'

function resolve(dir) {
  return path.join(__dirname, '../', dir)
}

const webpackConfig = new Config()

webpackConfig
  .mode(isProd ? 'production' : 'development')
  .devtool(isProd ? 'false' : 'eval-source-map')
  .entry('app')
    .add('./vue/main.js')
    .end()
  .output
    .path(isProd ? path.resolve(__dirname, '../dist/vue') : undefined)
    .publicPath(isProd ? '' : '/')
    .filename(isProd ? 'static/js/[name].[chunkhash].js' : '[name].js')
    .chunkFilename(isProd ? 'static/js/[id].[chunkhash].js' : '[name].js')
    .end()
  .resolve
    .alias
      .set('vue-example', resolve('vue'))
      .set('common', resolve('common'))
      .end()
    .extensions
      .add('.js')
      .add('.vue')
      .add('.json')
      .add('.ts')
      .end()
    .end()
  .module
    .rule('compileVue')
      .test(/\.vue$/)
      .use('vue')
        .loader('vue-loader')
        .end()
      .end()
    .rule('transformJs')
      .test(/\.js$/)
      .use('babel')
        .loader('babel-loader')
        .options({
          presets: ["@babel/preset-env"]
        })
        .end()
      .include
        .add(resolve('common'))
        .add(resolve('vue'))
        .end()
      .end()
    .rule('url')
      .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
      .use('url')
        .loader('url-loader')
        .options({
          limit: 10000,
          name: 'static/img/[name].[hash:7].[ext]'
        })
        .end()
      .end()
    .rule('ts')
      .test(/\.ts$/)
      .use('ts')
        .loader('ts-loader')
        .options({
          transpileOnly: true
        })
        .end()
      .end()
    .rule('css')
      .test(/\.css$/)
      .use('style-loader')
        .loader(
          process.env.NODE_ENV !== 'production' ?
          'vue-style-loader' :
          MiniCssExtractPlugin.loader
        )
        .end()
      .use('css-loader')
        .loader('css-loader')
        .end()
      .end()
    .rule('stylus')
      .test(/.styl(us)?$/)
      .use('style-loader')
        .loader(
          process.env.NODE_ENV !== 'production' ?
          'vue-style-loader' :
          MiniCssExtractPlugin.loader
        )
        .end()
      .use('css-loader')
        .loader('css-loader')
        .end()
      .use('postcss-loader')
        .loader('postcss-loader')
        .end()
      .use('stylus-loader')
        .loader('stylus-loader')
        .end()
      .end()
    .end()
  .plugin('VueLoaderPlugin')
    .use(VueLoaderPlugin)
    .end()
  .plugin('WebpackBar')
    .use(webpackBar)
    .end()
  .plugin('MiniCssExtractPlugin')
    .use(MiniCssExtractPlugin, [{
      filename: 'static/css/[name].[contenthash].css'
    }])
    .end()
  .when(!isProd, () => {
    webpackConfig
      .devServer
        .open(true)
        .hot(true)
        .compress(true)
        .end()
      .plugin('HotModuleReplacementPlugin')
        .use(webpack.HotModuleReplacementPlugin)
        .end()
      .plugin('NoEmitOnErrorsPlugin')
        .use(webpack.NoEmitOnErrorsPlugin)
        .end()
      .plugin('HtmlWebpackPlugin')
        .use(HtmlWebpackPlugin, [{
          filename: 'index.html',
          template: './vue/index.html',
          inject: true
        }])
        .end()
      .plugin('FriendlyErrorsPlugin')
        .use(FriendlyErrorsPlugin)
        .end()
  }, () => {
    webpackConfig
      .optimization
        .minimizer('TerserPlugin')
          .use(TerserPlugin)
        .end()
      .end()
      .plugin('OptimizeCSSPlugin')
        .use(OptimizeCSSPlugin, [{
          cssProcessorOptions: {
            safe: true
          }
        }])
        .end()
      .plugin('HtmlWebpackPlugin')
        .use(HtmlWebpackPlugin, [{
          filename: 'index.html',
          template: './vue/index.html',
          inject: true,
          minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true
            // more options:
            // https://github.com/kangax/html-minifier#options-quick-reference
          },
          // necessary to consistently work with multiple chunks via CommonsChunkPlugin
          chunksSortMode: 'dependency'
        }])
        .end()
      .plugin('CopyWebpackPlugin')
        .use(CopyWebpackPlugin, [[{
          from: path.resolve(__dirname, '../static'),
          to: 'static',
          ignore: ['.*']
        }]])
        .end()
  })
function getPackagesName() {
  let ret
  let all = fs.readdirSync(resolve('../../packages'))

  // drop hidden file whose name is startWidth '.'
  // drop packages which would not be published(eg: examples and vuepress-docs)
  ret = all
          .filter(name => {
            const isHiddenFile = /^\./g.test(name)
            return !isHiddenFile
          })
          .filter(name => {
            const isPrivatePackages = require(resolve(`../../packages/${name}/package.json`)).private
            return !isPrivatePackages
          })
          .map((name) => {
            return require(resolve(`../../packages/${name}/package.json`)).name
          })

  return ret
}

// add alias
getPackagesName().forEach((name) => {
  webpackConfig.resolve.alias.set(`${name}$`, `${name}/src/index.ts`)
})

let config = webpackConfig.toConfig()
// run test e2e
if (e2e) {
  config.devServer.setup = (app, server) => {
    server.middleware.waitUntilValid(async () => {
      // back to src directory
      const cwd = path.join(__dirname, '../../')

      await execa('yarn', ['test:e2e'], { stdio: 'inherit', cwd })
    })
  }
}

module.exports = config
