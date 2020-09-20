const sourcePrefix = 'plugins.movable'
const propertiesMap = [
  {
    key: 'putAt',
    name: 'putAt',
  },
]
export default propertiesMap.map((item) => {
  return {
    key: item.key,
    sourceKey: `${sourcePrefix}.${item.name}`,
  }
})
