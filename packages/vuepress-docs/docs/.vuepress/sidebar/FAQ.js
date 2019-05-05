const FAQContent = {
  'zh-CN': '常见问题',
  'en-US': 'FAQ'
}

const getFAQSideBar = function (lang) {
  return [
    {
      title: FAQContent[lang],
      collapsable: false,
      children: [
        ''
      ]
    }
  ]
}
module.exports = getFAQSideBar
