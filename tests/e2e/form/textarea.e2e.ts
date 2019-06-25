import { Page } from 'puppeteer'
import extendTouch from '../../util/extendTouch'

jest.setTimeout(10000000)

describe('BetterScroll in Form-Textarea', () => {
  let page = (global as any).page as Page
  extendTouch(page)
  beforeAll(async () => {
    await page.goto('http://0.0.0.0:8932/#/form/textarea')
  })

  it('should scroll when not manipulating texatea tag', async () => {
    await page.waitFor(1000)
    await page.dispatchSwipe(
      [
        [
          {
            x: 100,
            y: 150
          }
        ],
        [
          {
            x: 100,
            y: 140
          }
        ],
        [
          {
            x: 100,
            y: 130
          }
        ],
        [
          {
            x: 100,
            y: 120
          }
        ],
        [
          {
            x: 100,
            y: 110
          }
        ]
      ],
      () => {},
      30
    )

    const content = await page.$('.textarea-scroller')
    await page.waitFor(1000)
    const boundingBox = await content!.boundingBox()
    await expect(boundingBox!.y).toBeLessThan(0)
  })

  it.only('should not scroll when manipulating texatea tag', async () => {
    await page.waitFor(1000)
    const SwiperHandler = jest.fn()
    await page.dispatchSwipe(
      [
        [
          {
            x: 100,
            y: 450
          }
        ],
        [
          {
            x: 100,
            y: 440
          }
        ],
        [
          {
            x: 100,
            y: 430
          }
        ]
      ],
      () => {},
      30
    )

    const content = await page.$('.textarea-scroller')
    await page.waitFor(1000)
    const boundingBox = await content!.boundingBox()
    await expect(boundingBox!.y).toBeGreaterThan(0)
  })
})
