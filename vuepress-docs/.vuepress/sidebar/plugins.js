const introContent = {
  'zh': '插件介绍',
  'en': 'Plugins Guide'
}
const pluginContent = {
  'zh': '插件',
  'en': 'Plugins'
}
const getPluginsSideBar = function (lang) {
  return [
    {
      title: introContent[lang],
      collapsable: false,
      children: [
        '',
        'how-to-write'
      ]
    },
    {
      title: pluginContent[lang],
      collapsable: false,
      children: [
        'mouse-wheel',
        'observe-dom',
        'pulldown',
        'pullup',
        'scroll-bar',
        'slide',
        'wheel',
        'zoom'
      ]
    }
  ]
}
module.exports = getPluginsSideBar