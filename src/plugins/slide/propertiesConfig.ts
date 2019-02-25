const sourcePrefix = 'plugins.slide'
const propertiesMap = [
  {
    key: 'next',
    fnName: 'next'
  },
  {
    key: 'prev',
    fnName: 'prev'
  },
  {
    key: 'goToPage',
    fnName: 'goToPage'
  },
  {
    key: 'getCurrentPage',
    fnName: 'getCurrentPage'
  }
]
export default propertiesMap.map(item => {
  return {
    key: item.key,
    sourceKey: `${sourcePrefix}.${item.fnName}`
  }
})
