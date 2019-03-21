import { createZoom } from './util'
export const bscrollZoom = jest.fn().mockImplementation(zoomOptions => {
  const zoomDom = createZoom()
  return {
    options: {
      zoom: zoomOptions,
      freeScroll: true,
      scrollX: true,
      scrollY: true
    },
    scroller: {
      wrapper: zoomDom.dom,
      content: zoomDom.zoomEl,
      scrollBehaviorX: {
        hasScroll: false,
        maxScrollPos: 0,
        minScrollPos: 0
      },
      scrollBehaviorY: {
        hasScroll: false,
        maxScrollPos: 0,
        minScrollPos: 0
      },
      translater: {}
    },
    eventTypes: {
      zoomStart: 'zoomStart',
      zoomEnd: 'zoomEnd'
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
