import { Page } from 'puppeteer'
import extendTouch from '../../util/extendTouch'

jest.setTimeout(10000000)

describe('Slider for mousewheel', () => {
  let page = (global as any).page as Page
  extendTouch(page)
  beforeEach(async () => {
    await page.goto('http://0.0.0.0:8932/#/zoom/')
  })

  it('should work by dispatching zooming out', async () => {
    await page.waitFor(300)

    // zoom out
    await page.dispatchPinch({
      x: 100,
      y: 100,
      scaleFactor: 1.1,
      gestureSourceType: 'touch'
    })

    const content = await page.$('.zoom-items')
    await page.waitFor(1000)
    const boundingBox = await content!.boundingBox()

    expect(boundingBox!.x).toBeLessThan(0)
    expect(boundingBox!.y).toBeLessThan(0)
  })

  it('should work by dispatching zooming in', async () => {
    await page.waitFor(300)

    // zoom in
    await page.dispatchPinch({
      x: 200,
      y: 200,
      scaleFactor: 0.5,
      gestureSourceType: 'touch'
    })

    const content = await page.$('.zoom-items')
    await page.waitFor(1000)
    const boundingBox = await content!.boundingBox()
    expect(boundingBox!.x).toBeGreaterThan(0)
    expect(boundingBox!.y).toBeGreaterThan(0)
  })
})
