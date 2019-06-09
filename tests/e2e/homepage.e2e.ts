import { Page } from 'puppeteer'

jest.setTimeout(10000000)

describe('Homepage', () => {
  let page = (global as any).page as Page
  beforeAll(async () => {
    await page.goto('http://0.0.0.0:8932/')
  })

  it('should display "BetterScroll" text on homepage', async () => {
    await expect(page).toMatch('BetterScroll')
  })

  it('should display seven items at least', async () => {
    const itemsCounts = await page.$$eval(
      '.example-item',
      element => element.length
    )
    await expect(itemsCounts).toBeGreaterThanOrEqual(7)
  })
})
