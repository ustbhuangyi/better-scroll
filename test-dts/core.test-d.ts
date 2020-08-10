import { BScroll, expectType, expectError } from './index'
import { Options } from '@better-scroll/core'
import Zoom from '@better-scroll/zoom'

describe('new bscroll', () => {
  const div = document.createElement('div')
  BScroll.use(Zoom)
  const bscroll = new BScroll(div, {
    zoom: {
      max: 1,
      min: 1,
      start: 1
    }
  })
  expectType<{ max: number; min: number; start: number }>(bscroll.options.zoom)
  expectType<BScroll>(bscroll)
})
