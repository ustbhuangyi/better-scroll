import { Page } from 'puppeteer'
import extendTouch from '../../util/extendTouch'

jest.setTimeout(10000000)

describe('Pullup', () => {
  let page = (global as any).page as Page
  extendTouch(page)

  beforeEach(async () => {
    await page.goto('http://0.0.0.0:8932/#/pullup/')
  })

  it('should render DOM correctly', async () => {
    await page.waitFor(300)

    const itemsCounts = await page.$$eval(
      '.pullup-list-item',
      element => element.length
    )

    await expect(itemsCounts).toBeGreaterThanOrEqual(30)
  })

  it('should trigger pullingup when BS reached the bottom', async () => {
    await page.waitFor(300)

    await page.dispatchScroll({
      x: 200,
      y: 630,
      xDistance: 0,
      yDistance: -500,
      speed: 1500,
      gestureSourceType: 'touch'
    })

    // wait for requesting data
    await page.waitFor(3000)

    const itemsCounts = await page.$$eval(
      '.pullup-list-item',
      element => element.length
    )
    // has loaded
    await expect(itemsCounts).toBeGreaterThan(40)
  })
})
