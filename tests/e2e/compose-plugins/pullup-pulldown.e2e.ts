import { Page } from 'puppeteer'
import extendsTouch from '../../util/extendTouch'

jest.setTimeout(1000000)

describe('compose/pullup-pulldown', () => {
  let page = (global as any).page as Page
  extendsTouch(page)
  beforeAll(async () => {
    await page.goto('http://0.0.0.0:8932/#/compose/pullup-pulldown')
  })
  it('should render DOM correctly', async () => {
    await page.waitFor(300)

    const itemsCounts = await page.$$eval(
      '.pullup-down-list-item',
      (element) => element.length
    )

    await expect(itemsCounts).toBeGreaterThanOrEqual(30)
  })

  it('should trigger pullingdown when BS reached the top', async () => {
    await page.waitFor(1000)

    await page.dispatchScroll({
      x: 100,
      y: 150,
      xDistance: 0,
      yDistance: 300,
      gestureSourceType: 'touch',
    })
    const { isShowPullDownTxt, isShowLoading } = await page.$$eval(
      '.pulldown-wrapper',
      (elements) => {
        const isShowPullDownTxt =
          window.getComputedStyle(elements[0].children[0]).display === 'block'
        const isShowLoading =
          window.getComputedStyle(elements[0].children[1].children[0])
            .display === 'block'
        return {
          isShowPullDownTxt,
          isShowLoading,
        }
      }
    )
    expect(isShowPullDownTxt).toEqual(false)
    expect(isShowLoading).toEqual(true)
    await page.waitFor(1000)
  })

  it('should trigger pullingup when BS reached the bottom', async () => {
    await page.waitFor(300)

    await page.dispatchScroll({
      x: 200,
      y: 630,
      xDistance: 0,
      yDistance: -500,
      speed: 1500,
      gestureSourceType: 'touch',
    })
    await page.waitFor(4000)
    const itemsCounts = await page.$$eval(
      '.pullup-down-list-item',
      (element) => element.length
    )
    await expect(itemsCounts).toBeGreaterThanOrEqual(60)
  })
})
