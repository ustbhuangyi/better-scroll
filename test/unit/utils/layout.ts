export interface CustomHTMLDivElement extends HTMLDivElement {
  _jsdomMockClientWidth?: number
  _jsdomMockClientHeight?: number
  _jsdomMockOffsetWidth?: number
  _jsdomMockOffsetHeight?: number
  _jsdomMockOffsetTop?: number
  _jsdomMockOffsetLeft?: number
}
export const mockClientWidth = {
  get: jest.fn(),
  set: jest.fn()
}
Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
  get: function() {
    return mockClientWidth.get(this)
  }
})

export const mockClientHeight = {
  get: jest.fn(),
  set: jest.fn()
}
Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
  get: function() {
    return mockClientHeight.get(this)
  }
})

export const mockOffsetWidth = {
  get: jest.fn(),
  set: jest.fn()
}

Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
  get: function() {
    return mockOffsetWidth.get(this)
  }
})

export const mockOffsetHeight = {
  get: jest.fn(),
  set: jest.fn()
}
Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
  get: function() {
    return mockOffsetHeight.get(this)
  }
})

export const mockOffsetTop = {
  get: jest.fn(),
  set: jest.fn()
}
Object.defineProperty(HTMLElement.prototype, 'offsetTop', {
  get: function() {
    return mockOffsetTop.get(this)
  }
})

export const mockOffsetLeft = {
  get: jest.fn(),
  set: jest.fn()
}
Object.defineProperty(HTMLElement.prototype, 'offsetLeft', {
  get: function() {
    return mockOffsetLeft.get(this)
  }
})
