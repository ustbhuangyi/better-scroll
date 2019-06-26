import { Page } from 'puppeteer'
import extendMouseWheel from '../../util/extendMouseWheel'

jest.setTimeout(10000000)

describe('Slider for mousewheel', () => {
  let page = (global as any).page as Page
  extendMouseWheel(page)
  beforeEach(async () => {
    await page.goto('http://0.0.0.0:8932/#/slide/pc')
  })

  it('should work by dispatching touch events', async () => {
    await page.waitFor(300)

    await page.dispatchMouseWheel({
      type: 'mouseWheel',
      x: 100,
      y: 100,
      deltaX: 0,
      deltaY: 50
    })
    // wait for transition ends
    await page.waitFor(1000)
    const content = await page.$('.slide-banner-wrapper')
    const boundingBox = await content!.boundingBox()
    await expect(boundingBox!.x).toBeLessThan(-600)
  })
})
