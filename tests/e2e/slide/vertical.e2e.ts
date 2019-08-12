import { Page } from 'puppeteer'
import extendTouch from '../../util/extendTouch'

jest.setTimeout(10000000)

describe('Slider for vertical', () => {
  let page = (global as any).page as Page
  extendTouch(page)
  beforeEach(async () => {
    await page.goto('http://0.0.0.0:8932/#/slide/vertical')
  })

  it('should work by dispatching touch events', async () => {
    await page.waitFor(300)

    await page.dispatchSwipe(
      [
        [
          {
            x: 100,
            y: 200
          }
        ],
        [
          {
            x: 100,
            y: 190
          }
        ],
        [
          {
            x: 100,
            y: 180
          }
        ],
        [
          {
            x: 100,
            y: 170
          }
        ],
        [
          {
            x: 100,
            y: 160
          }
        ]
      ],
      () => {},
      30
    )
    await page.waitFor(500)
    const content = await page.$('.slide-group')
    const boundingBox = await content!.boundingBox()
    await expect(boundingBox!.y).toBe(-1334)
  })
})
