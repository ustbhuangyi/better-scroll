import { Page } from 'puppeteer'
import extendTouch from '../../util/extendTouch'
import getTranslate from '../../util/getTranslate'

jest.setTimeout(10000000)

describe('Indicators-parallax-scroll', () => {
  let page = (global as any).page as Page

  extendTouch(page)
  beforeAll(async () => {
    await page.goto('http://0.0.0.0:8932/#/indicators/parallax-scroll')
  })
  beforeEach(async () => {
    await page.reload({
      waitUntil: 'domcontentloaded'
    })
  })

  it('should trigger BS to move when manipulating indicator', async () => {
    await page.waitFor(300)

    await page.dispatchScroll({
      x: 70,
      y: 240,
      xDistance: -70,
      yDistance: -70,
      gestureSourceType: 'touch'
    })

    await page.waitFor(800)

    const transformText = await page.$eval('.scroll-content', node => {
      return window.getComputedStyle(node).transform
    })

    const transformBScrollY = getTranslate(transformText, 'y')

    const indicator1TransformText = await page.$eval('.star1-bg', node => {
      return window.getComputedStyle(node).transform
    })

    const indicator2TransformText = await page.$eval('.star2-bg', node => {
      return window.getComputedStyle(node).transform
    })

    const indicator1TransformY = getTranslate(indicator1TransformText, 'y')
    const indicator2TransformY = getTranslate(indicator2TransformText, 'y')

    expect(transformBScrollY).toBeLessThan(0)
    expect(indicator1TransformY).toBeLessThan(0)
    expect(indicator2TransformY).toBeLessThan(0)
  })
})
