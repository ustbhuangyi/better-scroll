import { Page } from 'puppeteer'
import extendTouch from '../../util/extendTouch'

jest.setTimeout(10000000)

describe('Scrollbar', () => {
  let page = (global as any).page as Page

  extendTouch(page)
  beforeAll(async () => {
    await page.goto('http://0.0.0.0:8932/#/scrollbar/')
  })
  beforeEach(async () => {
    await page.reload({
      waitUntil: 'domcontentloaded'
    })
  })

  it('should render DOM correctly', async () => {
    await page.waitFor(300)

    const itemsCounts = await page.$$eval(
      '.bscroll-vertical-scrollbar',
      element => element.length
    )

    await expect(itemsCounts).toBeGreaterThanOrEqual(1)
  })

  it('should trigger BS to move when manipulating scrollbar', async () => {
    await page.waitFor(300)

    await page.dispatchScroll({
      x: 325,
      y: 560,
      xDistance: 0,
      yDistance: -70,
      gestureSourceType: 'touch'
    })

    const transformText = await page.$eval('.scrollbar-list', node => {
      return window.getComputedStyle(node).transform
    })

    const matrix = transformText!.split(')')[0].split(', ')
    const translateY = +(matrix[13] || matrix[5])
    await expect(translateY).toBeLessThan(0)
  })

  it('should trigger make scrollbar fade in when dispatch touch event in BS', async () => {
    await page.waitFor(300)

    await page.dispatchScroll({
      x: 100,
      y: 100,
      xDistance: 0,
      yDistance: -100,
      gestureSourceType: 'touch'
    })

    const opacity = await page.$eval('.bscroll-vertical-scrollbar', node => {
      return window.getComputedStyle(node).opacity
    })
    await expect(Number(opacity)).toBeGreaterThan(0)
  })
})
