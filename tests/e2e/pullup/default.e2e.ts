import { Page } from 'puppeteer'
import extendTouch from '../../util/extendTouch'

jest.setTimeout(10000000)

describe('Pullup', () => {
  let page = (global as any).page as Page
  // disable cache
  page.setCacheEnabled(false)
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

    await page.dispatchSwipe(
      [
        [
          {
            x: 200,
            y: 630
          }
        ],
        [
          {
            x: 200,
            y: 575
          }
        ],
        [
          {
            x: 200,
            y: 560
          }
        ],
        [
          {
            x: 200,
            y: 550
          }
        ],
        [
          {
            x: 200,
            y: 500
          }
        ],
        [
          {
            x: 200,
            y: 450
          }
        ],
        [
          {
            x: 200,
            y: 400
          }
        ],
        [
          {
            x: 200,
            y: 100
          }
        ]
      ],
      () => {},
      5
    )

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
