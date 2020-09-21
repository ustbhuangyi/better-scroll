/* istanbul ignore next */
const noop = function (val?: any) {}

interface TraversedObject {
  [key: string]: any
}
const sharedPropertyDefinition: PropertyDescriptor = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop,
}

const getProperty = (obj: TraversedObject, key: string) => {
  const keys = key.split('.')
  for (let i = 0; i < keys.length - 1; i++) {
    obj = obj[keys[i]]
    if (typeof obj !== 'object' || !obj) return
  }
  const lastKey = keys.pop() as string
  if (typeof obj[lastKey] === 'function') {
    return function () {
      return obj[lastKey].apply(obj, arguments)
    }
  } else {
    return obj[lastKey]
  }
}

const setProperty = (obj: TraversedObject, key: string, value: any) => {
  const keys = key.split('.')
  let temp
  for (let i = 0; i < keys.length - 1; i++) {
    temp = keys[i]
    if (!obj[temp]) obj[temp] = {}
    obj = obj[temp]
  }
  obj[keys.pop() as string] = value
}

export function propertiesProxy(
  target: Object,
  sourceKey: string,
  key: string
) {
  sharedPropertyDefinition.get = function proxyGetter() {
    return getProperty(this, sourceKey)
  }
  sharedPropertyDefinition.set = function proxySetter(val) {
    setProperty(this, sourceKey, val)
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
