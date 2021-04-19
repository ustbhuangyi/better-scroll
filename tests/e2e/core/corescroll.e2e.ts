import { Page } from 'puppeteer'
import extendTouch from '../../util/extendTouch'
import getTranslate from '../../util/getTranslate'

// set default timeout
jest.setTimeout(1000000)

describe('CoreScroll', () => {
  let page = (global as any).page as Page
  extendTouch(page)
  beforeAll(async () => {
    await page.goto('http://0.0.0.0:8932/#/core/')
  })

  it('should display 4 items at least', async () => {
    const itemsCounts = await page.$$eval(
      '.core .example-item',
      (element) => element.length
    )
    const itemsContent = await page.$$eval('.core .example-item', (element) =>
      element.map((el) => el.textContent)
    )

    expect(itemsContent).toEqual([
      'vertical',
      'horizontal',
      'dynamic-content',
      'specified-content',
      'freescroll',
      'vertical rotated(v2.3.0)',
      'horizontal rotated(v2.3.0)',
    ])
    expect(itemsCounts).toBeGreaterThanOrEqual(5)
  })

  it("should display correct items's texts", async () => {
    const itemsContent = await page.$$eval('.core .example-item', (element) =>
      element.map((el) => el.textContent)
    )

    expect(itemsContent).toEqual([
      'vertical',
      'horizontal',
      'dynamic-content',
      'specified-content',
      'freescroll',
      'vertical rotated(v2.3.0)',
      'horizontal rotated(v2.3.0)',
    ])
  })

  describe('CoreScroll/vertical', () => {
    beforeAll(async () => {
      await page.goto('http://0.0.0.0:8932/#/core/default')
    })

    it('should render corrent DOM', async () => {
      const wrapper = await page.$('.scroll-wrapper')
      const content = await page.$('.scroll-content')

      expect(wrapper).toBeTruthy()
      expect(content).toBeTruthy()
    })

    it('should trigger eventListener when click wrapper DOM', async () => {
      let mockHandler = jest.fn()
      page.once('dialog', async (dialog) => {
        mockHandler()
        await dialog.dismiss()
      })

      // wait for router transition ends
      await page.waitFor(1000)
      await page.touchscreen.tap(100, 100)

      expect(mockHandler).toHaveBeenCalled()
    })

    it('should scroll when dispatch touch', async () => {
      await page.waitFor(1000)

      await page.dispatchScroll({
        x: 100,
        y: 150,
        xDistance: 0,
        yDistance: -70,
        gestureSourceType: 'touch',
      })

      await page.waitFor(1000)

      const transformText = await page.$eval('.scroll-content', (node) => {
        return window.getComputedStyle(node).transform
      })
      const y = getTranslate(transformText, 'y')

      expect(y).toBeLessThan(0)
    })

    it('should dispatch scroll event', async () => {
      let mockHandler = jest.fn()
      page.once('console', async (message) => {
        mockHandler()
      })
      await page.waitFor(1000)
      await page.dispatchScroll({
        x: 100,
        y: 150,
        xDistance: 0,
        yDistance: -70,
        gestureSourceType: 'touch',
      })
      await page.waitFor(1000)
      expect(mockHandler).toBeCalled()
    })
  })

  describe('CoreScroll/horizontal', () => {
    beforeAll(async () => {
      await page.goto('http://0.0.0.0:8932/#/core/horizontal')
    })

    it('should render corrent DOM', async () => {
      const wrapper = await page.$('.scroll-wrapper')
      const container = await page.$('.horizontal-container')

      expect(wrapper).toBeTruthy()
      expect(container).toBeTruthy()
    })

    it('should scroll to right when finger moves from right to left', async () => {
      await page.waitFor(1000)
      await page.dispatchScroll({
        x: 100,
        y: 120,
        xDistance: -70,
        yDistance: 0,
        gestureSourceType: 'touch',
      })

      await page.waitFor(1000)

      const transformText = await page.$eval('.scroll-content', (node) => {
        return window.getComputedStyle(node).transform
      })
      const x = getTranslate(transformText, 'x')

      expect(x).toBeLessThan(0)
    })
  })

  describe('CoreScroll/freescroll', () => {
    beforeAll(async () => {
      await page.goto('http://0.0.0.0:8932/#/core/freescroll')
    })

    it('should scroll correctly when oblique scrolling occurred', async () => {
      await page.waitFor(1000)
      await page.dispatchScroll({
        x: 100,
        y: 100,
        xDistance: -70,
        yDistance: -70,
        gestureSourceType: 'touch',
      })

      await page.waitFor(1000)

      const transformText = await page.$eval('.scroll-content', (node) => {
        return window.getComputedStyle(node).transform
      })
      const y = getTranslate(transformText, 'y')
      const x = getTranslate(transformText, 'x')

      expect(x).toBeLessThan(0)
      expect(y).toBeLessThan(0)
    })
  })

  describe('CoreScroll/dynamicContent', () => {
    beforeAll(async () => {
      await page.goto('http://0.0.0.0:8932/#/core/dynamic-content')
    })

    it('should support switching content dynamically', async () => {
      await page.waitFor(1000)
      await page.dispatchScroll({
        x: 100,
        y: 100,
        xDistance: 0,
        yDistance: -70,
        gestureSourceType: 'touch',
      })

      await page.waitFor(50)

      await page.click('.btn')

      await page.waitFor(100)

      const itemsCounts = await page.$$eval(
        '.scroll-content .scroll-item',
        (element) => element.length
      )

      expect(itemsCounts).toBe(60)
    })
  })

  describe('CoreScroll/verticalRotated', () => {
    beforeAll(async () => {
      await page.goto('http://0.0.0.0:8932/#/core/vertical-rotated')
    })

    it('should support vertical rotated scroll', async () => {
      await page.waitFor(1000)
      await page.dispatchScroll({
        x: 210,
        y: 180,
        xDistance: 70,
        yDistance: 0,
        gestureSourceType: 'touch',
      })

      await page.waitFor(100)

      const transformText = await page.$eval('.scroll-content', (node) => {
        return window.getComputedStyle(node).transform
      })

      const y = getTranslate(transformText, 'y')
      expect(y).toBeLessThan(-20)
    })
  })

  describe('CoreScroll/horizontalRotated', () => {
    beforeAll(async () => {
      await page.goto('http://0.0.0.0:8932/#/core/horizontal-rotated')
    })

    it('should support horizontal rotated scroll', async () => {
      await page.waitFor(1000)
      await page.dispatchScroll({
        x: 180,
        y: 100,
        xDistance: 70,
        yDistance: 0,
        gestureSourceType: 'touch',
      })

      await page.waitFor(100)

      const transformText = await page.$eval('.scroll-content', (node) => {
        return window.getComputedStyle(node).transform
      })

      const x = getTranslate(transformText, 'x')
      expect(x).toBeLessThan(-20)
    })
  })
})
