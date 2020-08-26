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
  },
  {
    key: 'autoPullUpLoad',
    name: 'autoPullUpLoad'
  }
]

export default propertiesMap.map(item => {
  return {
    key: item.key,
    sourceKey: `${sourcePrefix}.${item.name}`
  }
})
