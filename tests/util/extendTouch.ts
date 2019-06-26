import { Page, Touchscreen } from 'puppeteer'

interface TouchPoint {
  x: number
  y: number
}

interface EventParams {
  type: string
  touchPoints: TouchPoint[]
}

type EventTypes = 'touchStart' | 'touchMove' | 'touchEnd'

const DEFAULT_CHROMIUM_TOUCH_NAME = 'Input.dispatchTouchEvent'

declare module 'puppeteer' {
  interface Touchscreen {
    _client: {
      send: (name: string, eventParams: EventParams) => Promise<void>
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
}
