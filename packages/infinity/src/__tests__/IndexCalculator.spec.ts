import IndexCalculator, { PRE_NUM, POST_NUM } from '../IndexCalculator'

import FakeList from './__utils__/FakeList'

import { WRAPPER_HEIGHT, DEFAULT_HEIGHT } from './__utils__/constans'

describe('IndexCalculator unit test', () => {
  let indexCalculator: IndexCalculator

  beforeEach(() => {
    indexCalculator = new IndexCalculator(WRAPPER_HEIGHT, DEFAULT_HEIGHT)
  })

  it('should return correct val when first visible index < PRE_NUM', () => {
    // given
    const list = new FakeList(100).fillDom(0).getList()
    const INDEX = 0
    const POSITION = INDEX * DEFAULT_HEIGHT
    // when
    indexCalculator.calculate(POSITION - 10, list)
    const { start, end } = indexCalculator.calculate(POSITION - 10, list)
    // then
    expect(start).toBe(0)
  })

  it('should return correct val when first visible index < PRE_NUM', () => {
    // given
    const list = new FakeList(100).fillDom(0).getList()
    const INDEX = 5
    const POSITION = INDEX * DEFAULT_HEIGHT
    // when
    const { start, end } = indexCalculator.calculate(POSITION, list)
    // then
    expect(start).toBe(0)
  })

  it('should return correct val when first visilbe index > PRE_NUM', () => {
    // given
    const list = new FakeList(100).fillDom(0).getList()
    const INDEX = 15
    const POSITION = INDEX * DEFAULT_HEIGHT
    // when
    const { start } = indexCalculator.calculate(POSITION, list)
    // then
    expect(start).toBe(INDEX - PRE_NUM)
  })

  it('should return correct val when scroll up', () => {
    // given
    const list = new FakeList(100).fillDom(0).getList()
    const FIRST_INDEX = 50
    const FIRST_POSITION = FIRST_INDEX * DEFAULT_HEIGHT
    const SECOND_INDEX = 40
    const SECOND_POSITION = SECOND_INDEX * DEFAULT_HEIGHT
    // when
    indexCalculator.calculate(FIRST_POSITION, list)
    const { start } = indexCalculator.calculate(SECOND_POSITION, list)
    // then
    expect(start).toBe(SECOND_INDEX - POST_NUM)
  })
})
