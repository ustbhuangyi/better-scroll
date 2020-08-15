import { Page } from 'puppeteer'
import extendTouch from '../../util/extendTouch'
import getTranslate from '../../util/getTranslate'

jest.setTimeout(10000000)

describe('Slider for vertical', () => {
  let page = (global as any).page as Page
  extendTouch(page)
  beforeAll(async () => {
    await page.goto('http://0.0.0.0:8932/#/slide/vertical')
  })

  beforeEach(async () => {
    await page.reload({
      waitUntil: 'domcontentloaded'
    })
  })

  it('should work by dispatching touch events', async () => {
    await page.waitFor(1500)

    await page.dispatchScroll({
      x: 100,
      y: 200,
      xDistance: 0,
      yDistance: -50,
      gestureSourceType: 'touch'
    })

    await page.waitFor(1000)
    const transformText = await page.$eval('.slide-vertical-content', node => {
      return window.getComputedStyle(node).transform
    })
    const y = getTranslate(transformText, 'y')

    expect(y).toBe(-1334)
  })
})
