import { Page } from 'puppeteer'
import extendTouch from '../../util/extendTouch'
import getTranslate from '../../util/getTranslate'

jest.setTimeout(10000000)

describe('Slider for fullpage', () => {
  let page = (global as any).page as Page
  extendTouch(page)
  beforeAll(async () => {
    await page.goto('http://0.0.0.0:8932/#/slide/fullpage')
  })

  beforeEach(async () => {
    await page.reload({
      waitUntil: 'domcontentloaded',
    })
  })

  it('should loop by default', async () => {
    await page.waitFor(300)

    // wait for slide autoplay
    await page.waitFor(4000)

    const transformText = await page.$eval('.slide-banner-content', (node) => {
      return window.getComputedStyle(node).transform
    })
    const x = getTranslate(transformText, 'x')

    expect(x).toBe(-750)
  })

  it('should work by dispatching touch events', async () => {
    await page.waitFor(300)

    await page.dispatchScroll({
      x: 100,
      y: 120,
      xDistance: -70,
      yDistance: 0,
      gestureSourceType: 'touch',
    })

    await page.waitFor(1500)

    const transformText = await page.$eval('.slide-banner-content', (node) => {
      return window.getComputedStyle(node).transform
    })
    const x = getTranslate(transformText, 'x')

    expect(x).toBe(-375)
  })
})
