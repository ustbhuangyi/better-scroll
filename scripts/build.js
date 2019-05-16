const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const rollup = require('rollup')
const chalk = require('chalk')
const zlib = require('zlib')
const rimraf = require('rimraf')
const typescript = require('rollup-plugin-typescript2')
const uglify = require('rollup-plugin-uglify').uglify
const execa = require('execa')
const ora = require('ora')
const spinner = ora({
  prefixText: `${chalk.green('\n[building tasks]')}`
})

function getPackagesName () {
  let ret
  let all = fs.readdirSync(resolve('packages'))
  // drop hidden file whose name is startWidth '.'
  // drop packages which would not be published(eg: examples and docs)
  ret = all
        .filter(name => {
          const isHiddenFile = /^\./g.test(name)
          return !isHiddenFile
        }).filter(name => {
          const isPrivatePackages = require(resolve(`packages/${name}/package.json`)).private
          return !isPrivatePackages
        })

  return ret
}

function cleanPackagesOldDist(packagesName) {
  packagesName.forEach(name => {
    const distPath = resolve(`packages/${name}/dist`)
    const typePath = resolve(`packages/${name}/dist/types`)

    if (fs.existsSync(distPath)) {
      rimraf.sync(distPath)
    }

    fs.mkdirSync(distPath)
    fs.mkdirSync(typePath)
  })
}

function resolve(p) {
  return path.resolve(__dirname, '../', p)
}

function PascalCase(str){
  const re=/-(\w)/g;
  const newStr = str.replace(re, function (match, group1){
      return group1.toUpperCase();
  })
  return newStr.charAt(0).toUpperCase() + newStr.slice(1);
}

const generateBanner = (packageName) => {
  const { version }= require(resolve(`packages/${packageName}/package.json`))
  let ret =
  '/*!\n' +
  ' * better-scroll / ' + packageName + 'v' + version + '\n' +
  ' * (c) 2016-' + new Date().getFullYear() + ' ustbhuangyi\n' +
  ' * Released under the MIT License.\n' +
  ' */'
  return ret
}



const buildType = [
  {
    format: 'umd',
    ext: '.js'
  },
  {
    format: 'umd',
    ext: '.min.js'
  },
  {
    format: 'es',
    ext: '.esm.js'
  }
]

function generateBuildConfigs(packagesName) {
  const result = []
  packagesName.forEach(name => {
    buildType.forEach((type) => {
      let config = {
        input: resolve(`packages/${name}/src/index.ts`),
        output: {
          file: resolve(`packages/${name}/dist/${name}${type.ext}`),
          name: PascalCase(name),
          format: type.format,
          banner: generateBanner(name)
        },
        plugins: generateBuildPluginsConfigs(type.ext.indexOf('min')>-1, name)
      }
      // rollup will valiate config properties of config own and output a warning
      // put packageName in prototype to ignore warning
      Object.defineProperties(config, {
        'packageName': {
          value: name
        },
        'ext': {
          value: type.ext
        }
      })
      result.push(config)
    })
  })
  return result
}
function generateBuildPluginsConfigs(isMin, packageName) {
  const tsConfig = {
    verbosity: -1,
    tsconfig: `./packages/${packageName}/tsconfig.json`
  }
  const plugins = []
    if (isMin) {
      plugins.push(uglify())
    }
  plugins.push(typescript(tsConfig))
  return plugins
}

function build(builds) {
  let built = 0
  const total = builds.length
  const next = () => {
    buildEntry(builds[built], built + 1, () => {
      builds[built-1] = null
      built++
      if (built < total) {
        next()
      }
    })
  }
  next()
}

function buildEntry(config, curIndex, next) {
  const isProd = /min\.js$/.test(config.output.file)

  spinner.start(`${config.packageName}${config.ext} is buiding now. \n`)

  rollup.rollup(config).then((bundle) => {
    bundle.write(config.output).then(({ output }) => {
      const code = output[0].code

      spinner.succeed(`${config.packageName}${config.ext} building has ended.`)

      function report(extra) {
        console.log(chalk.magenta(path.relative(process.cwd(), config.output.file)) + ' ' + getSize(code) + (extra || ''))
        next()
      }
      if (isProd) {
        zlib.gzip(code, (err, zipped) => {
          if (err) return reject(err)
          let words =  `(gzipped: ${chalk.magenta(getSize(zipped))})`
          report(words)
        })
      } else {
        report()
      }

      // since we need bundle code for three types
      // just generate .d.ts only once
      if (curIndex % 3 === 0) {
        copyDTSFiles(config.packageName)
      }
    })
  }).catch((e) => {
    console.log(e)
  })
}

function copyDTSFiles (packageName) {
  console.log(chalk.cyan('> start copying .d.ts file to dist dir of packages own.'))
  const sourceDir = resolve(`packages/${packageName}/dist/packages/${packageName}/src/*`)
  const targetDir = resolve(`packages/${packageName}/dist/types/`)
  execa.shellSync(`mv ${sourceDir} ${targetDir}`)
  console.log(chalk.cyan('> copy job is done.'))

  rimraf.sync(resolve(`packages/${packageName}/dist/packages`))
  rimraf.sync(resolve(`packages/${packageName}/dist/node_modules`))
}

function getSize(code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

const getAnswersFromInquirer = async (packagesName) => {
  const question = {
    type: 'checkbox',
    name: 'packages',
    scroll: false,
    message: 'Select build repo(Support Multiple selection)',
    choices: packagesName.map(name => ({
      value: name,
      name
    }))
  }
  let { packages } = await inquirer.prompt(question)
  // make no choice
  if (!packages.length) {
    console.log(chalk.yellow(`
      It seems that you did't make a choice.

      Please try it again.
    `))
    return
  }

  // chose 'all' option
  if (packages.some(package => package === 'all')) {
    packages = getPackagesName()
  }
  const { yes } = await inquirer.prompt([{
    name: 'yes',
    message: `Confirm build ${packages.join(' and ')} packages?`,
    type: 'list',
    choices: ['Y', 'N']
  }])

  if (yes === 'N') {
    console.log(chalk.yellow('[release] cancelled.'))
    return
  }

  return packages
}
const buildBootstrap = async () => {
  const packagesName = getPackagesName()
  // provide 'all' option
  packagesName.unshift('all')

  const answers = await getAnswersFromInquirer(packagesName)

  if (!answers) return

  cleanPackagesOldDist(answers)

  const buildConfigs = generateBuildConfigs(answers)

  build(buildConfigs)

}
buildBootstrap().catch(err => {
  console.error(err)
  process.exit(1)
})
