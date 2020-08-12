import { Page } from 'puppeteer'
import extendTouch from '../../util/extendTouch'
import getScale from '../../util/getScale'
import getTranslate from '../../util/getTranslate'

jest.setTimeout(10000000)

describe('Zoom', () => {
  let page = (global as any).page as Page
  extendTouch(page)

  beforeAll(async () => {
    await page.goto('http://0.0.0.0:8932/#/zoom')
  })

  beforeEach(async () => {
    await page.reload({
      waitUntil: 'domcontentloaded'
    })
  })

  it('should work when initializing to scaled > 1', async () => {
    await page.waitFor(300)
    const scaledElTransformText = await page.$eval('.zoom-items', node => {
      return window.getComputedStyle(node).transform
    })
    const scale = getScale(scaledElTransformText)

    expect(scale).toBe(1.5)
  })

  it('should work when initialOrigin is set to "center"', async () => {
    await page.waitFor(300)
    const scaledElTransformText = await page.$eval('.zoom-items', node => {
      return window.getComputedStyle(node).transform
    })
    const scale = getScale(scaledElTransformText)
    const x = getTranslate(scaledElTransformText, 'x')
    const y = getTranslate(scaledElTransformText, 'x')

    expect(scale).toBe(1.5)
    expect(x).toBeLessThan(0)
    expect(y).toBeLessThan(0)
  })

  it('should work by dispatching zooming out', async () => {
    await page.waitFor(300)

    // zoom out
    await page.dispatchPinch({
      x: 100,
      y: 100,
      scaleFactor: 1.1,
      gestureSourceType: 'touch'
    })

    const scaledElTransformText = await page.$eval('.zoom-items', node => {
      return window.getComputedStyle(node).transform
    })
    const scale = getScale(scaledElTransformText)

    expect(scale).toBeGreaterThan(1.5)
  })

  it('should work by dispatching zooming in', async () => {
    await page.waitFor(300)

    // zoom in
    await page.dispatchPinch({
      x: 200,
      y: 200,
      scaleFactor: 0.5,
      gestureSourceType: 'touch'
    })

    const scaledElTransformText = await page.$eval('.zoom-items', node => {
      return window.getComputedStyle(node).transform
    })
    const scale = getScale(scaledElTransformText)

    expect(scale).toBeLessThan(1.5)
  })

  it('should do a rebound animation when scale exceed "max", and recover to "max"', async () => {
    await page.waitFor(300)

    // zoom in
    await page.dispatchPinch({
      x: 200,
      y: 200,
      scaleFactor: 4,
      gestureSourceType: 'touch'
    })

    // wait for rebound animation ends
    await page.waitFor(1000)

    const scaledElTransformText = await page.$eval('.zoom-items', node => {
      return window.getComputedStyle(node).transform
    })
    const scale = getScale(scaledElTransformText)

    expect(scale).toBe(3)
  })

  it('should support zoomTo api', async () => {
    await page.waitFor(300)

    // zoomTo scale(0.5)
    await page.click('.zoom-half')
    await page.waitFor(1000)
    const scaledElTransformTextHalf = await page.$eval('.zoom-items', node => {
      return window.getComputedStyle(node).transform
    })
    let scaleHalf = getScale(scaledElTransformTextHalf)

    expect(scaleHalf).toBe(0.5)

    // zoomTo scale(1)
    await page.click('.zoom-original')
    await page.waitFor(1000)
    let scaledElTransformTextOriginal = await page.$eval(
      '.zoom-items',
      node => {
        return window.getComputedStyle(node).transform
      }
    )
    const scaleOriginal = getScale(scaledElTransformTextOriginal)
    const xOriginal = getTranslate(scaledElTransformTextOriginal, 'x')
    const yOriginal = getTranslate(scaledElTransformTextOriginal, 'y')

    expect(scaleOriginal).toBe(1)
    expect(xOriginal).toBe(0)
    expect(yOriginal).toBe(0)

    // zoomTo scale(2)
    await page.click('.zoom-double')
    await page.waitFor(1000)
    let scaledElTransformTextDouble = await page.$eval('.zoom-items', node => {
      return window.getComputedStyle(node).transform
    })
    const scaleDouble = getScale(scaledElTransformTextDouble)
    const xDouble = getTranslate(scaledElTransformTextDouble, 'x')
    const yDouble = getTranslate(scaledElTransformTextDouble, 'y')

    expect(scaleDouble).toBe(2)
    expect(xDouble).toBeLessThan(0)
    expect(yDouble).toBeLessThan(0)
  })
})
