import { Page } from 'puppeteer'
import extendTouch from '../../util/extendTouch'
import getTranslate from '../../util/getTranslate'

jest.setTimeout(10000000)

describe('Movable with multi content', () => {
  let page = (global as any).page as Page
  extendTouch(page)

  beforeAll(async () => {
    await page.goto('http://0.0.0.0:8932/#/movable/multi-content')
  })

  beforeEach(async () => {
    await page.reload({
      waitUntil: 'domcontentloaded'
    })
  })

  it('should work well', async () => {
    await page.waitFor(300)
    const transformText1 = await page.$eval('.content1', node => {
      return window.getComputedStyle(node).transform
    })
    const x1 = getTranslate(transformText1, 'x')
    const y1 = getTranslate(transformText1, 'y')

    expect(x1).toBe(10)
    expect(y1).toBe(10)

    const transformText2 = await page.$eval('.content2', node => {
      return window.getComputedStyle(node).transform
    })
    const x2 = getTranslate(transformText2, 'x')
    const y2 = getTranslate(transformText2, 'y')

    expect(x2).toBe(0)
    expect(y2).toBe(170)
  })

  it('should work well when call putAt()', async () => {
    await page.waitFor(300)

    await page.click('.btn')

    await page.waitFor(1000)
    const transformText2 = await page.$eval('.content2', node => {
      return window.getComputedStyle(node).transform
    })
    const x2 = getTranslate(transformText2, 'x')
    const y2 = getTranslate(transformText2, 'y')

    expect(x2).toBe(67.5)
    expect(y2).toBe(107.5)
  })
})
