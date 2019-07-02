import DomManager from '../DomManager'
import Tombstone from '../Tombstone'

import { mockDomOffset } from '@better-scroll/core/src/__tests__/__utils__/layout'

import FakeList from './__utils__/FakeList'

const DOM_HEIGHT = 37
const WRAPPER_HEIGHT = 370

jest.useFakeTimers()

describe('DomManager unit test', () => {
  let domManager: DomManager
  let content: HTMLElement
  const renderFn = function(data: any, div?: HTMLElement) {
    const dom = div || document.createElement('div')
    mockDomOffset(<HTMLDivElement>dom, { height: DOM_HEIGHT })
    return dom
  }
  const createTombstone = function() {
    const dom = document.createElement('div')
    dom.setAttribute('class', 'tombstone')
    mockDomOffset(<HTMLDivElement>dom, { height: DOM_HEIGHT })
    return dom
  }

  beforeEach(() => {
    content = document.createElement('div')
    const tombstone = new Tombstone(createTombstone)
    domManager = new DomManager(content, renderFn, tombstone)
  })

  it('should not render all elements when data too much', () => {
    const LAST_START = 0
    const LAST_END = 10
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

  it('should render tombstones when no data', () => {
    const LAST_START = 0
    const LAST_END = 10
    const DATA = 1
    const LIST_SIZE = 20
    // given
    let start = 5
    let end = 15
    let list = new FakeList(LIST_SIZE)
      .fill({ data: DATA }, LAST_START, LAST_END)
      .fillDom(LAST_START, LAST_END)
      .syncDomTo(content)
      .getList()
    // when
    domManager.update(list, start, end)
    // then
    const tombstoneNum = content.querySelectorAll('.tombstone').length
    expect(tombstoneNum).toBe(end - LAST_END)
  })

  it('should recycle tombstones when scroll', () => {
    const LAST_START = 0
    const LAST_END = 10
    const DATA = 1
    const LIST_SIZE = 20
    // given
    let list = new FakeList(LIST_SIZE)
    let start = 5
    let end = 20
    // when
    domManager.update(list.getList(), LAST_START, LAST_END)
    list.fill({ data: DATA }, LAST_START, LAST_END)
    domManager.update(list.getList(), LAST_START, LAST_END)
    jest.runAllTimers() // wait recycle tombstones

    domManager.update(list.getList(), start, end)
    // then
    const tombstoneNum = content.querySelectorAll('.tombstone').length
    expect(tombstoneNum).toBe(10)
  })
})
