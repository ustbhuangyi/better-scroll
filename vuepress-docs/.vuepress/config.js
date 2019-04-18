const path = require('path')
function resolve(p) {
  return path.resolve(__dirname, '../../', p)
}
module.exports = {
  title: 'Better Scroll 2.0',
  description: 'Just playing around',
  locales: {
    '/en-US/': {
      lang: 'en-US',
      title: 'BetterScroll'
    },
    '/zh-CN/': {
      lang: 'zh-CN',
      title: 'BetterScroll'
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
          '/zh-CN/FAQ/':  require('./sidebar/FAQ.js')('zh-CN')
        }
      },
      '/en-US/': {
        label: 'English',
        selectText: 'Languages',
        nav: require('./nav/en-US.js'),
        sidebar: {
          '/en-US/guide/': require('./sidebar/guide.js')('en-US'),
          '/en-US/plugins/': require('./sidebar/plugins.js')('en-US'),
          '/en-US/FAQ/':  require('./sidebar/FAQ.js')('en-US')
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
        },
        {
          test: /\.code$/,
          loader: require.resolve(path.resolve(__dirname, './markdown-tpl-loader')),
          options: {
            sourceDir: path.resolve(__dirname, '../../')
          }
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.vue', '.json', '.ts'],
      alias: {
        'scroll': resolve('src'),
        'example': resolve('example'),
        'common': resolve('example/common'),
        '@': resolve('src')
      }
    }
  },
  plugins: [
    ['@vuepress/register-components', {
      components: [
        {
          name: 'Zoom',
          path: resolve('example/components/zoom/zoom.vue')
        }
      ]
    }]
  ]
}
