import { createZoom } from './util'
export const bscrollZoom = jest.fn().mockImplementation(zoomOptions => {
  const zoomDom = createZoom()
  return {
    partOfbscroll: {
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
    },
    dom: zoomDom.dom
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
