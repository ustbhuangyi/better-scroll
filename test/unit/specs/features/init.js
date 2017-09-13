import BScroll from 'scroll/index'

describe('BScroll - init', () => {
  it('init', () => {
    const wrapper = document.createElement('div')
    const scroller = document.createElement('div')
    wrapper.appendChild(scroller)
    const scroll = new BScroll(wrapper, {
      tap: true,
      click: true,
      disableMouse: false
    })
    expect(scroll.options.scrollX)
      .to.be.false
    expect(scroll.options.scrollY)
      .to.be.true
    expect(scroll.options.tap)
      .to.equal('tap')
    expect(scroll.options.swipeBounceTime)
      .to.equal(500)
    expect(scroll.wrapperWidth)
      .to.equal(0)
    scroll.disable()
    expect(scroll.enabled)
      .to.be.false
    scroll.enable()
    expect(scroll.enabled)
      .to.be.true
  })
})
