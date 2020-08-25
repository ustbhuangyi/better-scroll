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
    scroller: new Scroller(wrapper, options),
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
    plugins: {},
    x: 0,
    y: 0,
    maxScrollY: 0,
    maxScrollX: 0,
    hasVerticalScroll: true,
    hasHorizontalScroll: false,
    enabled: true,
  }

  Object.setPrototypeOf(res, eventEmitter)
  return res
})

export default BScroll
