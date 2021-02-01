import { Page } from 'puppeteer'
import extendTouch from '../../util/extendTouch'
import getTranslate from '../../util/getTranslate'
import getScale from '../../util/getScale'

jest.setTimeout(10000000)

describe('Movable & Zoom with multi content', () => {
  let page = (global as any).page as Page
  extendTouch(page)

  beforeAll(async () => {
    await page.goto('http://0.0.0.0:8932/#/movable/multi-content-scale')
  })

  beforeEach(async () => {
    await page.reload({
      waitUntil: 'domcontentloaded'
    })
  })

  it('should work well', async () => {
    await page.waitFor(300)
    const transformText1 = await page.$eval('.content1', node => {
      return window.getComputedStyle(node).transform
    })
    const x1 = getTranslate(transformText1, 'x')
    const y1 = getTranslate(transformText1, 'y')
    const scale1 = getScale(transformText1)

    expect(x1).toBe(47.5)
    expect(y1).toBe(89)
    expect(scale1).toBe(1.2)

    const transformText2 = await page.$eval('.content2', node => {
      return window.getComputedStyle(node).transform
    })
    const x2 = getTranslate(transformText2, 'x')
    const y2 = getTranslate(transformText2, 'y')

    expect(x2).toBe(0)
    expect(y2).toBe(150)
  })

  it('should work well when call putAt()', async () => {
    await page.waitFor(300)

    await page.click('.btn')

    await page.waitFor(1000)
    const transformText2 = await page.$eval('.content2', node => {
      return window.getComputedStyle(node).transform
    })
    const x2 = getTranslate(transformText2, 'x')
    const y2 = getTranslate(transformText2, 'y')

    expect(x2).toBe(135)
    expect(y2).toBe(215)
  })

  it('should work well when perform a zoom-out gesture', async () => {
    await page.waitFor(300)

    // zoom out
    await page.dispatchPinch({
      x: 265,
      y: 165,
      scaleFactor: 1.5,
      gestureSourceType: 'touch'
    })
    const transformText1 = await page.$eval('.content1', node => {
      return window.getComputedStyle(node).transform
    })
    const scale1 = getScale(transformText1)

    expect(scale1).toBeGreaterThan(1.2)
  })
})
