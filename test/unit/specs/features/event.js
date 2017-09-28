import BScroll from 'scroll/index'

describe('BScroll - events', () => {
  it('once then off', () => {
    const wrapper = document.createElement('div')
    const scroller = document.createElement('div')
    wrapper.appendChild(scroller)
    const scroll = new BScroll(wrapper, {
      tap: true,
      click: true,
      disableMouse: false
    })
    let test = function () {
      return 'test once'
    }
    scroll.once('test', test)
    expect(scroll._events['test'][0][0].fn)
      .to.be.equal(test)
    scroll.off('test', test)
    expect(scroll._events['test'][0][0])
      .to.not.be.ok
  })
})
