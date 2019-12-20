import BScroll from '../index'

describe('BetterScroll Core', () => {
  let bscroll: BScroll
  let div = document.createElement('div')

  beforeEach(() => {
    bscroll = new BScroll(div, {})
  })
  afterEach(() => {
    BScroll.plugins = []
    BScroll.pluginsMap = {}
  })

  it('should use plugins successfully when call use()', () => {
    const plugin = class MyPlugin {
      static pluginName = 'myPlugin'
    }
    BScroll.use(plugin)

    expect(BScroll.plugins.length).toBe(1)
  })

  it('should init plugins when set top-level of BScroll options', () => {
    let mockFn = jest.fn()
    const plugin = class MyPlugin {
      static pluginName = 'myPlugin'
      constructor(bscroll: BScroll) {
        mockFn(bscroll)
      }
    }
    BScroll.use(plugin)
    let wrapper = document.createElement('div')
    wrapper.appendChild(document.createElement('p'))

    let bs = new BScroll(wrapper, {
      myPlugin: true
    })
    expect(mockFn).toBeCalledWith(bs)
  })

  it('should throw error when wrapper is not a ElementNode or wrapper has no children ', () => {
    let spy = jest.spyOn(console, 'error')
    let bs = new BScroll('.div', {})
    let bs2 = new BScroll(document.createElement('div'), {})

    expect(spy).toHaveBeenCalled()
    expect(spy).toBeCalledTimes(2)

    spy.mockRestore()
  })
})
