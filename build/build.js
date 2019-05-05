const fs = require('fs')
const path = require('path')
const rollup = require('rollup')
const version = require('../package.json').version
const zlib = require('zlib')
const typescript = require('rollup-plugin-typescript2')
const uglify = require('rollup-plugin-uglify').uglify
const program = require('commander')

function clearFs() {
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist')
  }
}

function resolve(p) {
  return path.resolve(__dirname, '../', p)
}

function trans2CamelCase(str){
  const re=/-(\w)/g;
  const newStr = str.replace(re, function ($0,$1){
      return $1.toUpperCase();
  })
  return newStr.charAt(0).toUpperCase() + newStr.slice(1);
}

const banner =
  '/*!\n' +
  ' * better-normal-scroll v' + version + '\n' +
  ' * (c) 2016-' + new Date().getFullYear() + ' ustbhuangyi\n' +
  ' * Released under the MIT License.\n' +
  ' */'
const bsConfig = {
  output: 'dist',
  entry: 'src/index.ts',
  libName: 'BScroll',
  fileName: 'bscroll'
}
const bsPluginsConfig = {
  rootPath: 'src/plugins',
  output: 'dist/lib',
  plugins: {
    'observe-dom': 'observe-dom/index.ts',
    'pull-down': 'pull-down/pull-down.ts',
    'pull-up': 'pull-up/pull-up.ts',
    'scroll-bar': 'scroll-bar/scroll-bar.ts',
    'slide': 'slide/index.ts',
    'wheel': 'wheel/index.ts',
    'zoom': 'zoom/index.ts'
  }
}
const buildType = [
  {
    format: 'umd',
    extend: 'js'
  },
  {
    format: 'es',
    extend: 'esm.js'
  },
  {
    format: 'umd',
    extend: 'min.js'
  }
]

function genRollupPlugins(isMin) {
  const tsConfig = {
    useTsconfigDeclarationDir: true
  }
  const plugins = []
    if (isMin) {
      plugins.push(uglify())
    }
  plugins.push(typescript(tsConfig))
  return plugins
}
function genBSBuildConfig(bsConfig, buildType) {
  const result = []
  buildType.forEach(type => {
    result.push({
      input: resolve(bsConfig.entry),
      output: {
        file: resolve(`${bsConfig.output}/${bsConfig.fileName.replace('.ts', '')}.${type.extend}`),
        name: bsConfig.libName,
        format: type.format,
        banner
      },
      plugins: genRollupPlugins(type.extend.indexOf('min')>-1)
    })
  })
  return result
}
function genPluginsBuildConfig(bsPluginsConfig, buildType, specialName) {
  const result = []
  buildType.forEach(type => {
    bsPluginsName = Object.keys(bsPluginsConfig.plugins)
    bsPluginsName.forEach(pluginName => {
      if (specialName && specialName !== pluginName) {
        return
      }
      const entryPath = `${bsPluginsConfig.rootPath}/${bsPluginsConfig.plugins[pluginName]}`
      const camelcaseName = trans2CamelCase(pluginName)
      result.push({
        input: resolve(entryPath),
        output: {
          file: resolve(`${bsPluginsConfig.output}/${pluginName.replace('.ts', '')}.${type.extend}`),
          name: camelcaseName,
          format: type.format,
          banner
        },
        plugins: genRollupPlugins(type.extend.indexOf('min')>-1)
      })
    })
  })
  return result
}

function build(builds) {
  let built = 0
  const total = builds.length
  const next = () => {
    buildEntry(builds[built], () => {
      builds[built-1] = null
      built++
      if (built < total) {
        next()
      }
    })
  }
  next()
}

function buildEntry(config, next) {
  const isProd = /min\.js$/.test(config.output.file)
  rollup.rollup(config).then((bundle) => {
    bundle.write(config.output).then((output) => {
      const code = output.code
      function report(extra) {
        console.log(chalk.blue(path.relative(process.cwd(), config.output.file)) + ' ' + getSize(code) + (extra || ''))
        next()
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
  }).catch(logError)
}

function getSize(code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

function logError(e) {
  console.log(e)
}

const buildHandler = {
  all: function () {
    const builds = genBSBuildConfig(bsConfig, buildType).concat(genPluginsBuildConfig(bsPluginsConfig, buildType))
    build(builds)
  },
  plugins: function () {
    const builds = genPluginsBuildConfig(bsPluginsConfig, buildType)
    build(builds)
  },
  specialName: function (name) {
    const builds = genPluginsBuildConfig(bsPluginsConfig, buildType, name)
    build(builds)
  }
}
program
.option('-SN, --special [value]', 'build options')
.parse(process.argv)

const buildHandlerType = program.special || 'all'
clearFs()
const handlerFn =
  buildHandler[buildHandlerType] ?
    buildHandler[buildHandlerType] :
    buildHandler['specialName']
handlerFn(buildHandlerType)
