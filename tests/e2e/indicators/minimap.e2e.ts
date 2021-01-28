import { Page } from 'puppeteer'
import extendTouch from '../../util/extendTouch'
import getTranslate from '../../util/getTranslate'

jest.setTimeout(10000000)

describe('Indicators-minimap', () => {
  let page = (global as any).page as Page

  extendTouch(page)
  beforeAll(async () => {
    await page.goto('http://0.0.0.0:8932/#/indicators/minimap')
  })
  beforeEach(async () => {
    await page.reload({
      waitUntil: 'domcontentloaded'
    })
  })

  it('should render correctly', async () => {
    await page.waitFor(300)

    const transformText = await page.$eval('.scroll-content', node => {
      return window.getComputedStyle(node).transform
    })

    const transformBScrollY = getTranslate(transformText, 'y')

    const indicatorTransformText = await page.$eval(
      '.scroll-indicator-handle',
      node => {
        return window.getComputedStyle(node).transform
      }
    )

    const indicatorTransformY = getTranslate(indicatorTransformText, 'y')

    expect(transformBScrollY).toBe(-50)
    expect(indicatorTransformY).toBe(8)
  })

  it('should trigger BS to move when manipulating indicator', async () => {
    await page.waitFor(300)

    await page.dispatchScroll({
      x: 70,
      y: 240,
      xDistance: 70,
      yDistance: 70,
      gestureSourceType: 'touch'
    })

    const transformText = await page.$eval('.scroll-content', node => {
      return window.getComputedStyle(node).transform
    })

    const transformBScrollY = getTranslate(transformText, 'y')

    const indicatorTransformText = await page.$eval(
      '.scroll-indicator-handle',
      node => {
        return window.getComputedStyle(node).transform
      }
    )

    const indicatorTransformY = getTranslate(indicatorTransformText, 'y')

    expect(transformBScrollY).toBeLessThan(-50)
    expect(indicatorTransformY).toBeGreaterThan(8)
  })

  it('should make scrollbar scroll in when manipulating BS', async () => {
    await page.waitFor(300)

    await page.dispatchScroll({
      x: 100,
      y: 100,
      xDistance: -50,
      yDistance: -50,
      gestureSourceType: 'touch'
    })

    const transformText = await page.$eval('.scroll-content', node => {
      return window.getComputedStyle(node).transform
    })

    const transformBScrollY = getTranslate(transformText, 'y')

    const indicatorTransformText = await page.$eval(
      '.scroll-indicator-handle',
      node => {
        return window.getComputedStyle(node).transform
      }
    )

    const indicatorTransformY = getTranslate(indicatorTransformText, 'y')

    expect(transformBScrollY).toBeLessThan(-50)
    expect(indicatorTransformY).toBeGreaterThan(8)
  })
})
