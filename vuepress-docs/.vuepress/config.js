const path = require('path')
function resolve(p) {
  return path.resolve(__dirname, '../../', p)
}
module.exports = {
  title: 'Better Scroll 2.0',
  description: 'Just playing around',
  locales: {
    '/': {
      lang: 'en-US',
      title: 'BetterScroll'
    },
    '/zh/': {
      lang: 'zh-CN',
      title: 'BetterScroll'
    }
  },
  themeConfig: {
    locales: {
      '/zh/': {
        label: '简体中文',
        selectText: '选择语言',
        nav: require('./nav/zh.js'),
        sidebar: {
          '/zh/guide/': require('./sidebar/guide.js')('zh'),
          '/zh/plugins/': require('./sidebar/plugins.js')('zh')
        }
      },
      '/': {
        label: 'English',
        selectText: 'Languages',
        nav: require('./nav/en.js'),
        sidebar: {
          '/guide/': require('./sidebar/guide.js')('en'),
          '/plugins/': require('./sidebar/plugins.js')('en')
        }
      }
    }
  },
  configureWebpack: {
    resolve: {
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
          name: 'ZoomView',
          path: resolve('example/pages/zoom.vue')
        }
      ]
    }]
  ]
}