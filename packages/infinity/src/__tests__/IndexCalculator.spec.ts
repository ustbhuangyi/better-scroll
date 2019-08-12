import IndexCalculator, { PRE_NUM, POST_NUM } from '../IndexCalculator'

import FakeList from './__utils__/FakeList'

import { WRAPPER_HEIGHT, TOMBSTONE_HEIGHT } from './__utils__/constans'

describe('IndexCalculator unit test', () => {
  let indexCalculator: IndexCalculator
  const VISIBLE_CNT = WRAPPER_HEIGHT / TOMBSTONE_HEIGHT

  beforeEach(() => {
    indexCalculator = new IndexCalculator(WRAPPER_HEIGHT, TOMBSTONE_HEIGHT)
  })

  it('should get start equal to 0 when pos is 0', () => {
    // given
    const list = new FakeList(0).getList()
    // when
    const { start, end } = indexCalculator.calculate(0, list)
    // then
    expect(start).toBe(0)
    expect(end).toBe(VISIBLE_CNT + POST_NUM)
  })

  it('should get start equal to 0 when first rendered index < PRE_NUM', () => {
    // given
    const list = new FakeList(100)
      .fillDom(0)
      .fillPos()
      .getList()
    const INDEX = 5
    const POSITION = INDEX * TOMBSTONE_HEIGHT
    // when
    const { start, end } = indexCalculator.calculate(POSITION, list)
    // then
    expect(start).toBe(0)
  })

  it('should get start equal to index-PRE_NUM when first visilbe index > PRE_NUM', () => {
    // given
    const list = new FakeList(100)
      .fillDom(0)
      .fillPos()
      .getList()
    const INDEX = 15
    const POSITION = INDEX * TOMBSTONE_HEIGHT
    // when
    const { start } = indexCalculator.calculate(POSITION, list)
    // then
    expect(start).toBe(INDEX - PRE_NUM)
  })

  it('should get correct val when scroll up and down', () => {
    // given
    const list = new FakeList(100)
      .fillDom(0)
      .fillPos()
      .getList()
    const FIRST_INDEX = 50
    const FIRST_POSITION = FIRST_INDEX * TOMBSTONE_HEIGHT
    const SECOND_INDEX = 40
    const SECOND_POSITION = SECOND_INDEX * TOMBSTONE_HEIGHT
    // when
    indexCalculator.calculate(FIRST_POSITION, list)
    const { start } = indexCalculator.calculate(SECOND_POSITION, list)
    // then
    expect(start).toBe(SECOND_INDEX - POST_NUM)
  })
})
