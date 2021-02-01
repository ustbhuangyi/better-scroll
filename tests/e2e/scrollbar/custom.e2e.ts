import { Page } from 'puppeteer'
import extendTouch from '../../util/extendTouch'
import getTranslate from '../../util/getTranslate'

jest.setTimeout(10000000)

describe('Scrollbar-custom', () => {
  let page = (global as any).page as Page

  extendTouch(page)
  beforeAll(async () => {
    await page.goto('http://0.0.0.0:8932/#/scrollbar/custom')
  })
  beforeEach(async () => {
    await page.reload({
      waitUntil: 'domcontentloaded',
    })
  })

  it('should trigger BS to move when manipulating scrollbar', async () => {
    await page.waitFor(300)

    // horizontal
    await page.dispatchScroll({
      x: 123,
      y: 288,
      xDistance: 70,
      yDistance: 0,
      gestureSourceType: 'touch',
    })

    const transformXText = await page.$eval(
      '.custom-scrollbar-content',
      (node) => {
        return window.getComputedStyle(node).transform
      }
    )

    const x = getTranslate(transformXText, 'x')
    expect(x).toBeLessThan(0)

    // vertical
    await page.dispatchScroll({
      x: 288,
      y: 123,
      xDistance: 0,
      yDistance: 70,
      gestureSourceType: 'touch',
    })

    const transformYText = await page.$eval(
      '.custom-scrollbar-content',
      (node) => {
        return window.getComputedStyle(node).transform
      }
    )

    const y = getTranslate(transformYText, 'y')
    expect(y).toBeLessThan(0)
  })

  it('should trigger make scrollbar scroll in when manipulating BS', async () => {
    await page.waitFor(300)

    await page.dispatchScroll({
      x: 100,
      y: 100,
      xDistance: -100,
      yDistance: 0,
      gestureSourceType: 'touch',
    })

    const transformXText = await page.$eval(
      '.custom-horizontal-indicator',
      (node) => {
        return window.getComputedStyle(node).transform
      }
    )

    const x = getTranslate(transformXText, 'x')
    expect(x).toBeGreaterThan(0)

    await page.dispatchScroll({
      x: 100,
      y: 100,
      xDistance: 100,
      yDistance: -100,
      gestureSourceType: 'touch',
    })

    const transformYText = await page.$eval(
      '.custom-vertical-indicator',
      (node) => {
        return window.getComputedStyle(node).transform
      }
    )

    const y = getTranslate(transformYText, 'y')
    expect(y).toBeGreaterThan(0)
  })
})
