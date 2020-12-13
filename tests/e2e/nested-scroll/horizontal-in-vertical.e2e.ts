import { Page } from 'puppeteer'
import extendTouch from '../../util/extendTouch'
import getTranslate from '../../util/getTranslate'

jest.setTimeout(10000000)

describe('Nested horizontal-in-vertical scroll', () => {
  let page = (global as any).page as Page
  extendTouch(page)
  beforeAll(async () => {
    await page.goto(
      'http://0.0.0.0:8932/#/nested-scroll/horizontal-in-vertical'
    )
  })
  beforeEach(async () => {
    await page.reload({
      waitUntil: 'domcontentloaded',
    })
  })

  it('should make outer BScroll scroll when manipulating outerBScroll', async () => {
    await page.waitFor(300)

    await page.dispatchScroll({
      x: 100,
      y: 60,
      xDistance: 0,
      yDistance: -70,
      gestureSourceType: 'touch',
    })

    await page.waitFor(1000)

    const transformText = await page.$eval('.vertical-content', (node) => {
      return window.getComputedStyle(node).transform
    })

    const translateX = getTranslate(transformText!, 'y')
    await expect(translateX).toBeLessThan(-30)
  })

  it('should only make innerBScroll scroll when manipulating innerBScroll', async () => {
    await page.waitFor(300)

    await page.dispatchScroll({
      x: 100,
      y: 450,
      xDistance: -300,
      yDistance: 0,
      gestureSourceType: 'touch',
    })

    await page.waitFor(1000)

    const outerTransformText = await page.$eval('.vertical-content', (node) => {
      return window.getComputedStyle(node).transform
    })
    const outerTranslateX = getTranslate(outerTransformText!, 'x')
    await expect(outerTranslateX).toBe(0)

    const innerTransformText = await page.$eval(
      '.slide-banner-content',
      (node) => {
        return window.getComputedStyle(node).transform
      }
    )
    const innerTranslateX = getTranslate(innerTransformText!, 'x')
    await expect(innerTranslateX).toBeLessThan(-100)
  })
})
