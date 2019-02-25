import BScroll from 'scroll/index'

describe('BScroll - events', () => {
  let wrapper, scroller, scroll

  before(() => {
    wrapper = document.createElement('div')
    scroller = document.createElement('div')
    wrapper.appendChild(scroller)
    scroll = new BScroll(wrapper, {
      tap: true,
      click: true,
      disableMouse: false
    })
  })

  // TODO: use mock to detect event function
  it('once then off', () => {
    let test = function () {
      return 'test once'
    }
    scroll.once('test', test)
    expect(scroll._events['test'][0][0].fn)
      .to.be.equal(test)
    scroll.off('test', test)
    expect(scroll._events['test'][0])
      .to.not.be.ok
  })

  it('remove the correct callback', () => {
    let test1 = function() {}
    let test2 = function() {}

    scroll.on('test2', test1)
    scroll.on('test2', test2)

    const cbList = scroll._events['test2']

    expect(cbList.length)
      .to.be.equal(2)
    expect(cbList[0][0])
      .to.be.equal(test1)

    scroll.off('test2', test1)

    expect(cbList.length)
      .to.be.equal(1)
    expect(cbList[0][0])
      .to.be.equal(test2)
  })
})
