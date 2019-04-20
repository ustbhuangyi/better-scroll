const markdownPluginInlinePlugin = require('./inline-snippet.js')

module.exports = {
  name: 'enhance-plugin',
  chainMarkdown(config) {
    config.plugin('enhance-snippet')
      .use(markdownPluginInlinePlugin)
  }
}