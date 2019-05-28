var ora = require('ora')
var rm = require('rimraf')
var path = require('path')
var chalk = require('chalk')
var webpack = require('webpack')
var webpackConfig = require('./vue-webpack.conf.js')

var spinner = ora('building for production...')
spinner.start()
const assetsRoot = path.join(__dirname, '../dist/vue')
console.log(chalk.red(assetsRoot))
rm(assetsRoot, err => {
    if (err) throw err
    webpack(webpackConfig, function(err, stats) {
        spinner.stop()
        if (err) throw err
        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }) + '\n\n')

        console.log(chalk.cyan('  Build complete.\n'))
        console.log(chalk.yellow(
            '  Tip: built files are meant to be served over an HTTP server.\n' +
            '  Opening index.html over file:// won\'t work.\n'
        ))
    })
})
