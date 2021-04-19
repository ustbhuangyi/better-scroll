import { Page } from 'puppeteer'
import extendTouch from '../../util/extendTouch'
import getTranslate from '../../util/getTranslate'

jest.setTimeout(10000000)

describe('Slider for banner', () => {
  let page = (global as any).page as Page
  extendTouch(page)
  beforeAll(async () => {
    await page.goto('http://0.0.0.0:8932/#/slide/banner')
  })

  beforeEach(async () => {
    await page.reload({
      waitUntil: 'domcontentloaded',
    })
  })

  it('should loop by default', async () => {
    await page.waitFor(300)

    // wait for slide autoplay
    await page.waitFor(4000)

    const transformText = await page.$eval('.slide-banner-content', (node) => {
      return window.getComputedStyle(node).transform
    })
    const x = getTranslate(transformText, 'x')

    expect(x).toBe(-670)
  })

  it('should go nextPage when click nextPage button', async () => {
    await page.waitFor(300)

    // simulate click
    await page.click('.next')

    // wait for bs to do a transition
    await page.waitFor(1500)

    const transformText = await page.$eval('.slide-banner-content', (node) => {
      return window.getComputedStyle(node).transform
    })
    const x = getTranslate(transformText, 'x')

    expect(x).toBe(-670)
  })

  it('should go prevPage when click prevPage button', async () => {
    await page.waitFor(300)

    await page.click('.next')
    // wairt for bs to do a transition
    await page.waitFor(1500)

    const transformText1 = await page.$eval('.slide-banner-content', (node) => {
      return window.getComputedStyle(node).transform
    })
    const x1 = getTranslate(transformText1, 'x')

    expect(x1).toBe(-670)

    // simulate click
    await page.click('.prev')
    await page.waitFor(1500)

    const transformText2 = await page.$eval('.slide-banner-content', (node) => {
      return window.getComputedStyle(node).transform
    })
    const x2 = getTranslate(transformText2, 'x')

    expect(x2).toBe(-335)
  })
  it('should change index when drag slide', async () => {
    await page.waitFor(300)
    const currentIndex = await page.$eval('.dots-wrapper', (el) => {
      const children = el.children
      let index = 0
      for (let i = 0; i < children.length; i++) {
        if (children[i].className.indexOf('active') > -1) {
          index = i
          break
        }
      }
      return index + 1
    })
    const nextDotsIndex = currentIndex === 3 ? 0 : currentIndex + 1
    await page.dispatchScroll({
      x: 200,
      y: 120,
      xDistance: -150,
      yDistance: 0,
      gestureSourceType: 'touch',
    })
    const secondDots = await page.$eval(
      `.dots-wrapper .dot:nth-child(${nextDotsIndex})`,
      (el) => el.className
    )
    expect(secondDots).toContain('active')
  })
})
