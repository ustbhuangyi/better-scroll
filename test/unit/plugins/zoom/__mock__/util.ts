import { createEvent, CustomTouchEvent } from '../../../utils/event'
import {
  mockClientWidth,
  mockClientHeight,
  mockOffsetWidth,
  mockOffsetHeight,
  mockOffsetLeft,
  mockOffsetTop,
  CustomHTMLDivElement
} from '../../../utils/layout'

mockClientHeight.get.mockImplementation(dom => {
  return dom._jsdomMockClientHeight || 0
})
mockClientWidth.get.mockImplementation(dom => {
  return dom._jsdomMockClientWidth || 0
})
mockOffsetHeight.get.mockImplementation(dom => {
  return dom._jsdomMockOffsetHeight || 0
})
mockOffsetWidth.get.mockImplementation(dom => {
  return dom._jsdomMockOffsetWidth || 0
})
mockOffsetTop.get.mockImplementation(dom => {
  return dom._jsdomMockOffsetTop || 0
})
mockOffsetLeft.get.mockImplementation(dom => {
  return dom._jsdomMockOffsetLeft || 0
})

export function createZoom() {
  const dom = document.createElement('div') as CustomHTMLDivElement
  dom.style.width = '300px'
  dom.style.height = '300px'
  dom.style.overflow = 'hidden'
  dom._jsdomMockClientHeight = 300
  dom._jsdomMockClientWidth = 300

  const zoomEl = document.createElement('div') as CustomHTMLDivElement
  zoomEl.style.height = '100%'
  zoomEl._jsdomMockClientHeight = 300
  zoomEl._jsdomMockClientWidth = 300
  zoomEl._jsdomMockOffsetWidth = 300
  zoomEl._jsdomMockOffsetHeight = 300
  zoomEl._jsdomMockOffsetTop = 0
  zoomEl._jsdomMockOffsetLeft = 0

  dom.appendChild(zoomEl)
  return { dom, zoomEl }
}

export function createTouchEvent(
  firstFingerPoint: { pageX: number; pageY: number },
  secondFingerPoint?: { pageX: number; pageY: number }
): CustomTouchEvent {
  const e = createEvent('Event', 'touch') as CustomTouchEvent
  e.touches = [firstFingerPoint]
  if (secondFingerPoint) {
    e.touches.push(secondFingerPoint)
  }
  return e
}
