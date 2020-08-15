const sourcePrefix = 'plugins.pullUpLoad'

const propertiesMap = [
  {
    key: 'finishPullUp',
    name: 'finishPullUp'
  },
  {
    key: 'openPullUp',
    name: 'openPullUp'
  },
  {
    key: 'closePullUp',
    name: 'closePullUp'
  }
]

export default propertiesMap.map(item => {
  return {
    key: item.key,
    sourceKey: `${sourcePrefix}.${item.name}`
  }
})
