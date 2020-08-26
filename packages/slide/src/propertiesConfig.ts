const sourcePrefix = 'plugins.slide'
const propertiesMap = [
  {
    key: 'next',
    name: 'next'
  },
  {
    key: 'prev',
    name: 'prev'
  },
  {
    key: 'goToPage',
    name: 'goToPage'
  },
  {
    key: 'getCurrentPage',
    name: 'getCurrentPage'
  }
]

export default propertiesMap.map(item => {
  return {
    key: item.key,
    sourceKey: `${sourcePrefix}.${item.name}`
  }
})
