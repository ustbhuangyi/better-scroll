import { Page } from 'puppeteer'
import extendTouch from '../../util/extendTouch'

jest.setTimeout(10000000)

describe('BetterScroll in Form-Textarea', () => {
  let page = (global as any).page as Page

  extendTouch(page)
  beforeAll(async () => {
    await page.goto('http://0.0.0.0:8932/#/form/textarea')
  })
  beforeEach(async () => {
    await page.reload({
      waitUntil: 'domcontentloaded'
    })
  })

  it('should scroll when not manipulating texatea tag', async () => {
    await page.waitFor(1000)

    await page.dispatchScroll({
      x: 100,
      y: 150,
      xDistance: 0,
      yDistance: -70,
      gestureSourceType: 'touch'
    })

    const content = await page.$('.textarea-scroller')
    await page.waitFor(1000)
    const boundingBox = await content!.boundingBox()
    await expect(boundingBox!.y).toBeLessThan(0)
  })

  it('should not scroll when manipulating texatea tag', async () => {
    await page.reload()
    await page.waitFor(1000)

    await page.dispatchScroll({
      x: 200,
      y: 570,
      xDistance: 0,
      yDistance: -70,
      gestureSourceType: 'touch'
    })

    const content = await page.$('.textarea-scroller')
    await page.waitFor(1000)
    const boundingBox = await content!.boundingBox()
    await expect(boundingBox!.y).toBeGreaterThan(0)
  })
})
