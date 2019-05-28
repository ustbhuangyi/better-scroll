const sourcePrefix = 'plugins.pullUpLoad'

const propertiesMap = [
  {
    key: 'finishPullUp',
    name: 'finish'
  },
  {
    key: 'openPullUp',
    name: 'open'
  },
  {
    key: 'closePullUp',
    name: 'close'
  }
]

export default propertiesMap.map(item => {
  return {
    key: item.key,
    sourceKey: `${sourcePrefix}.${item.name}`
  }
})
