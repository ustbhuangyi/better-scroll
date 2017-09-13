import BScroll from 'scroll/index'
import { dispatchTouchStart, dispatchTouchMove, dispatchSwipe } from '../../utils/event'

describe('BScroll - core scroll', () => {
  let scroll
  let scrollOptions = {
    bindToWrapper: true,
    probeType: 3
  }
  beforeEach(() => {
    const wrapper = document.createElement('div')
    const scroller = document.createElement('div')
    const list = document.createElement('ul')
    scroller.appendChild(list)
    wrapper.appendChild(scroller)
    document.body.appendChild(wrapper)
    wrapper.style.height = '500px'
    wrapper.style.overflow = 'hidden'
    let listHTML = ''
    for (let i = 0; i < 100; i++) {
      listHTML += `<li>${i}</li>`
    }
    list.innerHTML = listHTML
    scroll = new BScroll(wrapper, scrollOptions)
  })
  afterEach(() => {
    if (scroll) {
      document.body.removeChild(scroll.wrapper)
      scroll.destroy()
    }
  })
  it('start', () => {
    const wrapper = scroll.wrapper
    const startHandler = sinon.spy()
    scroll.on('beforeScrollStart', startHandler)
    dispatchTouchStart(wrapper, {
      pageX: 100,
      pageY: 50
    })
    expect(startHandler)
      .to.be.calledOnce
    expect(scroll.pointX)
      .to.equal(100)
    expect(scroll.pointY)
      .to.equal(50)
  })
  it('move', () => {
    const wrapper = scroll.wrapper
    const startHandler = sinon.spy()
    const scrollHandler = sinon.spy()
    scroll.on('scrollStart', startHandler)
    scroll.on('scroll', scrollHandler)
    dispatchTouchStart(wrapper, {
      pageX: 100,
      pageY: 100
    })
    dispatchTouchMove(wrapper, {
      pageX: 100,
      pageY: 50
    })
    expect(startHandler)
      .to.be.calledOnce
    expect(scrollHandler)
      .to.be.calledOnce
  })
  it('end', (done) => {
    const wrapper = scroll.wrapper
    const endHandler = sinon.spy()
    scroll.on('touchEnd', endHandler)
    scroll.on('scrollEnd', () => {
      expect(scroll.y)
        .to.be.closeTo(-210, 20)
      done()
    })
    dispatchSwipe(wrapper, [
      {
        pageX: 100,
        pageY: 100
      },
      {
        pageX: 100,
        pageY: 80
      }
    ], 100, () => {
      expect(endHandler)
        .to.be.calledOnce
    })
    expect(scroll.x)
      .to.equal(0)
    expect(scroll.y)
      .to.equal(0)
  })
})
