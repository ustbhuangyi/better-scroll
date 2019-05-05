const sourcePrefix = 'plugins.pullDownRefresh'

const propertiesMap = [
  {
    key: 'finishPullDown',
    name: 'finish'
  },
  {
    key: 'openPullDown',
    name: 'open'
  },
  {
    key: 'closePullDown',
    name: 'close'
  },
  {
    key: 'autoPullDownRefresh',
    name: 'autoPull'
  }
]

export default propertiesMap.map(item => {
  return {
    key: item.key,
    sourceKey: `${sourcePrefix}.${item.name}`
  }
})
