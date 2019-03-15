import PageInfo from '../../../../src/plugins/slide/PageInfo'
import BScroll from '../../../../src'
import { warn } from '../../../../src/util/debug'
jest.mock('../../../../src/util/debug')
jest.mock('../../../../src/util/dom', () => ({
  getRect: require('./__mock__/dom').mockGetRect
}))
import {
  bscrollHorizon,
  bscrollVertical,
  bscrollHorizonVertical
} from './__mock__/bscroll'

describe('slide test for PageInfo class', () => {
  let pageInfo: PageInfo
  let bscrollH: BScroll
  let bscrollV: BScroll
  beforeAll(() => {
    bscrollH = bscrollHorizon()
    bscrollV = bscrollVertical()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('new PageInfo', () => {
    pageInfo = new PageInfo(bscrollH, {
      loop: true
    })
    pageInfo.init()
    expect(pageInfo.loopX).toBe(true)
    expect(pageInfo.loopY).toBeUndefined
    pageInfo = new PageInfo(bscrollV, { loop: true })
    pageInfo.init()
    expect(pageInfo.loopY).toBe(true)
    expect(pageInfo.loopX).toBeUndefined
    pageInfo = new PageInfo(bscrollHorizonVertical(), {
      loop: true
    })
    pageInfo.init()
    expect(warn).toHaveBeenCalledTimes(1)
  })
  it('change2safePage', () => {
    pageInfo = new PageInfo(bscrollH, {
      loop: true
    })
    pageInfo.init()
    expect(pageInfo.change2safePage(-1, 3)).toMatchObject({
      pageX: 0,
      pageY: 0,
      x: 0,
      y: 0
    })
    expect(pageInfo.change2safePage(3, 3)).toMatchObject({
      pageX: 1,
      pageY: 0,
      x: -300,
      y: 0
    })
    expect(pageInfo.change2safePage(1, 0)).toMatchObject({
      pageX: 1,
      pageY: 0,
      x: -300,
      y: 0
    })
    expect(pageInfo.change2safePage(0, 1)).toMatchObject({
      pageX: 0,
      pageY: 0,
      x: 0,
      y: 0
    })
    expect(pageInfo.change2safePage(0, -1)).toMatchObject({
      pageX: 0,
      pageY: 0,
      x: 0,
      y: 0
    })
  })
  it('getRealPage', () => {
    pageInfo = new PageInfo(bscrollH, {
      loop: false
    })
    pageInfo.init()
    pageInfo.currentPage = {
      x: -300,
      y: 0,
      pageX: 2,
      pageY: 0
    }
    expect(pageInfo.getRealPage().pageX).toBe(2)
    pageInfo = new PageInfo(bscrollH, {
      loop: true
    })
    pageInfo.init()
    pageInfo.currentPage = {
      x: -300,
      y: 0,
      pageX: 2,
      pageY: 0
    }
    expect(pageInfo.getRealPage().pageX).toBe(1)
    pageInfo = new PageInfo(bscrollV, {
      loop: true
    })
    pageInfo.init()
    pageInfo.currentPage = {
      x: 0,
      y: -300,
      pageX: 0,
      pageY: 2
    }
    expect(pageInfo.getRealPage().pageY).toBe(1)
  })
  it('nearestPage', () => {
    pageInfo = new PageInfo(bscrollH, {
      loop: true
    })
    pageInfo.init()
    expect(pageInfo.nearestPage(-100, 0, 1, 0)).toMatchObject({
      pageX: 1,
      pageY: 0,
      x: -300,
      y: 0
    })
    expect(pageInfo.nearestPage(-100, 0, 0, 1)).toMatchObject({
      pageX: 0,
      pageY: 0,
      x: 0,
      y: 0
    })
    expect(pageInfo.nearestPage(-100, -100, 0, 1)).toMatchObject({
      pageX: 0,
      pageY: 0,
      x: 0,
      y: 0
    })
    expect(pageInfo.nearestPage(-180, 0, 0, 0)).toMatchObject({
      pageX: 1,
      pageY: 0,
      x: -300,
      y: 0
    })
    expect(pageInfo.nearestPage(-180, 0, -1, 0)).toMatchObject({
      pageX: 1,
      pageY: 0,
      x: -300,
      y: 0
    })
    expect(pageInfo.nearestPage(-100, 0, -1, 0)).toMatchObject({
      pageX: 0,
      pageY: 0,
      x: 0,
      y: 0
    })
  })
  it('getLoopStage', () => {
    pageInfo = new PageInfo(bscrollH, {
      loop: true
    })
    pageInfo.init()
    pageInfo.pagesPos.xLen = 4
    pageInfo.pagesPos.yLen = 4
    pageInfo.currentPage.pageX = 0
    expect(pageInfo.getLoopStage()).toBe('head')
    pageInfo.currentPage.pageX = 1
    expect(pageInfo.getLoopStage()).toBe('middle')
    pageInfo.currentPage.pageX = 3
    expect(pageInfo.getLoopStage()).toBe('tail')
    pageInfo.loopX = false
    pageInfo.loopY = true
    pageInfo.currentPage.pageY = 0
    expect(pageInfo.getLoopStage()).toBe('head')
    pageInfo.currentPage.pageY = 1
    expect(pageInfo.getLoopStage()).toBe('middle')
    pageInfo.currentPage.pageY = 3
    expect(pageInfo.getLoopStage()).toBe('tail')
    pageInfo = new PageInfo(bscrollHorizon(), {
      loop: false
    })
    pageInfo.init()
    expect(pageInfo.getLoopStage()).toBe('middle')
  })
  it('resetLoopPage', () => {
    pageInfo = new PageInfo(bscrollH, {
      loop: true
    })
    pageInfo.init()
    pageInfo.pagesPos.xLen = 4
    expect(pageInfo.resetLoopPage()).toMatchObject({
      pageX: 2,
      pageY: 0
    })
    pageInfo.currentPage.pageX = 3
    expect(pageInfo.resetLoopPage()).toMatchObject({
      pageX: 1,
      pageY: 0
    })
    pageInfo.loopX = false
    pageInfo.loopY = true
    pageInfo.pagesPos.yLen = 4
    pageInfo.currentPage.pageY = 0
    pageInfo.currentPage.pageX = 0
    expect(pageInfo.resetLoopPage()).toMatchObject({
      pageX: 0,
      pageY: 2
    })
    pageInfo.currentPage.pageY = 3
    expect(pageInfo.resetLoopPage()).toMatchObject({
      pageX: 0,
      pageY: 1
    })
    pageInfo.loopX = false
    pageInfo.loopY = false
    expect(pageInfo.resetLoopPage()).toBeUndefined()
  })
  it('realPage2Page', () => {
    pageInfo = new PageInfo(bscrollH, {
      loop: true
    })
    pageInfo.init()
    pageInfo.loopY = true
    pageInfo.pagesPos.xLen = 4
    pageInfo.pagesPos.yLen = 4
    expect(pageInfo.realPage2Page(-1, -1)).toMatchObject({
      realX: 1,
      realY: 1
    })
    expect(pageInfo.realPage2Page(0, 0)).toMatchObject({
      realX: 1,
      realY: 1
    })
    expect(pageInfo.realPage2Page(1, 1)).toMatchObject({
      realX: 2,
      realY: 2
    })
    expect(pageInfo.realPage2Page(2, 2)).toMatchObject({
      realX: 2,
      realY: 2
    })
    expect(pageInfo.realPage2Page(3, 3)).toMatchObject({
      realX: 2,
      realY: 2
    })
    pageInfo.loopY = false
    pageInfo.loopX = false
    expect(pageInfo.realPage2Page(-1, -1)).toMatchObject({
      realX: 0,
      realY: 0
    })
    expect(pageInfo.realPage2Page(0, 0)).toMatchObject({
      realX: 0,
      realY: 0
    })
    expect(pageInfo.realPage2Page(3, 3)).toMatchObject({
      realX: 3,
      realY: 3
    })
    expect(pageInfo.realPage2Page(4, 4)).toMatchObject({
      realX: 3,
      realY: 3
    })
    pageInfo.pagesPos.pages = []
    expect(pageInfo.realPage2Page(0, 0)).toBeUndefined
  })
  it('getPageSize', () => {
    pageInfo = new PageInfo(bscrollH, {
      loop: true
    })
    pageInfo.init()
    expect(pageInfo.getPageSize()).toMatchObject({
      width: 300,
      height: 300
    })
  })
  it('nextPage', () => {
    pageInfo = new PageInfo(bscrollH, {
      loop: true
    })
    pageInfo.init()
    expect(pageInfo.nextPage()).toMatchObject({
      pageX: 1,
      pageY: 0
    })
    expect(pageInfo.prevPage()).toMatchObject({
      pageX: -1,
      pageY: 0
    })
    pageInfo = new PageInfo(bscrollV, { loop: true })
    pageInfo.init()
    expect(pageInfo.nextPage()).toMatchObject({
      pageX: 0,
      pageY: 1
    })
    expect(pageInfo.prevPage()).toMatchObject({
      pageX: 0,
      pageY: -1
    })
  })
})
