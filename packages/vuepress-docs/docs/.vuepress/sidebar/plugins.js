const introContent = {
  'zh-US': '插件介绍',
  'en-US': 'Plugins Guide'
}
const pluginContent = {
  'zh-US': '插件',
  'en-US': 'Plugins'
}
const highPluginContent = {
  'zh-US': '插件的高阶使用',
  'en-US': 'High Level Use Of Plugins'
}
const getPluginsSideBar = function (lang) {
  return [
    {
      title: introContent[lang],
      collapsable: false,
      children: [
        '',
        'how-to-write',
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
        'zoom',
        'nested-scroll',
        'infinity',
        'movable'
      ]
    },
    {
      title: highPluginContent[lang],
      collapsable: false,
      children: [
        'compose-plugins'
      ]
    }
  ]
}
module.exports = getPluginsSideBar
