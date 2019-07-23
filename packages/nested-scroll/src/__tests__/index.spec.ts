import BScroll from '@better-scroll/core'
jest.mock('@better-scroll/core')

import NestedScroll from '@better-scroll/nested-scroll'

describe('NestedScroll tests', () => {
  let parentWrapper: HTMLElement
  let parentContent: HTMLElement
  let childWrapper: HTMLElement
  let childContent: HTMLElement
  beforeEach(() => {
    parentWrapper = document.createElement('div')
    parentContent = document.createElement('div')

    childWrapper = document.createElement('div')
    childContent = document.createElement('div')

    parentWrapper.appendChild(parentContent)
    parentContent.appendChild(childWrapper)
    childWrapper.appendChild(childContent)
  })

  afterEach(() => {
    NestedScroll.nestedScroll = undefined
    jest.clearAllMocks()
  })

  it('should only be a singleton when initialised multi-times', () => {
    let nestedScroll1 = new NestedScroll(new BScroll(parentWrapper, {}))
    let nestedScroll2 = new NestedScroll(new BScroll(childWrapper, {}))

    expect(nestedScroll1).toEqual(nestedScroll2)
  })

  it('should store BScroll instance', () => {
    let nestedScroll1 = new NestedScroll(new BScroll(parentWrapper, {}))
    let nestedScroll2 = new NestedScroll(new BScroll(childWrapper, {}))

    expect(nestedScroll1.stores.length).toBe(2)
  })

  it('should forming a father-son relationship', () => {
    const parentScroll = new BScroll(parentWrapper, {})
    const childScroll = new BScroll(childWrapper, {})
    let nestedScroll1 = new NestedScroll(parentScroll)
    let nestedScroll2 = new NestedScroll(childScroll)

    expect(childScroll.__parentInfo).toBeDefined()
    expect(childScroll.__parentInfo.parent).toBe(parentScroll)
    expect(childScroll.__parentInfo.depth).toBe(1)
  })

  it("should make childScroll'options.click false when both BScroll' options.click are true", () => {
    const parentScroll = new BScroll(parentWrapper, {
      click: true
    })
    const childScroll = new BScroll(childWrapper, {
      click: true
    })
    let nestedScroll1 = new NestedScroll(parentScroll)
    let nestedScroll2 = new NestedScroll(childScroll)

    expect(childScroll.options.click).toBe(false)
  })
})
