import { Page } from 'puppeteer'
import extendTouch from '../../util/extendTouch'

jest.setTimeout(10000000)

describe('Slider for banner', () => {
  let page = (global as any).page as Page
  extendTouch(page)
  beforeEach(async () => {
    await page.goto('http://0.0.0.0:8932/#/slide/banner')
  })

  it('should loop by default', async () => {
    await page.waitFor(300)
    const content = await page.$('.slide-banner-wrapper')
    await page.waitFor(5000)
    const boundingBox = await content!.boundingBox()
    await expect(boundingBox!.x).toBeLessThan(-600)
  })

  it('should go nextPage when click nextPage button', async () => {
    await page.waitFor(300)
    const content = await page.$('.slide-banner-wrapper')

    const oldBoundingBox = await content!.boundingBox()
    const oldX = oldBoundingBox!.x
    // simulate click
    await page.click('.next')

    // wairt for bs to do a transition
    await page.waitFor(1500)

    const curBoundingBox = await content!.boundingBox()
    const currentX = curBoundingBox!.x
    await expect(currentX - oldX).toBeLessThan(0)
  })

  it('should go prevPage when click prevPage button', async () => {
    await page.waitFor(300)
    const content = await page.$('.slide-banner-wrapper')

    const oldBoundingBox = await content!.boundingBox()
    const oldX = oldBoundingBox!.x
    // simulate click
    await page.click('.prev')

    // wairt for bs to do a transition
    await page.waitFor(1500)

    const curBoundingBox = await content!.boundingBox()
    const currentX = curBoundingBox!.x
    await expect(currentX - oldX).toBeGreaterThan(0)
  })
  it('should change index when drap slide', async () => {
    await page.waitFor(300)
    const currentIndex = await page.$eval('.docs-wrapper', el => {
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
    const nextDocsIndex = currentIndex === 3 ? 0 : currentIndex + 1
    await page.dispatchSwipe(
      [
        [
          {
            x: 200,
            y: 120
          }
        ],
        [
          {
            x: 150,
            y: 120
          }
        ],
        [
          {
            x: 100,
            y: 120
          }
        ],
        [
          {
            x: 50,
            y: 120
          }
        ]
      ],
      () => {},
      30
    )
    const secondDots = await page.$eval(
      `.docs-wrapper .doc:nth-child(${nextDocsIndex})`,
      el => el.className
    )
    expect(secondDots).toContain('active')
  })
})
