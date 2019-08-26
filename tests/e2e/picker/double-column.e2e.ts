import { Page } from 'puppeteer'
import extendTouch from '../../util/extendTouch'
import getTranslate from '../../util/getTranslate'

jest.setTimeout(10000000)

describe('Double column picker', () => {
  let page = (global as any).page as Page
  extendTouch(page)
  beforeAll(async () => {
    await page.goto('http://0.0.0.0:8932/#/picker/double-column')
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

    await expect(innerText).toBe('Venomancer-Durable')
  })

  it('should scroll correctly when simulate touch event on each column', async () => {
    await page.waitFor(300)

    await page.click('.open')

    await page.waitFor(1000)

    // first column
    await page.dispatchScroll({
      x: 100,
      y: 630,
      xDistance: 0,
      yDistance: -70,
      gestureSourceType: 'touch'
    })

    // second column
    await page.dispatchScroll({
      x: 270,
      y: 630,
      xDistance: 0,
      yDistance: -70,
      gestureSourceType: 'touch'
    })

    // wait for transition ends
    await page.waitFor(1000)

    const transformTexts = await page.$$eval('.wheel-scroll', nodes => {
      return nodes.map(node => window.getComputedStyle(node).transform)
    })

    for (const transformText of transformTexts) {
      const translateY = getTranslate(transformText!, 'y')
      await expect(translateY).toBeLessThan(-72)
    }
  })
})
