import { Page } from 'puppeteer'
import extendsTouch from '../../util/extendTouch'
import getTranslate from '../../util/getTranslate'

jest.setTimeout(1000000)

describe('Compose/pullup-pulldown-nested', () => {
  let page = (global as any).page as Page
  extendsTouch(page)
  beforeAll(async () => {
    await page.goto('http://0.0.0.0:8932/#/compose/pullup-pulldown-outnested')
  })

  it('should trigger outer scroll pullingdown when BS reached the top', async () => {
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
  })

  it('should trigger outer scroll pullingup when BS reached the bottom', async () => {
    await page.waitFor(1000)

    await page.dispatchScroll({
      x: 200,
      y: 300,
      xDistance: 0,
      yDistance: -500,
      speed: 1500,
      gestureSourceType: 'touch',
    })

    await page.waitFor(4000)
    const itemsCounts = await page.$$eval(
      '.outer-list-item2',
      (element) => element.length
    )
    await expect(itemsCounts).toBeGreaterThanOrEqual(16)
  })

  it('the inner scroll should scroll normally', async () => {
    await page.waitFor(1000)

    await page.dispatchScroll({
      x: 200,
      y: 200,
      xDistance: 0,
      yDistance: -500,
      speed: 1500,
      gestureSourceType: 'touch',
    })
    await page.waitFor(1000)

    const transformText = await page.$eval('.inner-content', (node) => {
      return window.getComputedStyle(node).transform
    })
    const y = getTranslate(transformText, 'y')

    expect(y).toBe(-814)
  })
})
