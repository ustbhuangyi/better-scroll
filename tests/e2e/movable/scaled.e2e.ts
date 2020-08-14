import { Page } from 'puppeteer'
import extendTouch from '../../util/extendTouch'
import getTranslate from '../../util/getTranslate'
import getScale from '../../util/getScale'

jest.setTimeout(10000000)

describe('Movable & Zoom Plugin', () => {
  let page = (global as any).page as Page
  extendTouch(page)

  beforeAll(async () => {
    await page.goto('http://0.0.0.0:8932/#/movable/scale')
  })

  beforeEach(async () => {
    await page.reload({
      waitUntil: 'domcontentloaded'
    })
  })

  it('should support zoom in', async () => {
    await page.waitFor(1000)

    await page.waitFor(1000)
    // zoom in
    await page.dispatchPinch({
      x: 180,
      y: 180,
      scaleFactor: 0.9,
      gestureSourceType: 'touch'
    })

    const scaledElTransformText = await page.$eval('.scroll-content', node => {
      return window.getComputedStyle(node).transform
    })
    const x = getTranslate(scaledElTransformText, 'x')
    const y = getTranslate(scaledElTransformText, 'x')
    const scale = getScale(scaledElTransformText)

    expect(x).toBeGreaterThan(0)
    expect(y).toBeGreaterThan(20)
    expect(scale).toBeLessThan(1)
  })

  it('should support zoom out', async () => {
    await page.waitFor(1000)
    // zoom out
    await page.dispatchPinch({
      x: 180,
      y: 180,
      scaleFactor: 1.5,
      gestureSourceType: 'touch'
    })
    await page.waitFor(1000)

    const scaledElTransformText = await page.$eval('.scroll-content', node => {
      return window.getComputedStyle(node).transform
    })
    const x = getTranslate(scaledElTransformText, 'x')
    const y = getTranslate(scaledElTransformText, 'x')
    const scale = getScale(scaledElTransformText)

    expect(x).toBeLessThan(0)
    expect(y).toBeLessThan(0)
    expect(scale).toBeGreaterThan(1)
  })

  // it('should work well when dispatchScroll', async () => {
  //   await page.waitFor(300)

  //   await page.dispatchScroll({
  //     x: 100,
  //     y: 100,
  //     xDistance: -70,
  //     yDistance: -70,
  //     gestureSourceType: 'touch'
  //   })

  //   await page.waitFor(2000)

  //   const scaledElTransformText = await page.$eval('.scroll-content', node => {
  //     return window.getComputedStyle(node).transform
  //   })
  //   const x = getTranslate(scaledElTransformText, 'x')
  //   const y = getTranslate(scaledElTransformText, 'x')

  //   expect(x).toBe(0)
  //   expect(y).toBe(0)
  // })
})
