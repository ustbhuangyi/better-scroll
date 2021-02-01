import { Page } from 'puppeteer'
import extendTouch from '../../util/extendTouch'
import getTranslate from '../../util/getTranslate'

jest.setTimeout(10000000)

describe('Scrollbar-vertical', () => {
  let page = (global as any).page as Page

  extendTouch(page)
  beforeAll(async () => {
    await page.goto('http://0.0.0.0:8932/#/scrollbar/vertical')
  })
  beforeEach(async () => {
    await page.reload({
      waitUntil: 'domcontentloaded',
    })
  })

  it('should render DOM correctly', async () => {
    await page.waitFor(300)

    const itemsCounts = await page.$$eval(
      '.bscroll-vertical-scrollbar',
      (element) => element.length
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
      gestureSourceType: 'touch',
    })

    const transformText = await page.$eval('.scrollbar-content', (node) => {
      return window.getComputedStyle(node).transform
    })

    const y = getTranslate(transformText, 'y')
    expect(y).toBeLessThan(0)
  })

  it('should make scrollbar fade in when dispatch touch event in BS', async () => {
    await page.waitFor(300)

    await page.dispatchScroll({
      x: 100,
      y: 100,
      xDistance: 0,
      yDistance: -100,
      gestureSourceType: 'touch',
    })

    const opacity = await page.$eval('.bscroll-vertical-scrollbar', (node) => {
      return window.getComputedStyle(node).opacity
    })
    expect(Number(opacity)).toBeGreaterThan(0)
  })

  it('should make scrollbar scroll in when manipulating BS', async () => {
    await page.waitFor(300)

    await page.dispatchScroll({
      x: 100,
      y: 100,
      xDistance: 0,
      yDistance: -100,
      gestureSourceType: 'touch',
    })

    const transformText = await page.$eval('.bscroll-indicator', (node) => {
      return window.getComputedStyle(node).transform
    })

    const y = getTranslate(transformText, 'y')
    expect(y).toBeGreaterThan(0)
  })
})
