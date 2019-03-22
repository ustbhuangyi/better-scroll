import SlidePage from '../../../../src/plugins/slide/SlidePage'
import BScroll from '../../../../src'
import { warn } from '../../../../src/util/debug'
jest.mock('../../../../src/util/debug')

import {
  bscrollHorizon,
  bscrollVertical,
  bscrollHorizonVertical
} from './__mock__/bscroll'

describe('slide test for SlidePage class', () => {
  let slidePage: SlidePage
  let bscrollH: BScroll
  let bscrollV: BScroll
  beforeAll(() => {
    bscrollH = bscrollHorizon()
    bscrollV = bscrollVertical()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('new SlidePage', () => {
    slidePage = new SlidePage(bscrollH, {
      loop: true
    })
    slidePage.init()
    expect(slidePage.loopX).toBe(true)
    expect(slidePage.loopY).toBeUndefined
    slidePage = new SlidePage(bscrollV, { loop: true })
    slidePage.init()
    expect(slidePage.loopY).toBe(true)
    expect(slidePage.loopX).toBeUndefined
    slidePage = new SlidePage(bscrollHorizonVertical(), {
      loop: true
    })
    slidePage.init()
    expect(warn).toHaveBeenCalledTimes(1)
  })
  it('change2safePage', () => {
    slidePage = new SlidePage(bscrollH, {
      loop: true
    })
    slidePage.init()
    expect(slidePage.change2safePage(-1, 3)).toMatchObject({
      pageX: 0,
      pageY: 0,
      x: 0,
      y: 0
    })
    expect(slidePage.change2safePage(3, 3)).toMatchObject({
      pageX: 1,
      pageY: 0,
      x: -300,
      y: 0
    })
    expect(slidePage.change2safePage(1, 0)).toMatchObject({
      pageX: 1,
      pageY: 0,
      x: -300,
      y: 0
    })
    expect(slidePage.change2safePage(0, 1)).toMatchObject({
      pageX: 0,
      pageY: 0,
      x: 0,
      y: 0
    })
    expect(slidePage.change2safePage(0, -1)).toMatchObject({
      pageX: 0,
      pageY: 0,
      x: 0,
      y: 0
    })
  })
  it('getRealPage', () => {
    slidePage = new SlidePage(bscrollH, {
      loop: false
    })
    slidePage.init()
    slidePage.currentPage = {
      x: -300,
      y: 0,
      pageX: 2,
      pageY: 0
    }
    expect(slidePage.getRealPage().pageX).toBe(2)
    slidePage = new SlidePage(bscrollH, {
      loop: true
    })
    slidePage.init()
    slidePage.currentPage = {
      x: -300,
      y: 0,
      pageX: 2,
      pageY: 0
    }
    expect(slidePage.getRealPage().pageX).toBe(1)
    slidePage = new SlidePage(bscrollV, {
      loop: true
    })
    slidePage.init()
    slidePage.currentPage = {
      x: 0,
      y: -300,
      pageX: 0,
      pageY: 2
    }
    expect(slidePage.getRealPage().pageY).toBe(1)
  })
  it('nearestPage', () => {
    slidePage = new SlidePage(bscrollH, {
      loop: true
    })
    slidePage.init()
    expect(slidePage.nearestPage(-100, 0, 1, 0)).toMatchObject({
      pageX: 1,
      pageY: 0,
      x: -300,
      y: 0
    })
    expect(slidePage.nearestPage(-100, 0, 0, 1)).toMatchObject({
      pageX: 0,
      pageY: 0,
      x: 0,
      y: 0
    })
    expect(slidePage.nearestPage(-100, -100, 0, 1)).toMatchObject({
      pageX: 0,
      pageY: 0,
      x: 0,
      y: 0
    })
    expect(slidePage.nearestPage(-180, 0, 0, 0)).toMatchObject({
      pageX: 1,
      pageY: 0,
      x: -300,
      y: 0
    })
    expect(slidePage.nearestPage(-180, 0, -1, 0)).toMatchObject({
      pageX: 1,
      pageY: 0,
      x: -300,
      y: 0
    })
    expect(slidePage.nearestPage(-100, 0, -1, 0)).toMatchObject({
      pageX: 0,
      pageY: 0,
      x: 0,
      y: 0
    })
  })
  it('getLoopStage', () => {
    slidePage = new SlidePage(bscrollH, {
      loop: true
    })
    slidePage.init()
    slidePage.pagesPos.xLen = 4
    slidePage.pagesPos.yLen = 4
    slidePage.currentPage.pageX = 0
    expect(slidePage.getLoopStage()).toBe('head')
    slidePage.currentPage.pageX = 1
    expect(slidePage.getLoopStage()).toBe('middle')
    slidePage.currentPage.pageX = 3
    expect(slidePage.getLoopStage()).toBe('tail')
    slidePage.loopX = false
    slidePage.loopY = true
    slidePage.currentPage.pageY = 0
    expect(slidePage.getLoopStage()).toBe('head')
    slidePage.currentPage.pageY = 1
    expect(slidePage.getLoopStage()).toBe('middle')
    slidePage.currentPage.pageY = 3
    expect(slidePage.getLoopStage()).toBe('tail')
    slidePage = new SlidePage(bscrollHorizon(), {
      loop: false
    })
    slidePage.init()
    expect(slidePage.getLoopStage()).toBe('middle')
  })
  it('resetLoopPage', () => {
    slidePage = new SlidePage(bscrollH, {
      loop: true
    })
    slidePage.init()
    slidePage.pagesPos.xLen = 4
    expect(slidePage.resetLoopPage()).toMatchObject({
      pageX: 2,
      pageY: 0
    })
    slidePage.currentPage.pageX = 3
    expect(slidePage.resetLoopPage()).toMatchObject({
      pageX: 1,
      pageY: 0
    })
    slidePage.loopX = false
    slidePage.loopY = true
    slidePage.pagesPos.yLen = 4
    slidePage.currentPage.pageY = 0
    slidePage.currentPage.pageX = 0
    expect(slidePage.resetLoopPage()).toMatchObject({
      pageX: 0,
      pageY: 2
    })
    slidePage.currentPage.pageY = 3
    expect(slidePage.resetLoopPage()).toMatchObject({
      pageX: 0,
      pageY: 1
    })
    slidePage.loopX = false
    slidePage.loopY = false
    expect(slidePage.resetLoopPage()).toBeUndefined()
  })
  it('realPage2Page', () => {
    slidePage = new SlidePage(bscrollH, {
      loop: true
    })
    slidePage.init()
    slidePage.loopY = true
    slidePage.pagesPos.xLen = 4
    slidePage.pagesPos.yLen = 4
    expect(slidePage.realPage2Page(-1, -1)).toMatchObject({
      realX: 1,
      realY: 1
    })
    expect(slidePage.realPage2Page(0, 0)).toMatchObject({
      realX: 1,
      realY: 1
    })
    expect(slidePage.realPage2Page(1, 1)).toMatchObject({
      realX: 2,
      realY: 2
    })
    expect(slidePage.realPage2Page(2, 2)).toMatchObject({
      realX: 2,
      realY: 2
    })
    expect(slidePage.realPage2Page(3, 3)).toMatchObject({
      realX: 2,
      realY: 2
    })
    slidePage.loopY = false
    slidePage.loopX = false
    expect(slidePage.realPage2Page(-1, -1)).toMatchObject({
      realX: 0,
      realY: 0
    })
    expect(slidePage.realPage2Page(0, 0)).toMatchObject({
      realX: 0,
      realY: 0
    })
    expect(slidePage.realPage2Page(3, 3)).toMatchObject({
      realX: 3,
      realY: 3
    })
    expect(slidePage.realPage2Page(4, 4)).toMatchObject({
      realX: 3,
      realY: 3
    })
    slidePage.pagesPos.pages = []
    expect(slidePage.realPage2Page(0, 0)).toBeUndefined
  })
  it('getPageSize', () => {
    slidePage = new SlidePage(bscrollH, {
      loop: true
    })
    slidePage.init()
    expect(slidePage.getPageSize()).toMatchObject({
      width: 300,
      height: 300
    })
  })
  it('nextPage', () => {
    slidePage = new SlidePage(bscrollH, {
      loop: true
    })
    slidePage.init()
    expect(slidePage.nextPage()).toMatchObject({
      pageX: 1,
      pageY: 0
    })
    expect(slidePage.prevPage()).toMatchObject({
      pageX: -1,
      pageY: 0
    })
    slidePage = new SlidePage(bscrollV, { loop: true })
    slidePage.init()
    expect(slidePage.nextPage()).toMatchObject({
      pageX: 0,
      pageY: 1
    })
    expect(slidePage.prevPage()).toMatchObject({
      pageX: 0,
      pageY: -1
    })
  })
})
