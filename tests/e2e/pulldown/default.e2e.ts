import { Page } from 'puppeteer'
import extendTouch from '../../util/extendTouch'

jest.setTimeout(10000000)

describe('Pulldown', () => {
  let page = (global as any).page as Page
  extendTouch(page)
  beforeEach(async () => {
    // disable cache
    await page.setCacheEnabled(false)
    await page.goto('http://0.0.0.0:8932/#/pulldown/')
  })

  it('should render DOM correctly', async () => {
    await page.waitFor(300)

    const itemsCounts = await page.$$eval(
      '.pulldown-list-item',
      element => element.length
    )

    await expect(itemsCounts).toBeGreaterThanOrEqual(20)
  })

  it('should trigger pullingup when BS reached the bottom', async () => {
    await page.waitFor(300)

    await page.dispatchScroll({
      x: 200,
      y: 100,
      xDistance: 0,
      yDistance: 400,
      speed: 1500,
      gestureSourceType: 'touch'
    })

    // wait for requesting data
    await page.waitFor(4000)
    const itemsCounts = await page.$$eval(
      '.pulldown-list-item',
      element => element.length
    )
    // has loaded
    await expect(itemsCounts).toBeGreaterThanOrEqual(40)
  })
})
