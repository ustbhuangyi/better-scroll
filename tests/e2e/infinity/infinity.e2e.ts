import { Page } from 'puppeteer'
import extendTouch from '../../util/extendTouch'

jest.setTimeout(10000)

describe('Infinity', () => {
  let page = (global as any).page as Page
  extendTouch(page)
  beforeAll(async () => {
    await page.goto('http://0.0.0.0:8932/#/infinity/')
  })

  beforeEach(async () => {
    await page.reload()
  })

  it('should not render all elements when fetch data too mouch', async () => {
    await page.waitForSelector(
      '.infinity-timeline .infinity-item:not(.tombstone)'
    )
    // when
    await page.dispatchScroll({
      x: 100,
      y: 555,
      xDistance: 0,
      yDistance: -555,
      gestureSourceType: 'touch'
    })
    await page.waitFor(1001) // wait fetch data
    // then
    const itemNum = await page.$$eval(
      '.infinity-timeline .infinity-item:not(.tombstone)',
      items => items.length
    )

    expect(itemNum).toBeLessThan(60)
  })

  it('should render tombstones when data not loaded', async () => {
    await page.waitForSelector('.infinity-timeline .infinity-item')
    // when
    await page.dispatchScroll({
      x: 100,
      y: 555,
      xDistance: 0,
      yDistance: -555,
      gestureSourceType: 'touch'
    })
    // then
    const itemNum = await page.$$eval(
      '.infinity-timeline .tombstone',
      items => items.length
    )

    expect(itemNum).toBeGreaterThan(30)
  })
})
