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
      partOfbscroll: {
        options: {
          slide: {}
        },
        scroller: {
          wrapper: horizonSlide.dom,
          content: horizonSlide.slider,
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
      },
      dom: horizonSlide.dom
    }
  })
export const bscrollVertical = jest
  .fn()
  .mockImplementation((slideNum: number) => {
    const verticalSlide = createVerticalSlide(slideNum)
    return {
      partOfbscroll: {
        options: {
          slide: {}
        },
        scroller: {
          wrapper: verticalSlide.dom,
          content: verticalSlide.slider,
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
      },
      dom: verticalSlide.dom
    }
  })
export const bscrollHorizonVertical = jest.fn().mockImplementation(() => {
  const hvSlide = createHorizonVerticalSlide()
  return {
    partOfbscroll: {
      options: {
        slide: {}
      },
      scroller: {
        wrapper: hvSlide.dom,
        content: hvSlide.slider,
        scrollBehaviorX: {
          hasScroll: true,
          maxScrollPos: 300
        },
        scrollBehaviorY: {
          hasScroll: true,
          maxScrollPos: 300
        }
      }
    },
    dom: hvSlide.dom
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
