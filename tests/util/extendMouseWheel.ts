import { Page } from 'puppeteer'

interface EventParams {
  type: string
  x: number
  y: number
  deltaX: number
  deltaY: number
}

const DEFAULT_CHROMIUM_MOUSE_WHEEL_NAME = 'Input.dispatchMouseEvent'

declare module 'puppeteer' {
  interface Mouse {
    _client: {
      send: (name: string, eventParams: EventParams) => Promise<void>
    }
  }
  interface Page {
    dispatchMouseWheel: (eventParams: EventParams) => Promise<void>
    mouse: Mouse
  }
}

// puppeteer 1.17.0 has no api to implement MouseWheel
// since puppeteer is connected to chromium with chromeDevTools
// https://chromedevtools.github.io/devtools-protocol/tot/Input/#method-dispatchMouseEvent
// so we can do it by ourselves
export default (page: Page) => {
  page.dispatchMouseWheel = async (eventParams: EventParams) => {
    await page.mouse._client.send(
      DEFAULT_CHROMIUM_MOUSE_WHEEL_NAME,
      eventParams
    )
  }
}
