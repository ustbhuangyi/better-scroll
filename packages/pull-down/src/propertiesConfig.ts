const sourcePrefix = 'plugins.pullDownRefresh'

const propertiesMap = [
  {
    key: 'finishPullDown',
    name: 'finishPullDown'
  },
  {
    key: 'openPullDown',
    name: 'openPullDown'
  },
  {
    key: 'closePullDown',
    name: 'closePullDown'
  },
  {
    key: 'autoPullDownRefresh',
    name: 'autoPullDownRefresh'
  }
]

export default propertiesMap.map(item => {
  return {
    key: item.key,
    sourceKey: `${sourcePrefix}.${item.name}`
  }
})
