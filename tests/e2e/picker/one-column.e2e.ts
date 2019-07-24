import { Page } from 'puppeteer'
import extendTouch from '../../util/extendTouch'
import getTranslate from '../../util/getTranslate'

jest.setTimeout(10000000)

describe('One column picker', () => {
  let page = (global as any).page as Page
  extendTouch(page)

  beforeAll(async () => {
    await page.goto('http://0.0.0.0:8932/#/picker/one-column')
  })
  beforeEach(async () => {
    await page.reload({
      waitUntil: 'domcontentloaded'
    })
  })

  it('should render picker DOM correctly', async () => {
    await page.waitFor(300)

    await page.click('.open')

    await page.waitFor(500)

    const displayText = await page.$eval('.picker-panel', node => {
      return window.getComputedStyle(node).display
    })

    await expect(displayText).toBe('block')
  })

  it('should wheelTo third item by default', async () => {
    await page.waitFor(300)

    await page.click('.open')

    await page.waitFor(500)

    const transformText = await page.$eval('.wheel-scroll', node => {
      return window.getComputedStyle(node).transform
    })
    const translateY = getTranslate(transformText!, 'y')

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
    const translateY = getTranslate(transformText!, 'y')
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
    const translateY = getTranslate(transformText!, 'y')
    await expect(translateY).toBe(-36)
  })

  it('should scroll correctly when simulate touch event', async () => {
    await page.waitFor(300)

    await page.click('.open')

    await page.waitFor(1000)

    await page.dispatchScroll({
      x: 200,
      y: 630,
      xDistance: 0,
      yDistance: -70,
      gestureSourceType: 'touch'
    })

    // wait for transition ends
    await page.waitFor(1000)

    const transformText = await page.$eval('.wheel-scroll', node => {
      return window.getComputedStyle(node).transform
    })
    const translateY = getTranslate(transformText!, 'y')
    await expect(translateY).toBeLessThan(-72)
  })
})
