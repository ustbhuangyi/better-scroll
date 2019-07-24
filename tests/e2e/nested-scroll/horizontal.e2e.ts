import { Page } from 'puppeteer'
import extendTouch from '../../util/extendTouch'
import getTranslate from '../../util/getTranslate'

jest.setTimeout(10000000)

describe('Nested horizontal scroll', () => {
  let page = (global as any).page as Page
  extendTouch(page)
  beforeAll(async () => {
    await page.goto(
      'http://0.0.0.0:8932/#/nested-scroll/nested-horizontal-scroll'
    )
  })
  beforeEach(async () => {
    await page.reload({
      waitUntil: 'domcontentloaded'
    })
  })

  it('should make outer BScroll scroll when manipulating outerBScroll', async () => {
    await page.waitFor(300)

    await page.dispatchScroll({
      x: 100,
      y: 60,
      xDistance: -70,
      yDistance: 0,
      gestureSourceType: 'touch'
    })

    await page.waitFor(2500)

    const transformText = await page.$eval('.outer-content', node => {
      return window.getComputedStyle(node).transform
    })

    const translateX = getTranslate(transformText!, 'x')
    await expect(translateX).toBeLessThan(-30)
  })

  it('should only make innerBScroll scroll', async () => {
    await page.waitFor(300)

    const oldOuterTransformText = await page.$eval('.outer-content', node => {
      return window.getComputedStyle(node).transform
    })
    const oldOuterTranslateX = getTranslate(oldOuterTransformText!, 'x')

    await page.dispatchScroll({
      x: 270,
      y: 60,
      xDistance: -70,
      yDistance: 0,
      gestureSourceType: 'touch'
    })

    await page.waitFor(2500)

    const outerTransformText = await page.$eval('.outer-content', node => {
      return window.getComputedStyle(node).transform
    })
    const outerTranslateX = getTranslate(outerTransformText!, 'x')
    await expect(outerTranslateX).toBe(oldOuterTranslateX)

    const innerTransformText = await page.$eval('.inner-content', node => {
      return window.getComputedStyle(node).transform
    })
    const innerTranslateY = getTranslate(innerTransformText!, 'x')
    await expect(innerTranslateY).toBeLessThan(-30)
  })

  it('should make outer BScroll scroll when innerScroll reached boundary', async () => {
    await page.waitFor(300)

    await page.dispatchScroll({
      x: 270,
      y: 60,
      xDistance: -600,
      yDistance: 0,
      speed: 1800,
      gestureSourceType: 'touch'
    })

    await page.waitFor(2500)

    const innerTransformText = await page.$eval('.inner-content', node => {
      return window.getComputedStyle(node).transform
    })
    const innerTranslateX = getTranslate(innerTransformText!, 'x')
    await expect(innerTranslateX).toBeLessThan(-50)

    await page.dispatchScroll({
      x: 270,
      y: 60,
      xDistance: -50,
      yDistance: 0,
      gestureSourceType: 'touch'
    })

    const outerTransformText = await page.$eval('.outer-content', node => {
      return window.getComputedStyle(node).transform
    })
    const outerTranslateX = getTranslate(outerTransformText!, 'x')
    await expect(outerTranslateX).toBeLessThan(-20)
  })
})
