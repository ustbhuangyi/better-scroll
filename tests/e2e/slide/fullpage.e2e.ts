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

    await page.dispatchScroll({
      x: 100,
      y: 120,
      xDistance: -70,
      yDistance: 0,
      gestureSourceType: 'touch'
    })

    const content = await page.$('.slide-banner-wrapper')
    const boundingBox = await content!.boundingBox()
    await expect(boundingBox!.x).toBeLessThan(-600)
  })
})
