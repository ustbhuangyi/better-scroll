export interface CustomHTMLDivElement extends HTMLDivElement {
  clientWidth: number
  clientHeight: number
  offsetWidth: number
  offsetHeight: number
  offsetTop: number
  offsetLeft: number
  _jsdomMockClientWidth?: number
  _jsdomMockClientHeight?: number
  _jsdomMockOffsetWidth?: number
  _jsdomMockOffsetHeight?: number
  _jsdomMockOffsetTop?: number
  _jsdomMockOffsetLeft?: number
  [key: string]: any
}

function firstUpper(key: string) {
  return key.charAt(0).toUpperCase() + key.slice(1)
}

function genMockPrototype(mockName: string) {
  return {
    get: jest.fn().mockImplementation(dom => {
      return Number(dom.getAttribute(mockName))
    })
  }
}

function mockHTMLPrototype(propName: string, mockGetter: jest.Mock) {
  Object.defineProperty(HTMLElement.prototype, propName, {
    get: function() {
      return mockGetter(this)
    },
    configurable: true
  })
}

export function mockDomOffset(
  dom: CustomHTMLDivElement,
  offsetObj: {
    width?: number
    height?: number
    top?: number
    left?: number
    [key: string]: any
  }
) {
  Object.keys(offsetObj).forEach(key => {
    const mockName = `_jsdomMockOffset${firstUpper(key)}`
    dom.setAttribute(mockName, offsetObj[key])
  })
}

export function mockDomClient(
  dom: CustomHTMLDivElement,
  clientObj: {
    width?: number
    height?: number
    [key: string]: any
  }
) {
  Object.keys(clientObj).forEach(key => {
    const mockName = `_jsdomMockClient${firstUpper(key)}`
    dom.setAttribute(mockName, clientObj[key])
  })
}

export function createDiv(
  width: number = 0,
  height: number = 0,
  top: number = 0,
  left: number = 0
) {
  const dom = document.createElement('div') as CustomHTMLDivElement
  mockDomOffset(dom, {
    width,
    height,
    top,
    left
  })
  mockDomClient(dom, {
    width,
    height
  })
  return dom
}

export const mockClientWidth = genMockPrototype('_jsdomMockClientWidth')
mockHTMLPrototype('clientWidth', mockClientWidth.get)

export const mockClientHeight = genMockPrototype('_jsdomMockClientHeight')
mockHTMLPrototype('clientHeight', mockClientHeight.get)

export const mockOffsetWidth = genMockPrototype('_jsdomMockOffsetWidth')
mockHTMLPrototype('offsetWidth', mockOffsetWidth.get)

export const mockOffsetHeight = genMockPrototype('_jsdomMockOffsetHeight')
mockHTMLPrototype('offsetHeight', mockOffsetHeight.get)

export const mockOffsetTop = genMockPrototype('_jsdomMockOffsetTop')
mockHTMLPrototype('offsetTop', mockOffsetTop.get)

export const mockOffsetLeft = genMockPrototype('_jsdomMockOffsetLeft')
mockHTMLPrototype('offsetLeft', mockOffsetLeft.get)
