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
    typescript({
      useTsconfigDeclarationDir: true
    })
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
    typescript({
      useTsconfigDeclarationDir: true
    })
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
    typescript({
      useTsconfigDeclarationDir: true
    })
  ]
}, {
  input: resolve('src/plugins/slide/index.ts'),
  output: {
    file: resolve('dist/slide.js'),
    name: 'Slide',
    format: 'umd',
    banner
  },
  plugins: [
    typescript({
      useTsconfigDeclarationDir: true
    })
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
    return new Promise((resolve, reject) => {
      bundle.write(config.output).then((output) => {
        const code = output.code
        function report(extra) {
          console.log(blue(path.relative(process.cwd(), config.output.file)) + ' ' + getSize(code) + (extra || ''))
          resolve()
        }
        if (isProd) {
          zlib.gzip(code, (err, zipped) => {
            if (err) return reject(err)
            report(' (gzipped: ' + getSize(zipped) + ')')
          })
        } else {
          report()
        }
      })
    })
  }).catch(logError)
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
