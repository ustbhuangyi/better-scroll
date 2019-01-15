const fs = require('fs')
const path = require('path')
const rollup = require('rollup')
const version = require('../package.json').version
const zlib = require('zlib')
const typescript = require('rollup-plugin-typescript2')
const uglify = require('rollup-plugin-uglify').uglify

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist')
}

function resolve(p) {
  return path.resolve(__dirname, '../', p)
}

const banner =
  '/*!\n' +
  ' * better-normal-scroll v' + version + '\n' +
  ' * (c) 2016-' + new Date().getFullYear() + ' ustbhuangyi\n' +
  ' * Released under the MIT License.\n' +
  ' */'

const builds = [{
  input: resolve('src/index.ts'),
  output: {
    file: resolve('dist/bscroll.js'),
    name: 'BScroll',
    format: 'umd',
    banner
  },
  plugins: [
    typescript()
  ]
}, {
  input: resolve('src/index.ts'),
  output: {
    file: resolve('dist/bscroll.esm.js'),
    name: 'BScroll',
    format: 'es',
    banner
  },
  plugins: [
    typescript()
  ]
}, {
  input: resolve('src/index.ts'),
  output: {
    file: resolve('dist/bscroll.min.js'),
    name: 'BScroll',
    format: 'umd',
    banner
  },
  plugins: [
    uglify(),
    typescript()
  ]
}]

function build(builds) {
  let built = 0
  const total = builds.length
  const next = () => {
    buildEntry(builds[built]).then(() => {
      built++
      if (built < total) {
        next()
      }
    }).catch(logError)
  }

  next()
}

function buildEntry(config) {
  const isProd = /min\.js$/.test(config.output.file)
  return rollup.rollup(config).then((bundle) => {
    bundle.generate(config).then(({ code }) => {
      return write(config.output.file, code, isProd)
    })
  }).catch(logError)
}

function write(dest, code, zip) {
  return new Promise((resolve, reject) => {
    function report(extra) {
      console.log(blue(path.relative(process.cwd(), dest)) + ' ' + getSize(code) + (extra || ''))
      resolve()
    }
    console.log(dest)
    fs.writeFile(dest, code, (err) => {
      if (err) {
        return reject(err)
      }
      console.log('------------')
      console.log(zip)
      if (zip) {
        zlib.gzip(code, (err, zipped) => {
          if (err) return reject(err)
          report(' (gzipped: ' + getSize(zipped) + ')')
        })
      } else {
        report()
      }
    })
  })
}

function getSize(code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

function blue(str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}

function logError(e) {
  console.log(e)
}

build(builds)
