import { Page } from 'puppeteer'
import extendTouch from '../../util/extendTouch'
import getTranslate from '../../util/getTranslate'

jest.setTimeout(10000000)

describe('Movable Plugin', () => {
  let page = (global as any).page as Page
  extendTouch(page)

  beforeAll(async () => {
    await page.goto('http://0.0.0.0:8932/#/movable/default')
  })

  beforeEach(async () => {
    await page.reload({
      waitUntil: 'domcontentloaded',
    })
  })

  it('should work well when specify "startX & startY"', async () => {
    await page.waitFor(300)
    const scaledElTransformText = await page.$eval(
      '.scroll-content',
      (node) => {
        return window.getComputedStyle(node).transform
      }
    )
    const x = getTranslate(scaledElTransformText, 'x')
    const y = getTranslate(scaledElTransformText, 'y')

    expect(x).toBe(20)
    expect(y).toBe(20)
  })

  it('should work well when dispatchScroll', async () => {
    await page.waitFor(300)

    await page.dispatchScroll({
      x: 100,
      y: 100,
      xDistance: -70,
      yDistance: -70,
      gestureSourceType: 'touch',
    })

    await page.waitFor(2000)

    const scaledElTransformText = await page.$eval(
      '.scroll-content',
      (node) => {
        return window.getComputedStyle(node).transform
      }
    )
    const x = getTranslate(scaledElTransformText, 'x')
    const y = getTranslate(scaledElTransformText, 'y')

    expect(x).toBe(0)
    expect(y).toBe(0)
  })
})
