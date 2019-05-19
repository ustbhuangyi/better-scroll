const guideContent = {
  'zh-CN': '指南',
  'en-US': 'Guide'
}
const baseScrollContent = {
  'zh-CN': '核心滚动',
  'en-US': 'Base Scroll'
}
const getGuideSideBar = function (lang) {
  return [
    {
      title: guideContent[lang],
      collapsable: false,
      children: [
        '',
        'how-to-install',
        'use'
      ]
    },
    {
      title: baseScrollContent[lang],
      collapsable: false,
      children: [
        'base-scroll',
        'base-scroll-options',
        'base-scroll-api'
      ]
    }
  ]
}
module.exports = getGuideSideBar
