import { Page } from 'puppeteer'
import extendTouch from '../../util/extendTouch'

jest.setTimeout(10000000)

describe('Linkage column picker', () => {
  let page = (global as any).page as Page
  // disable cache
  page.setCacheEnabled(false)
  extendTouch(page)
  beforeEach(async () => {
    await page.goto('http://0.0.0.0:8932/#/picker/linkage-column')
  })

  it('should get correct text when click "confirm" button', async () => {
    await page.waitFor(300)

    await page.click('.open')

    await page.waitFor(1000)

    const openBtn = await page.$('.open')

    await page.click('.confirm')

    // wait for transition ends
    await page.waitFor(100)

    const innerText = await page.$eval('.open', node => {
      return node.textContent
    })
    await page.click('.cancel')
    await expect(innerText).toBe('北京市-北京市')
  })

  it('should linkage correctly when click TianJin province', async () => {
    await page.waitFor(300)

    await page.click('.open')

    await page.waitFor(1000)

    const [firstWheelScroll] = await page.$$('.wheel-scroll')

    const [, TianJinProvince] = await firstWheelScroll.$$('.wheel-item')

    await TianJinProvince.tap()

    // when transition ends
    await page.waitFor(500)

    const cityBtnText = await page.$$eval('.wheel-scroll', nodes => {
      return nodes[1].querySelectorAll('.wheel-item')[0].textContent
    })

    await expect(cityBtnText).toBe('天津市')
  })

  it('should linkage correctly when dispatch touch event in first column', async () => {
    await page.waitFor(300)

    await page.click('.open')

    await page.waitFor(1000)

    // first column
    await page.dispatchSwipe(
      [
        [
          {
            x: 100,
            y: 630
          }
        ],
        [
          {
            x: 100,
            y: 625
          }
        ],
        [
          {
            x: 100,
            y: 620
          }
        ],
        [
          {
            x: 100,
            y: 615
          }
        ],
        [
          {
            x: 100,
            y: 610
          }
        ]
      ],
      () => {},
      30
    )

    // when transition ends
    await page.waitFor(1000)

    const cityBtnText = await page.$$eval('.wheel-scroll', nodes => {
      return nodes[1].querySelectorAll('.wheel-item')[0].textContent
    })

    await expect(cityBtnText).not.toBe('北京市')
  })
})
