import { Page } from 'puppeteer'
import extendTouch from '../../util/extendTouch'
import getTranslate from '../../util/getTranslate'

jest.setTimeout(10000000)

describe('Nested triple-vertical scroll', () => {
  let page = (global as any).page as Page
  extendTouch(page)
  beforeAll(async () => {
    await page.goto('http://0.0.0.0:8932/#/nested-scroll/triple-vertical')
  })
  beforeEach(async () => {
    await page.reload({
      waitUntil: 'domcontentloaded',
    })
  })

  it('should make outer BScroll scroll and others keep unmoved when manipulating outerBScroll', async () => {
    await page.waitFor(300)

    await page.dispatchScroll({
      x: 160,
      y: 150,
      xDistance: 0,
      yDistance: -70,
      gestureSourceType: 'touch',
    })

    await page.waitFor(2500)

    const outerTransformText = await page.$eval('.outer-content', (node) => {
      return window.getComputedStyle(node).transform
    })
    const middleTransformText = await page.$eval('.middle-content', (node) => {
      return window.getComputedStyle(node).transform
    })
    const innerTransformText = await page.$eval('.inner-content', (node) => {
      return window.getComputedStyle(node).transform
    })

    const outerTranslateY = getTranslate(outerTransformText!, 'y')
    const middleTranslateY = getTranslate(middleTransformText!, 'y')
    const innerTranslateY = getTranslate(innerTransformText!, 'y')

    expect(outerTranslateY).toBeLessThan(-30)
    expect(middleTranslateY).toBeNaN()
    expect(innerTranslateY).toBeNaN()
  })

  it('should only make middle scroll and others keep unmoved', async () => {
    await page.waitFor(300)

    await page.dispatchScroll({
      x: 160,
      y: 250,
      xDistance: 0,
      yDistance: -70,
      gestureSourceType: 'touch',
    })

    await page.waitFor(1000)

    const outerTransformText = await page.$eval('.outer-content', (node) => {
      return window.getComputedStyle(node).transform
    })
    const outerTranslateY = getTranslate(outerTransformText!, 'y')

    const middleTransformText = await page.$eval('.middle-content', (node) => {
      return window.getComputedStyle(node).transform
    })
    const middleTranslateY = getTranslate(middleTransformText!, 'y')

    const innerTransformText = await page.$eval('.inner-content', (node) => {
      return window.getComputedStyle(node).transform
    })
    const innerTranslateY = getTranslate(innerTransformText!, 'y')

    expect(innerTranslateY).toBeNaN()
    expect(middleTranslateY).toBeLessThan(-30)
    expect(outerTranslateY).toBe(0)
  })

  it('should only make inner scroll and others keep unmoved', async () => {
    await page.waitFor(300)

    await page.dispatchScroll({
      x: 160,
      y: 450,
      xDistance: 0,
      yDistance: -70,
      gestureSourceType: 'touch',
    })

    await page.waitFor(1000)

    const outerTransformText = await page.$eval('.outer-content', (node) => {
      return window.getComputedStyle(node).transform
    })
    const outerTranslateY = getTranslate(outerTransformText!, 'y')

    const middleTransformText = await page.$eval('.middle-content', (node) => {
      return window.getComputedStyle(node).transform
    })
    const middleTranslateY = getTranslate(middleTransformText!, 'y')

    const innerTransformText = await page.$eval('.inner-content', (node) => {
      return window.getComputedStyle(node).transform
    })
    const innerTranslateY = getTranslate(innerTransformText!, 'y')

    expect(innerTranslateY).toBeLessThan(-30)
    expect(middleTranslateY).toBe(0)
    expect(outerTranslateY).toBe(0)
  })

  it('should make parent BScroll scroll when innerScroll reached boundary', async () => {
    await page.waitFor(300)

    await page.dispatchScroll({
      x: 160,
      y: 450,
      xDistance: 0,
      yDistance: 50,
      speed: 3000,
      gestureSourceType: 'touch',
    })

    const outerTransformText = await page.$eval('.outer-content', (node) => {
      return window.getComputedStyle(node).transform
    })
    const outerTranslateY = getTranslate(outerTransformText!, 'y')

    const middleTransformText = await page.$eval('.middle-content', (node) => {
      return window.getComputedStyle(node).transform
    })
    const middleTranslateY = getTranslate(middleTransformText!, 'y')

    const innerTransformText = await page.$eval('.inner-content', (node) => {
      return window.getComputedStyle(node).transform
    })
    const innerTranslateY = getTranslate(innerTransformText!, 'y')

    expect(outerTranslateY).toBeGreaterThan(0)
    expect(middleTranslateY).toBeNaN()
    expect(innerTranslateY).toBeNaN()
  })

  it('click', async () => {
    const mockOuterHandler = jest.fn()
    const mockMiddleHandler = jest.fn()
    const mockInnerHandler = jest.fn()

    // outer click
    page.once('dialog', async (dialog) => {
      mockOuterHandler()
      await dialog.dismiss()
    })
    await page.touchscreen.tap(150, 100)
    expect(mockOuterHandler).toBeCalledTimes(1)

    await page.waitFor(500)

    // middle click
    page.once('dialog', async (dialog) => {
      mockMiddleHandler()
      await dialog.dismiss()
    })
    await page.touchscreen.tap(150, 250)
    expect(mockMiddleHandler).toBeCalledTimes(1)

    await page.waitFor(500)

    // inner click
    page.once('dialog', async (dialog) => {
      mockInnerHandler()
      await dialog.dismiss()
    })
    await page.touchscreen.tap(150, 400)
    expect(mockInnerHandler).toBeCalledTimes(1)
  })
})
