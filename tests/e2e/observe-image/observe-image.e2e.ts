import { Page } from 'puppeteer'
import extendTouch from '../../util/extendTouch'
import getTranslate from '../../util/getTranslate'

jest.setTimeout(10000000)

describe('ObserveImage', () => {
  let page = (global as any).page as Page
  extendTouch(page)
  beforeEach(async () => {
    await page.goto('http://0.0.0.0:8932/#/observe-image/')
  })

  it('should autorefresh when img loaded', async () => {
    await page.waitFor(3000)

    await page.dispatchScroll({
      x: 100,
      y: 120,
      xDistance: 0,
      yDistance: -50,
      gestureSourceType: 'touch',
    })

    const transformText = await page.$eval('.scroll-content', (node) => {
      return window.getComputedStyle(node).transform
    })
    const y = getTranslate(transformText, 'y')

    expect(y).toBeLessThan(-30)
  })
})
