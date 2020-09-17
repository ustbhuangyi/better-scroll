import { Page } from 'puppeteer'
import extendTouch from '../../util/extendTouch'
import getTranslate from '../../util/getTranslate'

jest.setTimeout(10000000)

describe('ObserveDOM', () => {
  let page = (global as any).page as Page
  extendTouch(page)
  beforeEach(async () => {
    await page.goto('http://0.0.0.0:8932/#/observe-dom/')
  })

  it('should observe DOM change and auto refresh bs', async () => {
    await page.waitFor(300)

    const preItemsCounts = await page.$$eval(
      '.scroll-item',
      (element) => element.length
    )

    expect(preItemsCounts).toBe(10)

    await page.click('.btn')

    await page.waitFor(100)

    const PostItemsCounts = await page.$$eval(
      '.scroll-item',
      (element) => element.length
    )

    expect(PostItemsCounts).toBe(12)

    await page.dispatchScroll({
      x: 100,
      y: 120,
      xDistance: -150,
      yDistance: 0,
      gestureSourceType: 'touch',
    })
    await page.waitFor(2600)

    const transformText = await page.$eval('.scroll-content', (node) => {
      return window.getComputedStyle(node).transform
    })
    const x = getTranslate(transformText, 'x')

    expect(x).toBeLessThanOrEqual(-361)
  })
})
