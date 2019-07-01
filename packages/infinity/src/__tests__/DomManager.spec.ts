import DomManager from '../DomManager'

import { mockDomOffset } from '@better-scroll/core/src/__tests__/__utils__/layout'

import FakeList from './__utils__/FakeList'

const DOM_HEIGHT = 37
const WRAPPER_HEIGHT = 370

describe('DomManager unit test', () => {
  let domManager: DomManager
  let content: HTMLElement
  const renderFn = function(data: any, div?: HTMLElement) {
    const dom = div || document.createElement('div')
    mockDomOffset(<HTMLDivElement>dom, { height: DOM_HEIGHT })
    return dom
  }

  beforeEach(() => {
    content = document.createElement('div')
    domManager = new DomManager(content, renderFn)
  })

  it('should not render all elements when data too much', () => {
    const LAST_START = 0
    const LAST_END = 9
    const DATA = 1
    const LIST_SIZE = 20
    // given
    let start = 5
    let end = 15
    let list = new FakeList(LIST_SIZE)
      .fill({ data: DATA })
      .fillDom(LAST_START, LAST_END)
      .syncDomTo(content)
      .getList()
    // when
    const { endPos } = domManager.update(list, start, end)
    // then
    expect(content.childElementCount).toBe(end - start)
    expect(endPos).toBe(end * DOM_HEIGHT)
  })
})
