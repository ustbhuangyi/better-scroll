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

  it('should not allow move to pre page when it is first page and loop is false', async () => {
    await page.waitFor(300)

    await page.dispatchScroll({
      x: 100,
      y: 120,
      xDistance: 110,
      yDistance: 0,
      gestureSourceType: 'touch',
    })

    await page.waitFor(200)

    const transformText = await page.$eval('.slide-banner-content', (node) => {
      return window.getComputedStyle(node).transform
    })
    const x = getTranslate(transformText, 'x')

    expect(x).toBe(0)
  })

  it('should not allow move to next page when it is last page and loop is false', async () => {
    await page.waitFor(300)

    // to second page
    await page.dispatchScroll({
      x: 100,
      y: 120,
      xDistance: -110,
      yDistance: 0,
      gestureSourceType: 'touch',
    })

    await page.waitFor(1000)

    // to third page
    await page.dispatchScroll({
      x: 100,
      y: 120,
      xDistance: -110,
      yDistance: 0,
      gestureSourceType: 'touch',
    })

    await page.waitFor(1000)

    // to last page
    await page.dispatchScroll({
      x: 100,
      y: 120,
      xDistance: -110,
      yDistance: 0,
      gestureSourceType: 'touch',
    })

    await page.waitFor(1000)

    // attempts to go next
    await page.dispatchScroll({
      x: 100,
      y: 120,
      xDistance: -110,
      yDistance: 0,
      gestureSourceType: 'touch',
    })

    await page.waitFor(1000)

    const transformText = await page.$eval('.slide-banner-content', (node) => {
      return window.getComputedStyle(node).transform
    })
    const x = getTranslate(transformText, 'x')

    expect(x).toBe(-1125)
  })

  it('should work by dispatching touch events', async () => {
    await page.waitFor(300)

    await page.dispatchScroll({
      x: 100,
      y: 120,
      xDistance: -110,
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
