import Scroller from '@/scroller/Scroller'
import EventEmitter from '@/base/EventEmitter'

jest.mock('@/scroller/Scroller')
jest.mock('@/base/EventEmitter')

const BScroll = jest.fn().mockImplementation((wrapper, options) => {
  return {
    wrapper: wrapper,
    options: options,
    hooks: new EventEmitter([]),
    scroller: new Scroller(wrapper, options),
    on: jest.fn(),
    trigger: jest.fn(),
    proxy: jest.fn(),
    registerType: jest.fn(),
    refresh: jest.fn()
  }
})

export default BScroll
