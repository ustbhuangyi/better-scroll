const sourcePrefix = 'plugins.wheel'
const propertiesMap = [
  {
    key: 'wheelTo',
    name: 'wheelTo',
  },
  {
    key: 'getSelectedIndex',
    name: 'getSelectedIndex',
  },
  {
    key: 'restorePosition',
    name: 'restorePosition',
  },
]
export default propertiesMap.map((item) => {
  return {
    key: item.key,
    sourceKey: `${sourcePrefix}.${item.name}`,
  }
})
