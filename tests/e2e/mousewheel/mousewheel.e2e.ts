import { Page } from 'puppeteer'
import extendMouseWheel from '../../util/extendMouseWheel'
import getTranslate from '../../util/getTranslate'

jest.setTimeout(1000000)

describe('MouseWheel plugin', () => {
  let page = (global as any).page as Page
  extendMouseWheel(page)

  beforeAll(async () => {
    // emulate pc scene
    await page.emulate({
      viewport: {
        isMobile: false,
        width: 375,
        height: 667,
      },
      // tslint:disable-next-line: max-line-length
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.80 Safari/537.36',
    })
  })

  describe('MouseWheel & Core', () => {
    it('should scroll correctly in vertical direction when integrating with CoreScroll', async () => {
      await page.goto('http://0.0.0.0:8932/#/mouse-wheel/vertical-scroll')

      await page.waitFor(300)

      await page.dispatchMouseWheel({
        type: 'mouseWheel',
        x: 100,
        y: 100,
        deltaX: 0,
        deltaY: 50,
      })

      await page.waitFor(1000)

      const transformText = await page.$eval('.mouse-wheel-content', (node) => {
        return window.getComputedStyle(node).transform
      })

      const y = getTranslate(transformText, 'y')
      await expect(y).toBeLessThan(0)
    })

    it('should scroll correctly in horizontal direction when integrating with CoreScroll', async () => {
      await page.goto('http://0.0.0.0:8932/#/mouse-wheel/horizontal-scroll')

      await page.waitFor(300)

      await page.dispatchMouseWheel({
        type: 'mouseWheel',
        x: 130,
        y: 130,
        deltaX: 0,
        deltaY: 100,
      })

      await page.waitFor(1000)
      const transformText = await page.$eval('.mouse-wheel-content', (node) => {
        return window.getComputedStyle(node).transform
      })

      const x = getTranslate(transformText, 'x')
      await expect(x).toBeLessThan(0)
    })
  })

  describe('MouseWheel & Slide', () => {
    it('should scroll correctly in vertical direction when integrating with Slide', async () => {
      await page.goto('http://0.0.0.0:8932/#/mouse-wheel/vertical-slide')

      await page.waitFor(300)

      await page.dispatchMouseWheel({
        type: 'mouseWheel',
        x: 100,
        y: 100,
        deltaX: 0,
        deltaY: 200,
      })

      await page.waitFor(3000)

      const transformText = await page.$eval('.slide-content', (node) => {
        return window.getComputedStyle(node).transform
      })

      const y = getTranslate(transformText, 'y')
      await expect(y).toBeLessThan(-667)
    })

    it('should scroll correctly in horizontal direction when integrating with Slide', async () => {
      await page.goto('http://0.0.0.0:8932/#/mouse-wheel/horizontal-slide')

      await page.waitFor(300)

      await page.dispatchMouseWheel({
        type: 'mouseWheel',
        x: 130,
        y: 130,
        deltaX: 0,
        deltaY: 200,
      })

      await page.waitFor(3000)
      const transformText = await page.$eval('.slide-content', (node) => {
        return window.getComputedStyle(node).transform
      })

      const x = getTranslate(transformText, 'x')
      await expect(x).toBe(-660)
    })
  })

  describe('MouseWheel & PullUp', () => {
    it('should scroll correctly when integrating with PullUp', async () => {
      await page.goto('http://0.0.0.0:8932/#/mouse-wheel/pullup')

      await page.waitFor(300)

      await page.dispatchMouseWheel({
        type: 'mouseWheel',
        x: 100,
        y: 100,
        deltaX: 0,
        deltaY: 10000,
      })

      await page.waitFor(3000)

      const transformText = await page.$eval('.pullup-content', (node) => {
        return window.getComputedStyle(node).transform
      })

      const y = getTranslate(transformText, 'y')
      expect(y).toBeLessThan(0)

      // wait for loading data
      await page.waitFor(2000)

      const itemsCounts = await page.$$eval(
        '.pullup-list-item',
        (element) => element.length
      )

      await expect(itemsCounts).toBeGreaterThanOrEqual(30)
    })
  })

  describe('MouseWheel & PullDown', () => {
    it('should scroll correctly when integrating with PullDown', async () => {
      await page.goto('http://0.0.0.0:8932/#/mouse-wheel/pulldown')

      await page.waitFor(300)

      await page.dispatchMouseWheel({
        type: 'mouseWheel',
        x: 100,
        y: 100,
        deltaX: 0,
        deltaY: -1000,
      })

      // wait for loading data
      await page.waitFor(2000)

      const itemsCounts = await page.$$eval(
        '.pulldown-list-item',
        (element) => element.length
      )

      await expect(itemsCounts).toBeGreaterThanOrEqual(30)
    })
  })

  describe('MouseWheel & Wheel', () => {
    it('should scroll correctly when integrating with Wheel', async () => {
      await page.goto('http://0.0.0.0:8932/#/mouse-wheel/picker')

      await page.waitFor(300)

      await page.click('.open')

      await page.waitFor(500)

      await page.dispatchMouseWheel({
        type: 'mouseWheel',
        x: 200,
        y: 630,
        deltaX: 0,
        deltaY: 100,
      })

      await page.waitFor(1000)

      const transformText = await page.$eval('.wheel-scroll', (node) => {
        return window.getComputedStyle(node).transform
      })

      const y = getTranslate(transformText, 'y')
      expect(y).toBeLessThan(-30)
    })
  })
})
