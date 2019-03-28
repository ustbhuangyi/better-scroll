import Scroller from '@/scroller/Scroller'
import EventEmitter from '@/base/EventEmitter'
import { Options } from '@/Options'

jest.mock('@/scroller/Scroller')
jest.mock('@/Options')
// mock 发布订阅逻辑
// jest.mock('@/base/EventEmitter')

const BScroll = jest.fn().mockImplementation((wrapper, options) => {
  options = Object.assign(new Options(), options)
  const eventEmitter = new EventEmitter([
    // bscroll
    'init',
    'refresh',
    'enable',
    'disable',
    'destroy',
    // scroller
    'beforeScrollStart',
    'scrollStart',
    'scroll',
    'scrollEnd',
    'touchEnd',
    'flick'
  ])
  const res = {
    wrapper: wrapper,
    options: options,
    hooks: new EventEmitter([
      'init',
      'refresh',
      'enable',
      'disable',
      'destroy'
    ]),
    scroller: new Scroller(wrapper, options),
    // 自身方法
    proxy: jest.fn(),
    refresh: jest.fn(),
    // 代理的方法
    scrollTo: jest.fn(),
    resetPosition: jest.fn(),
    registerType: jest.fn()
  }

  Object.setPrototypeOf(res, eventEmitter)
  return res
})

export default BScroll
