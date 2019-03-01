const sourcePrefix = 'plugins.zoom'
const propertiesMap = [
  {
    key: 'zoomTo',
    name: 'zoomTo'
  }
]
export default propertiesMap.map(item => {
  return {
    key: item.key,
    sourceKey: `${sourcePrefix}.${item.name}`
  }
})
