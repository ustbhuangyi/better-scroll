import { Page } from 'puppeteer'
import extendMouseWheel from '../../util/extendMouseWheel'
import getTranslate from '../../util/getTranslate'

jest.setTimeout(10000000)

describe('Slider for mousewheel', () => {
  let page = (global as any).page as Page
  extendMouseWheel(page)
  beforeAll(async () => {
    await page.goto('http://0.0.0.0:8932/#/slide/pc')
  })

  beforeEach(async () => {
    await page.reload({
      waitUntil: 'domcontentloaded'
    })
  })

  it('should work by dispatching touch events', async () => {
    await page.waitFor(300)

    await page.dispatchMouseWheel({
      type: 'mouseWheel',
      x: 100,
      y: 100,
      deltaX: 0,
      deltaY: 50
    })
    // wait for transition ends
    await page.waitFor(1000)

    const transformText = await page.$eval('.slide-banner-content', node => {
      return window.getComputedStyle(node).transform
    })
    const x = getTranslate(transformText, 'x')
    expect(x).toBe(-670)
  })
})
