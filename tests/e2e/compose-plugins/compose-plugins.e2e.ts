import { Page } from 'puppeteer'
import extendsTouch from '../../util/extendTouch'
import getTranslate from '../../util/getTranslate'

jest.setTimeout(1000000)

describe('compose plugins', () => {
  let page = (global as any).page as Page
  extendsTouch(page)
  beforeAll(async () => {
    await page.goto('http://0.0.0.0:8932/#/compose/')
  })
  it('should display 4 items at least', async () => {
    const itemsCounts = await page.$$eval(
      '.compose .example-item',
      (elements) => elements.length
    )
    const itemsContent = await page.$$eval(
      '.compose .example-item',
      (elements) => {
        return elements.map((el) => el.textContent)
      }
    )
    expect(itemsContent).toEqual([
      'pullup-pulldown',
      'pullup-pulldown-slide',
      'pullup-pulldown-outnested',
      'slide-nested',
    ])
    await expect(itemsCounts).toBeGreaterThanOrEqual(4)
  })
})
