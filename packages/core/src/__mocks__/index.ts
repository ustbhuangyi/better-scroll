import Scroller from '../scroller/Scroller'
import { Options } from '../Options'
import { EventEmitter } from '@better-scroll/shared-utils'

jest.mock('../scroller/Scroller')
jest.mock('../Options')

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
    // own methods
    proxy: jest.fn(),
    refresh: jest.fn(),
    // proxy methods
    scrollTo: jest.fn(),
    resetPosition: jest.fn(),
    registerType: jest.fn().mockImplementation((names: string[]) => {
      names.forEach(name => {
        const eventTypes = eventEmitter.eventTypes
        eventTypes[name] = name
      })
    })
  }

  Object.setPrototypeOf(res, eventEmitter)
  return res
})

export default BScroll
