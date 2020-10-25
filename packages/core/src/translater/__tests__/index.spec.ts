import Translater from '../index'

describe('Translater Class test suit', () => {
  let translater: Translater
  let contentEl = document.createElement('div')

  beforeEach(() => {
    translater = new Translater(contentEl)
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('work well when call translate()', () => {
    const mockFn1 = jest.fn()
    const mockFn2 = jest.fn()
    translater.hooks.on(translater.hooks.eventTypes.beforeTranslate, mockFn1)
    translater.hooks.on(translater.hooks.eventTypes.translate, mockFn2)

    translater.translate({ x: 0, y: 0, dummy: 0 })

    expect(mockFn1).toBeCalled()
    expect(mockFn1).toBeCalledWith(['translateX(0px)', 'translateY(0px)'], {
      x: 0,
      y: 0,
      dummy: 0,
    })
    expect(mockFn2).toBeCalled()
    expect(mockFn2).toBeCalledWith({ x: 0, y: 0, dummy: 0 })
    expect(translater.content.style.transform).toBe(
      'translateX(0px) translateY(0px)'
    )
  })

  it('get correct position when call getComputedPosition()', () => {
    // jsDOM library's getComputedStyle is different from browser
    window.getComputedStyle = jest.fn().mockImplementation(() => {
      return {
        transform: 'matrix(1, 0, 0, 1, 0, 0)',
      }
    })
    const { x, y } = translater.getComputedPosition()

    expect(x).toBe(0)
    expect(y).toBe(0)
  })

  it('should clear hooks when destroyed', () => {
    translater.hooks.on(translater.hooks.eventTypes.beforeTranslate, () => {})

    expect(translater.hooks.eventTypes.beforeTranslate).toBe('beforeTranslate')

    translater.destroy()

    expect(translater.hooks.eventTypes.beforeTranslate).toBeFalsy()
  })
})
