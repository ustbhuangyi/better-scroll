import { Page } from 'puppeteer'
import extendsTouch from '../../util/extendTouch'
import getTranslate from '../../util/getTranslate'

jest.setTimeout(1000000)

describe('Compose/pullup-pulldown-slide', () => {
  let page = (global as any).page as Page
  extendsTouch(page)
  beforeAll(async () => {
    await page.goto('http://0.0.0.0:8932/#/compose/pullup-pulldown-slide')
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
  it('should switch next page when BS scroll half page', async () => {
    await page.waitFor(1000)

    await page.dispatchScroll({
      x: 100,
      y: 200,
      xDistance: 0,
      yDistance: -50,
      gestureSourceType: 'touch',
    })
    await page.waitFor(1000)

    const transformText = await page.$eval(
      '.pullup-pulldown-slide-scroller',
      (node) => {
        return window.getComputedStyle(node).transform
      }
    )
    const y = getTranslate(transformText, 'y')

    expect(y).toBe(-770)
  })
  it('should trigger pullingup when BS reached the bottom', async () => {
    await page.waitFor(1000)

    for (let i = 0; i < 9; i++) {
      await page.dispatchScroll({
        x: 100,
        y: 200,
        xDistance: 0,
        yDistance: -50,
        gestureSourceType: 'touch',
      })
      await page.waitFor(1000)
    }

    await page.dispatchScroll({
      x: 100,
      y: 200,
      xDistance: 0,
      yDistance: -20,
      gestureSourceType: 'touch',
    })

    await page.waitFor(2000)
    const itemsCounts = await page.$$eval(
      '.pullup-pulldown-slide-item',
      (element) => element.length
    )
    await expect(itemsCounts).toBeGreaterThanOrEqual(20)
  })
})
