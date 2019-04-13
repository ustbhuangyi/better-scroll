const path = require('path')
function resolve(p) {
  return path.resolve(__dirname, '../../', p)
}
module.exports = {
  title: 'Better Scroll 2.0',
  description: 'Just playing around',
  locales: {
    '/': {
      lang: 'english',
      title: 'BetterScroll'
    },
    '/zh/': {
      lang: '简体中文',
      title: 'BetterScroll'
    }
  },
  themeConfig: {
    locales: {
      '/zh/': {
        nav: [
          { text: '指南', link: '/zh/guide/' },
          { text: '插件开发', link: '/zh/plugins/' }, 
          { text: '常见问题', link: '' },
          { text: 'github', link: 'https://github.com/ustbhuangyi/better-scroll'},
          { text: '讨论', link: ''}
        ],
        sidebar: {
          '/guide/': [
            '',
            'zoom'
          ],
          '/plugins/': [
            '',
            'zoom'
          ]
        }
      },
      '/': {
        nav: [
          { text: 'Guide', link: '/guide/' },
          { text: 'Writing Plugin', link: '/plugins/' }, 
          { text: 'QA', link: '' },
          { text: 'github', link: 'https://github.com/ustbhuangyi/better-scroll'},
          { text: 'discuss', link: ''}
        ],
        sidebar: {
          '/guide/': [
            '',
            'zoom'
          ],
          '/plugins/': [
            '',
            'zoom'
          ]
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