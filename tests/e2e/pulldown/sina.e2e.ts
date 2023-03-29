import { Page } from 'puppeteer'
import extendTouch from '../../util/extendTouch'

jest.setTimeout(10000000)

const chunk = <T>(array: T[], size: number) => {
  let index = 0
  let resIndex = 0
  const length = array.length
  const result = new Array(Math.ceil(length / size))

  while (index < length) {
    result[resIndex++] = array.slice(index, (index += size))
  }
  return result
}

describe('Pulldown-sina-weibo', () => {
  let page = (global as any).page as Page
  extendTouch(page)
  beforeEach(async () => {
    // disable cache
    await page.setCacheEnabled(false)
    await page.goto('http://0.0.0.0:8932/#/pulldown/sina')
  })

  it('should render DOM correctly', async () => {
    await page.waitFor(300)

    const itemsCounts = await page.$$eval(
      '.pulldown-list-item',
      (element) => element.length
    )

    await expect(itemsCounts).toBeGreaterThanOrEqual(20)
  })

  it('should go through correct phase', async () => {
    await page.waitFor(300)

    await page.dispatchTouch({
      type: 'touchStart',
      touchPoints: [
        {
          x: 200,
          y: 40,
        },
      ],
    })
    const touchMovePoints = (() => {
      const start = 70
      const step = 5
      const end = 550
      const x = 200
      let ret: Array<{ x: number; y: number }> = []
      for (let i = start; i <= end; i += step) {
        ret.push({
          x,
          y: i,
        })
      }
      // chrome only allow 16 items in touchPoints array
      return chunk(ret, 16)
    })()
    // touchmove
    for (const touchPoint of touchMovePoints) {
      await page.dispatchTouch({
        type: 'touchMove',
        touchPoints: touchPoint,
      })
    }

    const textContent = await page.$$eval(
      '.pulldown-wrapper',
      (element) => element[0].textContent
    )
    expect(textContent).toContain('Release')

    await page.dispatchTouch({
      type: 'touchEnd',
      touchPoints: [
        {
          x: 200,
          y: 560,
        },
      ],
    })

    await page.waitFor(300)
    // loading
    const textContent2 = await page.$$eval(
      '.pulldown-wrapper',
      (element) => element[0].textContent
    )
    expect(textContent2).toContain('Loading...')

    await page.waitFor(3000)

    // refresh succeed
    const textContent3 = await page.$$eval(
      '.pulldown-wrapper',
      (element) => element[0].textContent
    )
    expect(textContent3).toContain('Refresh succeed')
    const itemsCounts = await page.$$eval(
      '.pulldown-list-item',
      (element) => element.length
    )
    // has loaded
    expect(itemsCounts).toBeGreaterThanOrEqual(40)
  })
})
