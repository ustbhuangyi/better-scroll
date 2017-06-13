const fs = require('fs')
const path = require('path')
const rollup = require('rollup')
const version = require('../package.json').version
const babel = require('rollup-plugin-babel')

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist')
}

function resolve(p) {
  return path.resolve(__dirname, '../', p)
}

const banner =
  '/*!\n' +
  ' * better-scroll v' + version + '\n' +
  ' * (c) 2016-' + new Date().getFullYear() + ' ustbhuangyi\n' +
  ' * Released under the MIT License.\n' +
  ' */'

const config = {
  entry: resolve('src/index.js'),
  dest: resolve('dist/bscroll.js'),
  format: 'umd',
  moduleName: 'BScroll',
  plugins: [
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    })
  ],
  banner
}

function build() {
  return rollup.rollup(config).then((bundle) => {
    const code = bundle.generate(config).code
    return write(config.dest, code)
  }).catch((e) => {
    console.log(e)
  })
}

function write(dest, code) {
  return new Promise((resolve, reject) => {
    function report(extra) {
      console.log(blue(path.relative(process.cwd(), dest)) + ' ' + getSize(code) + (extra || ''))
      resolve()
    }

    fs.writeFile(dest, code, (err) => {
      if (err) {
        return reject(err)
      }
      report()
    })
  })
}

function getSize(code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

function blue(str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}


build()