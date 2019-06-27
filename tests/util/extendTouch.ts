import { Page, Touchscreen } from 'puppeteer'

interface TouchPoint {
  x: number
  y: number
}

interface EventParams {
  type: string
  touchPoints: TouchPoint[]
}

// https://chromedevtools.github.io/devtools-protocol/tot/Input#method-synthesizePinchGesture
interface PinchParams {
  x: number
  y: number
  scaleFactor: number
  gestureSourceType: 'touch' | 'default' | 'mouse'
}

// https://chromedevtools.github.io/devtools-protocol/tot/Input#method-synthesizeScrollGesture
interface ScrollParams {
  x: number // X coordinate of the start of the gesture in CSS pixels.
  y: number // Y coordinate of the start of the gesture in CSS pixels.
  xDistance: number // positive to scroll left
  yDistance: number // positive to scroll up
  gestureSourceType: 'touch' | 'default' | 'mouse'
  speed?: number // Swipe speed in pixels per second
  xOverscroll?: number
  yOverscroll?: number
  preventFling?: boolean
  repeatCount?: number
  repeatDelayMs?: number
}

type EventTypes = 'touchStart' | 'touchMove' | 'touchEnd'

const DEFAULT_CHROMIUM_TOUCH_NAME = 'Input.dispatchTouchEvent'
const PINCH_NAME = 'Input.synthesizePinchGesture'
const SCROLL_NAME = 'Input.synthesizeScrollGesture'

declare module 'puppeteer' {
  interface Touchscreen {
    _client: {
      send: (
        name: string,
        params: EventParams | PinchParams | ScrollParams
      ) => Promise<void>
    }
  }
  interface Page {
    dispatchTouch: (type: EventTypes, touches: TouchPoint[]) => Promise<void>
    dispatchTouchStart: (touches: TouchPoint[]) => Promise<void>
    dispatchTouchMove: (touches: TouchPoint[]) => Promise<void>
    dispatchTouchEnd: () => Promise<void>
    dispatchSwipe: (
      touches: TouchPoint[][],
      cb: Function,
      interval?: number
    ) => Promise<void>
    dispatchPinch: (pinchParams: PinchParams) => Promise<void>
    dispatchScroll: (scrollParams: ScrollParams) => Promise<void>
    touchsceen: Touchscreen
  }
}

// puppeteer 1.17.0 has no api to implement touchmove
// since puppeteer is connected to chromium with chromeDevTools
// https://chromedevtools.github.io/devtools-protocol/tot/Input#method-dispatchTouchEvent
export default (page: Page) => {
  page.dispatchTouch = async (type: EventTypes, touches: TouchPoint[]) => {
    await page.touchscreen._client.send(DEFAULT_CHROMIUM_TOUCH_NAME, {
      type,
      touchPoints: touches
    })
  }
  page.dispatchTouchStart = async (touches: TouchPoint[]) => {
    await page.dispatchTouch('touchStart', touches)
  }
  page.dispatchTouchMove = async (touches: TouchPoint[]) => {
    await page.dispatchTouch('touchMove', touches)
  }
  page.dispatchTouchEnd = async () => {
    await page.dispatchTouch('touchEnd', [])
  }
  page.dispatchSwipe = async (
    touches: TouchPoint[][],
    cb: Function,
    interval: number = 30
  ) => {
    await page.dispatchTouchStart(touches[0])
    return new Promise(resolve => {
      const nextMove = function(i: number) {
        setTimeout(async () => {
          await page.dispatchTouchMove(touches[i])
          if (i === touches.length - 1) {
            // last one
            await page.dispatchTouchEnd()
            cb && cb()
            resolve()
          } else {
            nextMove(++i)
          }
        }, interval)
      }
      nextMove(1)
    })
  }
  page.dispatchPinch = async pinchParams => {
    await page.touchscreen._client.send(PINCH_NAME, pinchParams)
  }
  page.dispatchScroll = async scrollParams => {
    await page.touchscreen._client.send(SCROLL_NAME, scrollParams)
  }
}
