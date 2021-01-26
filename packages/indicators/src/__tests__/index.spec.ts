import Indicator from '../indicator'
import BScroll from '@better-scroll/core'

jest.mock('@better-scroll/core')
jest.mock('../indicator')

import Indicators from '../index'

const addProperties = <T extends Object, K extends Object>(
  target: T,
  source: K
) => {
  for (const key in source) {
    ;(target as any)[key] = source[key]
  }
  return target
}

const createIndicatorElement = () => {
  // indicators DOM
  const indicatorWrapper = document.createElement('div')
  const indicatorEl = document.createElement('div')
  indicatorWrapper.appendChild(indicatorEl)
  return {
    indicatorWrapper,
  }
}

describe('Indicators unit tests', () => {
  let scroll: BScroll

  beforeEach(() => {
    // BScroll DOM
    const wrapper = document.createElement('div')
    const content = document.createElement('div')
    wrapper.appendChild(content)

    scroll = new BScroll(wrapper, {})
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('constructor', () => {
    it('throw error when pass wrong options', () => {
      expect(() => {
        new Indicators(scroll)
      }).toThrow()
      expect(() => {
        addProperties(scroll.options, {
          indicators: [
            {
              relationElement: null,
            },
          ],
        })
        new Indicators(scroll)
      }).toThrow()
    })

    it('should create indicator elements', () => {
      const { indicatorWrapper } = createIndicatorElement()
      addProperties(scroll.options, {
        indicators: [
          {
            relationElement: indicatorWrapper,
          },
        ],
      })
      const indicatorsInstance = new Indicators(scroll)
      expect(indicatorsInstance.indicators.length).toBe(1)
    })

    it('destroy hook', () => {
      const { indicatorWrapper } = createIndicatorElement()
      addProperties(scroll.options, {
        indicators: [
          {
            relationElement: indicatorWrapper,
          },
        ],
      })
      const indicatorsInstance = new Indicators(scroll)
      scroll.hooks.trigger(scroll.hooks.eventTypes.destroy)
      for (let indicator of indicatorsInstance.indicators) {
        expect(indicator.destroy).toBeCalled()
      }
    })
  })
})
