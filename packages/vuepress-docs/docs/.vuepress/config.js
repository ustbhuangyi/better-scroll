const path = require('path')
const os = require('os')
const fs = require('fs')

function resolve(p) {
  return path.resolve(__dirname, '../../../', p)
}

module.exports = {
  base: '/docs/',
  publicPath: '/docs/',
  cache: false,
  locales: {
    '/en-US/': {
      lang: 'en-US',
      title: 'BetterScroll 2.0',
      description: 'Make Scroll Perfect'
    },
    '/zh-CN/': {
      lang: 'zh-CN',
      title: 'BetterScroll 2.0',
      description: 'Make Scroll Perfect'
    }
  },
  themeConfig: {
    locales: {
      '/zh-CN/': {
        label: '简体中文',
        selectText: '选择语言',
        nav: require('./nav/zh-CN.js'),
        sidebar: {
          '/zh-CN/guide/': require('./sidebar/guide.js')('zh-CN'),
          '/zh-CN/plugins/': require('./sidebar/plugins.js')('zh-CN'),
          '/zh-CN/FAQ/': require('./sidebar/FAQ.js')('zh-CN')
        }
      },
      '/en-US/': {
        label: 'English',
        selectText: 'Languages',
        nav: require('./nav/en-US.js'),
        sidebar: {
          '/en-US/guide/': require('./sidebar/guide.js')('en-US'),
          '/en-US/plugins/': require('./sidebar/plugins.js')('en-US'),
          '/en-US/FAQ/': require('./sidebar/FAQ.js')('en-US')
        }
      }
    }
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: {
            transpileOnly: true
          }
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.vue', '.json', '.ts'],
      alias: {
        common: resolve('examples/common')
      }
    }
  },
  define: {
    LOCAL_IP: getIp()
  },
  plugins: [
    [
      '@vuepress/register-components',
      {
        componentsDir: resolve('examples/vue/components')
      }
    ],
    [
      '@vuepress/medium-zoom',
      {
        selector: 'img',
        // medium-zoom options here
        // See: https://github.com/francoischalifour/medium-zoom#options
        options: {
          margin: 16
        }
      }
    ],
    require('./plugins/extract-code.js')
  ]
}

function getIp() {
  var networks = os.networkInterfaces()
  var found = '127.0.0.1'

  Object.keys(networks).forEach(function(k) {
    var n = networks[k]
    n.forEach(function(addr) {
      if (addr.family === 'IPv4' && !addr.internal) {
        found = addr.address
      }
    })
  })

  return found
}

function getPackagesName() {
  let ret
  let all = fs.readdirSync(resolve('../packages'))
  // drop hidden file whose name is startWidth '.'
  // drop packages which would not be published(eg: examples and docs)
  ret = all
    .filter(name => {
      const isHiddenFile = /^\./g.test(name)
      return !isHiddenFile
    })
    .filter(name => {
      const isPrivatePackages = require(resolve(
        `../packages/${name}/package.json`
      )).private
      return !isPrivatePackages
    })
    .map(name => {
      return require(resolve(`../packages/${name}/package.json`)).name
    })

  return ret
}
getPackagesName().forEach(name => {
  module.exports.configureWebpack.resolve.alias[
    name + '$'
  ] = `${name}/src/index.ts`
})
