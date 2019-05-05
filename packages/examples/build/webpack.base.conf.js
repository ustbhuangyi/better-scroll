var path = require('path')
var config = require('./config')
var VueLoaderPlugin = require('vue-loader/lib/plugin')
var MiniCssExtractPlugin = require('mini-css-extract-plugin')
var utils = require('./utils')
var fs = require('fs')

function resolve(dir) {
    return path.join(__dirname, '../', dir)
}
module.exports = {
    entry: {
        app: './vue/main.js'
    },
    output: {
        path: config.dev.path,
        publicPath: process.env.NODE_ENV === 'production' ?
            config.build.assetsPublicPath :
            config.dev.assetsPublicPath,
        filename: '[name].js',
        chunkFilename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.vue', '.json', '.ts'],
        alias: {
            'vue-example': resolve('vue'),
            'common': resolve('common')
        }
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('common'), resolve('vue')],
                query: {
                    presets: ["@babel/preset-env"]
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
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true
                }
            },
            {
                test: /\.css$/,
                use: [
                    process.env.NODE_ENV !== 'production' ?
                    'vue-style-loader' :
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /.styl(us)?$/,
                use: [
                    process.env.NODE_ENV !== 'production' ?
                    'vue-style-loader' :
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'stylus-loader'
                ]
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[contenthash].css'
        })
    ]
}

function getPackagesName() {
    let ret
    let all = fs.readdirSync(resolve('../../packages'))
    console.log(all)
        // drop hidden file whose name is startWidth '.'
        // drop packages which would not be published(eg: examples and docs)
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
getPackagesName().forEach((name) => {
    module.exports.resolve.alias[name + '$'] = `${name}/src/index.ts`
})