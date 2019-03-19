import {
  createHorizonSlide,
  createVerticalSlide,
  createHorizonVerticalSlide
} from './util'
export const bscrollHorizon = jest
  .fn()
  .mockImplementation((slideNum: number) => {
    const horizonSlide = createHorizonSlide(slideNum)
    return {
      options: {
        slide: {}
      },
      scroller: {
        wrapper: horizonSlide.dom,
        element: horizonSlide.slider,
        scrollBehaviorX: {
          hasScroll: true,
          maxScrollPos:
            horizonSlide.domStyle.width - horizonSlide.sliderStyle.width
        },
        scrollBehaviorY: {
          hasScroll: false,
          maxScrollPos: 0
        }
      }
    }
  })
export const bscrollVertical = jest
  .fn()
  .mockImplementation((slideNum: number) => {
    const verticalSlide = createVerticalSlide(slideNum)
    return {
      options: {
        slide: {}
      },
      scroller: {
        wrapper: verticalSlide.dom,
        element: verticalSlide.slider,
        scrollBehaviorX: {
          hasScroll: false,
          maxScrollPos: 0
        },
        scrollBehaviorY: {
          hasScroll: true,
          maxScrollPos:
            verticalSlide.domStyle.height - verticalSlide.sliderStyle.height
        }
      }
    }
  })
export const bscrollHorizonVertical = jest.fn().mockImplementation(() => {
  const hvSlide = createHorizonVerticalSlide()
  return {
    options: {
      slide: {}
    },
    scroller: {
      wrapper: hvSlide.dom,
      element: hvSlide.slider,
      scrollBehaviorX: {
        hasScroll: true,
        maxScrollPos: 300
      },
      scrollBehaviorY: {
        hasScroll: true,
        maxScrollPos: 300
      }
    }
  }
})

export function replaceBscrollProperties(
  originBs: { [key: string]: any },
  propertiesObj: { [key: string]: any }
) {
  Object.keys(propertiesObj).forEach(key => {
    originBs[key] = propertiesObj[key]
  })
}
