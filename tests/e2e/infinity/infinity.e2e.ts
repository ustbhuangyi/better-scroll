import { Page } from 'puppeteer'
import extendTouch from '../../util/extendTouch'

jest.setTimeout(5000)

describe('Infinity', () => {
  let page = (global as any).page as Page
  extendTouch(page)
  beforeAll(async () => {
    await page.goto('http://0.0.0.0:8932/#/infinity/')
  })

  it('should not render all elements when fetch data too mouch', async () => {
    await page.waitFor('infinity-item')
    // when
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
        ]
      ],
      () => {}
    )
    await page.waitFor(500)
    // then
    let itemNum = 0
    await page.$$eval('infinity-item', items => {
      itemNum = items.length
    })
    expect(itemNum).toBeLessThan(100)
  })
})
