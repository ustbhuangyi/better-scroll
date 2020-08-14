import {
  createEvent,
  CustomTouchEvent
} from '@better-scroll/core/src/__tests__/__utils__/event'
import { createDiv } from '@better-scroll/core/src/__tests__/__utils__/layout'

export function createZoomElements() {
  const wrapper = createDiv(300, 300)
  const scaledElement = createDiv(300, 300, 0, 0)
  wrapper.appendChild(scaledElement)
  return { wrapper, scaledElement }
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
