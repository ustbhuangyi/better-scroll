const sourcePrefix = 'plugins.wheel'
const propertiesMap = [
  {
    key: 'wheelTo',
    name: 'wheelTo'
  }
]
export default propertiesMap.map(item => {
  return {
    key: item.key,
    sourceKey: `${sourcePrefix}.${item.name}`
  }
})
