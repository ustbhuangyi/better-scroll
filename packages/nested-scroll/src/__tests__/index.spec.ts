import BScroll from '@better-scroll/core'
jest.mock('@better-scroll/core')

import NestedScroll from '@better-scroll/nested-scroll'

describe('NestedScroll tests', () => {
  beforeAll(() => {})

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should only be a singleton when inited multi-times', () => {
    let nestedScroll1 = new NestedScroll()
    let nestedScroll2 = new NestedScroll()

    expect(nestedScroll1).toEqual(nestedScroll2)
  })
})
