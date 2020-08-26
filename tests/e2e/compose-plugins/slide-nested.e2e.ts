import { Page } from 'puppeteer'
import extendsTouch from '../../util/extendTouch'
import getTranslate from '../../util/getTranslate'

jest.setTimeout(1000000)

describe('Compose/slide-nested', () => {
  let page = (global as any).page as Page
  extendsTouch(page)
  beforeAll(async () => {
    await page.goto('http://0.0.0.0:8932/#/compose/slide-nested')
  })

  it('the outer scroll should scroll normally', async () => {
    await page.waitFor(1000)

    await page.dispatchScroll({
      x: 200,
      y: 100,
      xDistance: 0,
      yDistance: -70,
      gestureSourceType: 'touch',
    })
    await page.waitFor(1000)

    const transformText = await page.$eval('.outer-content', (node) => {
      return window.getComputedStyle(node).transform
    })
    const y = getTranslate(transformText, 'y')
    await expect(y).toBeLessThan(-30)
  })

  it('the inner scroll should scroll normally', async () => {
    await page.waitFor(1000)

    await page.dispatchScroll({
      x: 200,
      y: 300,
      xDistance: -100,
      yDistance: 0,
      gestureSourceType: 'touch',
    })

    await page.waitFor(1000)

    const transformText = await page.$eval('.slide-banner-content', (node) => {
      return window.getComputedStyle(node).transform
    })
    const x = getTranslate(transformText, 'x')

    expect(x).toBe(-666)
  })
})
