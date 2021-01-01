const sourcePrefix = 'plugins.nestedScroll'

const propertiesMap = [
  {
    key: 'purgeNestedScroll',
    name: 'purgeNestedScroll',
  },
]

export default propertiesMap.map((item) => {
  return {
    key: item.key,
    sourceKey: `${sourcePrefix}.${item.name}`,
  }
})
