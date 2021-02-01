import BScroll from '../index'

describe('BetterScroll Core', () => {
  let bscroll: BScroll
  let wrapper = document.createElement('div')
  let content = document.createElement('p')
  wrapper.appendChild(content)
  beforeEach(() => {
    bscroll = new BScroll(wrapper, {})
  })
  afterEach(() => {
    BScroll.plugins = []
    BScroll.pluginsMap = {}
  })

  it('use()', () => {
    const plugin = class MyPlugin {
      static pluginName = 'myPlugin'
    }
    BScroll.use(plugin)
    // has installed
    BScroll.use(plugin)

    expect(BScroll.plugins.length).toBe(1)

    // Plugin should specify pluginName
    const spyFn = jest.spyOn(console, 'error')
    const unnamedPlugin = class UnnamedPlugin {}
    BScroll.use(unnamedPlugin as any)
    expect(spyFn).toBeCalled()
    spyFn.mockRestore()
  })

  it('should init plugins when set top-level of BScroll options', () => {
    let mockFn = jest.fn()
    const plugin = class MyPlugin {
      static pluginName = 'myPlugin2'
      constructor(bscroll: BScroll) {
        mockFn(bscroll)
      }
    }
    BScroll.use(plugin)
    let wrapper = document.createElement('div')
    wrapper.appendChild(document.createElement('p'))

    let bs = new BScroll(wrapper, {
      myPlugin2: true
    })
    expect(mockFn).toBeCalledWith(bs)
  })

  it('should throw error when wrapper is not a ElementNode or wrapper has no children ', () => {
    let spy = jest.spyOn(console, 'error')
    let bs = new BScroll('.div', {})
    let bs2 = new BScroll(document.createElement('div'), {})

    expect(spy).toHaveBeenCalled()
    expect(spy).toBeCalledTimes(2)
  })

  it('disable()', () => {
    const mockFn = jest.fn()
    bscroll.on(bscroll.eventTypes.disable, mockFn)
    bscroll.hooks.on(bscroll.hooks.eventTypes.disable, mockFn)
    bscroll.disable()

    expect(mockFn).toBeCalledTimes(2)
  })

  it('destroy()', () => {
    const mockFn = jest.fn()
    bscroll.on(bscroll.eventTypes.destroy, mockFn)
    bscroll.hooks.on(bscroll.hooks.eventTypes.destroy, mockFn)
    bscroll.destroy()

    expect(mockFn).toBeCalledTimes(2)
  })

  it('eventRegister()', () => {
    bscroll.eventRegister(['dummy'])
    expect(bscroll.eventTypes.dummy).toBeTruthy()
  })

  it('should refresh when window resized', () => {
    const mockFn = jest.fn()
    bscroll.on(bscroll.eventTypes.refresh, mockFn)
    bscroll.scroller.hooks.trigger(bscroll.scroller.hooks.eventTypes.resize)
    expect(mockFn).toBeCalledTimes(1)
  })

  it('plugin wanna control scroll position ', () => {
    const mockFn = jest.fn().mockImplementation(() => true)
    class DummyPlugin {
      static pluginName = 'dummy'
      constructor(scroll: BScroll) {
        scroll.hooks.on(scroll.hooks.eventTypes.beforeInitialScrollTo, mockFn)
      }
    }
    BScroll.use(DummyPlugin)
    bscroll = new BScroll(wrapper, { dummy: true })
    expect(mockFn).toBeCalled()
  })

  it('should trigger contentChanged hook when content DOM has changed', () => {
    const mockFn = jest.fn()
    bscroll.on(bscroll.eventTypes.contentChanged, mockFn)

    // content DOM has
    wrapper.removeChild(content)
    wrapper.appendChild(document.createElement('div'))
    bscroll.refresh()
    expect(mockFn).toBeCalled()
  })
})
