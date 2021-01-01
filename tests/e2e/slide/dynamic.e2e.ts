import { Page } from 'puppeteer'
import extendTouch from '../../util/extendTouch'
import getTranslate from '../../util/getTranslate'

jest.setTimeout(10000000)

describe('Slider for fullpage', () => {
  let page = (global as any).page as Page
  extendTouch(page)
  beforeAll(async () => {
    await page.goto('http://0.0.0.0:8932/#/slide/dynamic')
  })

  beforeEach(async () => {
    await page.reload({
      waitUntil: 'domcontentloaded',
    })
  })

  it('increase', async () => {
    await page.waitFor(300)

    await page.click('.increase')

    await page.waitFor(200)

    const slidePageLen = await page.$$eval(
      '.slide-page',
      (element) => element.length
    )
    const slidePageTexts = await page.$$eval('.slide-page', (node) =>
      node.map((n) => n.textContent)
    )

    expect(slidePageLen).toBe(4)
    expect(slidePageTexts).toMatchObject([
      'page 2',
      'page 1',
      'page 2',
      'page 1',
    ])
  })

  it('decrease', async () => {
    await page.waitFor(300)

    await page.click('.increase')

    await page.waitFor(200)

    await page.click('.decrease')

    await page.waitFor(200)

    const slidePageLen = await page.$$eval(
      '.slide-page',
      (element) => element.length
    )
    const slidePageTexts = await page.$$eval('.slide-page', (node) =>
      node.map((n) => n.textContent)
    )

    expect(slidePageLen).toBe(1)
    expect(slidePageTexts).toMatchObject(['page 1'])
  })

  it('scroll ', async () => {
    await page.waitFor(300)

    await page.click('.increase')

    await page.waitFor(200)

    await page.dispatchScroll({
      x: 200,
      y: 150,
      xDistance: -150,
      yDistance: 0,
      gestureSourceType: 'touch',
    })

    await page.waitFor(500)

    const transformText = await page.$eval('.slide-banner-content', (node) => {
      return window.getComputedStyle(node).transform
    })
    const x = getTranslate(transformText, 'x')

    expect(x).toBe(-670)

    await page.click('.increase')

    await page.waitFor(200)

    const transformText2 = await page.$eval('.slide-banner-content', (node) => {
      return window.getComputedStyle(node).transform
    })
    const x2 = getTranslate(transformText2, 'x')

    expect(x2).toBe(-670)

    await page.dispatchScroll({
      x: 200,
      y: 150,
      xDistance: -150,
      yDistance: 0,
      gestureSourceType: 'touch',
    })

    await page.waitFor(500)

    const transformText3 = await page.$eval('.slide-banner-content', (node) => {
      return window.getComputedStyle(node).transform
    })
    const x3 = getTranslate(transformText3, 'x')

    expect(x3).toBe(-1005)

    await page.click('.decrease')

    await page.waitFor(200)

    const transformText4 = await page.$eval('.slide-banner-content', (node) => {
      return window.getComputedStyle(node).transform
    })
    const x4 = getTranslate(transformText4, 'x')

    expect(x4).toBe(-670)

    await page.click('.decrease')

    await page.waitFor(200)

    const transformText5 = await page.$eval('.slide-banner-content', (node) => {
      return window.getComputedStyle(node).transform
    })
    const x5 = getTranslate(transformText5, 'x')

    expect(x5).toBe(0)
  })
})
