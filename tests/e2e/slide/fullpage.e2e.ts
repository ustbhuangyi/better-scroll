import { Page } from 'puppeteer'
import extendTouch from '../../util/extendTouch'

jest.setTimeout(10000000)

describe('Slider for fullpage', () => {
  let page = (global as any).page as Page
  extendTouch(page)
  beforeEach(async () => {
    await page.goto('http://0.0.0.0:8932/#/slide/fullpage')
  })

  it('should loop by default', async () => {
    await page.waitFor(300)
    const content = await page.$('.slide-banner-wrapper')
    await page.waitFor(5000)
    const boundingBox = await content!.boundingBox()
    await expect(boundingBox!.x).toBeLessThan(-600)
  })

  it('should work by dispatching touch events', async () => {
    await page.waitFor(300)

    await page.dispatchSwipe(
      [
        [
          {
            x: 100,
            y: 120
          }
        ],
        [
          {
            x: 90,
            y: 120
          }
        ],
        [
          {
            x: 80,
            y: 120
          }
        ],
        [
          {
            x: 75,
            y: 120
          }
        ],
        [
          {
            x: 70,
            y: 120
          }
        ]
      ],
      () => {},
      30
    )

    const content = await page.$('.slide-banner-wrapper')
    const boundingBox = await content!.boundingBox()
    await expect(boundingBox!.x).toBeLessThan(-600)
  })
})
