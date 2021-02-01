import Indicator from '../indicator'
import BScroll, { Options } from '@better-scroll/core'

jest.mock('@better-scroll/core')
jest.mock('../indicator')

import ScrollBar from '../index'

const addProperties = <T extends Object, K extends Object>(
  target: T,
  source: K
) => {
  for (const key in source) {
    ;(target as any)[key] = source[key]
  }
  return target
}

describe('scroll-bar unit tests', () => {
  let scroll: BScroll
  let options: Partial<Options>

  beforeAll(() => {
    // create Dom
    const wrapper = document.createElement('div')
    const content = document.createElement('div')
    wrapper.appendChild(content)
    // mock bscroll
    options = {
      scrollbar: true,
      scrollX: true,
      scrollY: true,
    }
    scroll = new BScroll(wrapper, options)
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('constructor', () => {
    it('should create indicator elements', () => {
      const scrollbar = new ScrollBar(scroll)
      // then
      expect(scroll.wrapper).toMatchSnapshot()
      expect(scrollbar.options).toMatchObject({
        fade: true,
        interactive: false,
        customElements: [],
        minSize: 8,
        scrollbarTrackClickable: false,
        scrollbarTrackOffsetType: 'step',
        scrollbarTrackOffsetTime: 300,
      })
    })

    it('custom scrollbar', () => {
      const customHScrollbar = document.createElement('div')
      addProperties(scroll.options, {
        scrollX: true,
        scrollY: false,
        scrollbar: {
          customElements: [customHScrollbar],
        },
      })
      const scrollbar = new ScrollBar(scroll)
      expect(scrollbar.indicators[0].wrapper).toBe(customHScrollbar)
    })

    it('destroy hook', () => {
      const scrollbar = new ScrollBar(scroll)
      scroll.hooks.trigger(scroll.hooks.eventTypes.destroy)
      for (let indicator of scrollbar.indicators) {
        expect(indicator.destroy).toBeCalled()
      }
    })
  })
})
