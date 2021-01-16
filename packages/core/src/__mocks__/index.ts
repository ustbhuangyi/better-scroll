import Scroller from '../scroller/Scroller'
import { OptionsConstructor } from '../Options'
import { EventEmitter } from '@better-scroll/shared-utils'

jest.mock('../scroller/Scroller')
jest.mock('../Options')

const BScroll = jest.fn().mockImplementation((wrapper, options) => {
  options = Object.assign(new OptionsConstructor(), options)
  const eventEmitter = new EventEmitter([
    // bscroll
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
    'flick',
    'alterOptions',
    'mousewheelStart',
    'mousewheelMove',
    'mousewheelEnd',
  ])
  const res = {
    wrapper: wrapper,
    options: options,
    hooks: new EventEmitter([
      'refresh',
      'enable',
      'disable',
      'destroy',
      'beforeInitialScrollTo',
    ]),
    scroller: new Scroller(wrapper, wrapper.children[0], options),
    // own methods
    proxy: jest.fn(),
    refresh: jest.fn(),
    // proxy methods
    scrollTo: jest.fn(),
    resetPosition: jest.fn(),
    registerType: jest.fn().mockImplementation((names: string[]) => {
      names.forEach((name) => {
        const eventTypes = eventEmitter.eventTypes
        eventTypes[name] = name
      })
    }),
    disable: jest.fn(),
    enable: jest.fn(),
    stop: jest.fn(),
    plugins: {},
    x: 0,
    y: 0,
    maxScrollY: 0,
    maxScrollX: 0,
    minScrollX: 0,
    minScrollY: 0,
    hasVerticalScroll: true,
    hasHorizontalScroll: false,
    enabled: true,
    pending: false,
  }

  Object.setPrototypeOf(res, eventEmitter)
  return res
})

export default BScroll
