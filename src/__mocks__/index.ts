import Scroller from '@/scroller/Scroller'
import EventEmitter from '@/base/EventEmitter'

jest.mock('@/scroller/Scroller')
// 使用真实的 发布订阅逻辑
// jest.mock('@/base/EventEmitter')

const BScroll = jest.fn().mockImplementation((wrapper, options) => {
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
    proxy: jest.fn(),
    refresh: jest.fn(),
    // 代理的方法
    scrollTo: jest.fn(),
    resetPosition: jest.fn()
  }

  Object.setPrototypeOf(res, eventEmitter)
  return res
})

export default BScroll
