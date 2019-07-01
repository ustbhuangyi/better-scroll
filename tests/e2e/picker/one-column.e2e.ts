import { Page } from 'puppeteer'
import extendTouch from '../../util/extendTouch'

jest.setTimeout(10000000)

describe('One column picker', () => {
  let page = (global as any).page as Page
  // disable cache
  page.setCacheEnabled(false)
  extendTouch(page)
  beforeEach(async () => {
    await page.goto('http://0.0.0.0:8932/#/picker/one-column')
  })

  it('should render picker DOM correctly', async () => {
    await page.waitFor(300)

    await page.click('.open')

    await page.waitFor(500)

    const displayText = await page.$eval('.picker-panel', node => {
      return window.getComputedStyle(node).display
    })

    await page.click('.cancel')
    await expect(displayText).toBe('block')
  })

  it('should wheelTo third item by default', async () => {
    await page.waitFor(300)

    await page.click('.open')

    await page.waitFor(500)

    const transformText = await page.$eval('.wheel-scroll', node => {
      return window.getComputedStyle(node).transform
    })
    const matrix = transformText!.split(')')[0].split(', ')
    const translateY = +(matrix[13] || matrix[5])
    await page.click('.cancel')
    await expect(translateY).toBe(-72)
  })

  it('should not select disabled item', async () => {
    await page.waitFor(300)

    await page.click('.open')

    await page.waitFor(1000)

    await page.tap('.wheel-disabled-item')

    const transformText = await page.$eval('.wheel-scroll', node => {
      return window.getComputedStyle(node).transform
    })
    const matrix = transformText!.split(')')[0].split(', ')
    const translateY = +(matrix[13] || matrix[5])
    await page.click('.cancel')
    await expect(translateY).toBe(-72)
  })

  it('should wheel to second item when click second item', async () => {
    await page.waitFor(300)

    await page.click('.open')

    await page.waitFor(1000)

    const items = await page.$$('.wheel-item')
    const secondItem = items[1]

    await secondItem.tap()

    // wait for transition ends
    await page.waitFor(1000)

    const transformText = await page.$eval('.wheel-scroll', node => {
      return window.getComputedStyle(node).transform
    })
    const matrix = transformText!.split(')')[0].split(', ')
    const translateY = +(matrix[13] || matrix[5])
    await page.click('.cancel')
    await expect(translateY).toBe(-36)
  })

  it('should scroll correctly when simulate touch event', async () => {
    await page.waitFor(300)

    await page.click('.open')

    await page.waitFor(1000)

    await page.dispatchSwipe(
      [
        [
          {
            x: 200,
            y: 630
          }
        ],
        [
          {
            x: 200,
            y: 625
          }
        ],
        [
          {
            x: 200,
            y: 620
          }
        ],
        [
          {
            x: 200,
            y: 615
          }
        ],
        [
          {
            x: 200,
            y: 610
          }
        ]
      ],
      () => {},
      30
    )

    // wait for transition ends
    await page.waitFor(1000)

    const transformText = await page.$eval('.wheel-scroll', node => {
      return window.getComputedStyle(node).transform
    })
    const matrix = transformText!.split(')')[0].split(', ')
    const translateY = +(matrix[13] || matrix[5])
    await expect(translateY).toBeLessThan(-72)
  })
})
