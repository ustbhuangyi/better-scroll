import { Page } from 'puppeteer'
import devices from 'puppeteer/DeviceDescriptors'

// await ((global as any).jestPuppeteer).debug()

// set default timeout
jest.setTimeout(1000000)

describe('CoreScroll', () => {
  let page = (global as any).page as Page
  beforeAll(async () => {
    const iPhone = devices['iPhone 6']
    await page.emulate(iPhone)
    await page.goto('http://0.0.0.0:8932//#/core/')
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
      await page.goto('http://0.0.0.0:8932//#/core/default')
    })

    it('should render corrent DOM', async () => {
      const wrapper = await page.$('.scroll-wrapper')
      const content = await page.$('.scroll-content')

      expect(wrapper).toBeTruthy()
      await expect(content).toBeTruthy()
    })

    it('should trigger eventListener when click wrapper DOM', async () => {
      let mockHandler = jest.fn()
      page.on('dialog', async dialog => {
        mockHandler()
        await dialog.dismiss()
      })

      // wait for transition ends
      await page.waitFor(1000)
      await page.touchscreen.tap(100, 100)

      await expect(mockHandler).toHaveBeenCalled()
    })
  })
})
