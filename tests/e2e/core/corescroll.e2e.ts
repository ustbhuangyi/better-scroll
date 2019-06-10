import { Page } from 'puppeteer'
import extendTouch from '../../util/extendTouch'
import extendMouseWheel from '../../util/extendMouseWheel'

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
      element => element.length
    )
    const itemsContent = await page.$$eval('.core .example-item', element =>
      element.map(el => el.textContent)
    )

    expect(itemsContent).toEqual([
      'vertical',
      'horizontal',
      'freescroll',
      'driven by Mouse wheel'
    ])
    await expect(itemsCounts).toBeGreaterThanOrEqual(4)
  })

  it("should display correct items's texts", async () => {
    const itemsContent = await page.$$eval('.core .example-item', element =>
      element.map(el => el.textContent)
    )

    await expect(itemsContent).toEqual([
      'vertical',
      'horizontal',
      'freescroll',
      'driven by Mouse wheel'
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
      await expect(content).toBeTruthy()
    })

    it('should trigger eventListener when click wrapper DOM', async () => {
      let mockHandler = jest.fn()
      page.once('dialog', async dialog => {
        mockHandler()
        await dialog.dismiss()
      })

      // wait for router transition ends
      await page.waitFor(1000)
      await page.touchscreen.tap(100, 100)

      await expect(mockHandler).toHaveBeenCalled()
    })

    it('should scroll when dispatch touch', async () => {
      await page.waitFor(1000)
      const SwiperHandler = jest.fn()
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
          ],
          [
            {
              x: 100,
              y: 130
            }
          ],
          [
            {
              x: 100,
              y: 120
            }
          ],
          [
            {
              x: 100,
              y: 110
            }
          ]
        ],
        () => {
          SwiperHandler()
        },
        30
      )

      const content = await page.$('.scroll-content')
      await page.waitFor(1000)
      const boundingBox = await content!.boundingBox()
      await expect(SwiperHandler).toHaveBeenCalled()
      await expect(boundingBox!.y).toBeLessThan(0)
    })

    it('should dispatch scroll event', async () => {
      let mockHandler = jest.fn()
      page.once('console', async message => {
        mockHandler()
      })
      await page.waitFor(1000)
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
          ],
          [
            {
              x: 100,
              y: 130
            }
          ],
          [
            {
              x: 100,
              y: 120
            }
          ],
          [
            {
              x: 100,
              y: 110
            }
          ]
        ],
        () => {},
        30
      )
      await page.waitFor(1000)
      await expect(mockHandler).toBeCalled()
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
      await expect(container).toBeTruthy()
    })

    it('should scroll to right when finger moves from right to left', async () => {
      await page.waitFor(1000)
      await page.dispatchSwipe(
        [
          [
            {
              x: 100,
              y: 120
            }
          ],
          [
            {
              x: 90,
              y: 120
            }
          ],
          [
            {
              x: 80,
              y: 120
            }
          ],
          [
            {
              x: 75,
              y: 120
            }
          ],
          [
            {
              x: 70,
              y: 120
            }
          ]
        ],
        () => {},
        30
      )

      const content = await page.$('.scroll-content')
      await page.waitFor(1000)
      const boundingBox = await content!.boundingBox()
      await expect(boundingBox!.x).toBeLessThan(0)
    })
  })

  describe('CoreScroll/freescroll', () => {
    beforeAll(async () => {
      await page.goto('http://0.0.0.0:8932/#/core/freescroll')
    })

    it('should scroll correctly when oblique scrolling occurred', async () => {
      await page.waitFor(1000)
      await page.dispatchSwipe(
        [
          [
            {
              x: 100,
              y: 100
            }
          ],
          [
            {
              x: 90,
              y: 90
            }
          ],
          [
            {
              x: 80,
              y: 80
            }
          ],
          [
            {
              x: 75,
              y: 75
            }
          ],
          [
            {
              x: 70,
              y: 70
            }
          ]
        ],
        () => {},
        30
      )

      const content = await page.$('.scroll-content')
      await page.waitFor(1000)
      const boundingBox = await content!.boundingBox()
      await expect(boundingBox!.x).toBeLessThan(0)
      await expect(boundingBox!.y).toBeLessThan(0)
    })
  })

  describe('CoreScroll/driven by MouseWheel', () => {
    beforeAll(async () => {
      extendMouseWheel(page)
      // emulate pc scene
      await page.emulate({
        viewport: {
          isMobile: false,
          width: 375,
          height: 667
        },
        // tslint:disable-next-line: max-line-length
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.80 Safari/537.36'
      })
      await page.goto('http://0.0.0.0:8932/#/core/mouse-wheel')
    })

    it.only('should scroll correctly when using MouseWheel to scroll', async () => {
      await page.waitFor(1000)

      await page.dispatchMouseWheel({
        type: 'mouseWheel',
        x: 100,
        y: 100,
        deltaX: 0,
        deltaY: 50
      })

      const content = await page.$('.wheel-scroll')
      await page.waitFor(1000)
      const boundingBox = await content!.boundingBox()
      await expect(boundingBox!.y).toBeLessThan(0)
    })
  })
})
