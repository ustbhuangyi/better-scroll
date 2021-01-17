import { Page } from 'puppeteer'
import extendMouseWheel from '../../util/extendMouseWheel'
import getTranslate from '../../util/getTranslate'

jest.setTimeout(10000000)

describe('Scrollbar-mousewheel', () => {
  let page = (global as any).page as Page

  extendMouseWheel(page)
  beforeAll(async () => {
    await page.goto('http://0.0.0.0:8932/#/scrollbar/mousewheel')
  })

  it('should trigger BS to move when using mousewheel', async () => {
    await page.waitFor(2000)
    await page.dispatchMouseWheel({
      type: 'mouseWheel',
      x: 100,
      y: 100,
      deltaX: 0,
      deltaY: 100,
    })
    await page.waitFor(1000)
    const transformText = await page.$eval(
      '.custom-horizontal-indicator',
      (node) => {
        return window.getComputedStyle(node).transform
      }
    )

    const x = getTranslate(transformText, 'x')
    expect(x).toBeGreaterThan(0)
  })
})
