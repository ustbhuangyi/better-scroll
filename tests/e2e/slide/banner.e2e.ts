import { Page } from 'puppeteer'
import extendTouch from '../../util/extendTouch'

jest.setTimeout(10000000)

describe('Slider for banner', () => {
  let page = (global as any).page as Page
  extendTouch(page)
  beforeAll(async () => {
    await page.goto('http://0.0.0.0:8932/#/slide/banner')
  })

  it('should loop by default', async () => {
    await page.waitFor(300)
    const content = await page.$('.slide-banner-wrapper')
    await page.waitFor(5000)
    const boundingBox = await content!.boundingBox()
    await expect(boundingBox!.x).toBeLessThan(-600)
  })

  it('should go nextPage when click nextPage button', async () => {
    await page.waitFor(300)
    const content = await page.$('.slide-banner-wrapper')

    const oldBoundingBox = await content!.boundingBox()
    const oldX = oldBoundingBox!.x
    // simulate click
    await page.click('.next')

    // wairt for bs to do a transition
    await page.waitFor(1500)

    const curBoundingBox = await content!.boundingBox()
    const currentX = curBoundingBox!.x
    await expect(currentX - oldX).toBeLessThan(0)
  })

  it('should go prevPage when click prevPage button', async () => {
    await page.waitFor(300)
    const content = await page.$('.slide-banner-wrapper')

    const oldBoundingBox = await content!.boundingBox()
    const oldX = oldBoundingBox!.x
    // simulate click
    await page.click('.prev')

    // wairt for bs to do a transition
    await page.waitFor(1500)

    const curBoundingBox = await content!.boundingBox()
    const currentX = curBoundingBox!.x
    await expect(currentX - oldX).toBeGreaterThan(0)
  })
})
