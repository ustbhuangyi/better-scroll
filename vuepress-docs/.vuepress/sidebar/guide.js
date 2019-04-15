const guideContent = {
  'zh': '指南',
  'en': 'Guide'
}
const baseScrollContent = {
  'zh': '核心滚动',
  'en': 'Base Scroll'
}
const getGuideSideBar = function (lang) {
  return [
    {
      title: guideContent[lang],
      collapsable: false,
      children: [
        '',
        'get-start',
        'use'
      ]
    },
    {
      title: baseScrollContent[lang],
      collapsable: false,
      children: [
        'base-scroll'
      ]
    }
  ]
}
module.exports = getGuideSideBar