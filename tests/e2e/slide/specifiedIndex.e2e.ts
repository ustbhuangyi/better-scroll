import { Page } from 'puppeteer'
import extendTouch from '../../util/extendTouch'
import getTranslate from '../../util/getTranslate'

jest.setTimeout(10000000)

describe('Slider for specified index', () => {
  let page = (global as any).page as Page
  extendTouch(page)
  beforeAll(async () => {
    await page.goto('http://0.0.0.0:8932/#/slide/specified')
  })

  beforeEach(async () => {
    await page.reload({
      waitUntil: 'domcontentloaded',
    })
  })

  it('should work well when initialised', async () => {
    await page.waitFor(300)

    const textContext = await page.$eval('.description', (node) => {
      return node.textContent
    })
    expect(textContext).toBe('currentPageIndex is 2')
  })

  it('should go nextPage when click nextPage button', async () => {
    await page.waitFor(300)

    // simulate click
    await page.click('.next')

    // wait for bs to do a transition
    await page.waitFor(1500)

    const textContext = await page.$eval('.description', (node) => {
      return node.textContent
    })

    expect(textContext).toBe('currentPageIndex is 3')
  })

  it('should go prevPage when click prevPage button', async () => {
    await page.waitFor(300)

    await page.click('.prev')

    // wait for bs to do a transition
    await page.waitFor(1500)

    const textContext = await page.$eval('.description', (node) => {
      return node.textContent
    })

    expect(textContext).toBe('currentPageIndex is 1')
  })
  it('should change index when drap slide', async () => {
    await page.waitFor(300)

    await page.dispatchScroll({
      x: 200,
      y: 120,
      xDistance: -150,
      yDistance: 0,
      gestureSourceType: 'touch',
    })
    // wait for bs to do a transition
    await page.waitFor(1500)

    const textContext = await page.$eval('.description', (node) => {
      return node.textContent
    })

    expect(textContext).toBe('currentPageIndex is 3')
  })
})
