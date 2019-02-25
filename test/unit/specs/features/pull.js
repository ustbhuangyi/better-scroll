import BScroll from 'scroll/index'
import { dispatchTouchStart, dispatchTouchMove, dispatchTouchEnd } from '../../utils/event'

describe('BScroll - pull', () => {
  let scroll
  let scroller
  let scrollOptions = {
    bindToWrapper: true,
    probeType: 3,
    pullDownRefresh: {
      threshold: 90,
      stop: 30
    },
    pullUpLoad: {
      threshold: 0,
      txt: 'There is no more data'
    }
  }
  beforeEach(() => {
    const wrapper = document.createElement('div')
    const list = document.createElement('ul')
    scroller = document.createElement('div')
    scroller.appendChild(list)
    wrapper.appendChild(scroller)
    document.body.appendChild(wrapper)
    wrapper.style.height = '500px'
    wrapper.style.overflow = 'hidden'
    // wrapper.style.position = 'relative'
    let listHTML = ''
    list.style.margin = '0'
    for (let i = 0; i < 100; i++) {
      listHTML += `<li>${i}</li>`
    }
    list.innerHTML = listHTML
    scroll = new BScroll(wrapper, scrollOptions)
  })
  it('pulldown event', () => {
    const pullingDownHandler = sinon.spy()
    scroll.on('pullingDown', pullingDownHandler)
    const wrapper = scroll.wrapper
    dispatchTouchStart(wrapper, {
      pageX: 50,
      pageY: 50
    })
    dispatchTouchMove(wrapper, {
      pageX: 50,
      pageY: 400
    })
    dispatchTouchEnd(wrapper, {
      pageX: 50,
      pageY: 400
    })
    expect(pullingDownHandler)
      .to.be.calledOnce
  })
  it('pulling down and reset', (done) => {
    scroll.on('pullingDown', () => {
      setTimeout(() => {
        scroll.finishPullDown()
        console.log('222', scroll.relativeY)
        expect(scroll.y)
          .to.equal(0)
        done()
      }, 500)
    })
    const wrapper = scroll.wrapper
    dispatchTouchStart(wrapper, {
      pageX: 50,
      pageY: 50
    })
    dispatchTouchMove(wrapper, {
      pageX: 50,
      pageY: 400
    })
    dispatchTouchEnd(wrapper, {
      pageX: 50,
      pageY: 400
    })
  })
  it('pullup event', () => {
    const pullingUpHandler = sinon.spy()
    scroll.on('pullingUp', () => {
      pullingUpHandler()
      setTimeout(() => {
        scroll.finishPullUp()
      }, 500)
    })
    const wrapper = scroll.wrapper
    dispatchTouchStart(wrapper, {
      pageX: 50,
      pageY: 100
    })
    dispatchTouchMove(wrapper, {
      pageX: 50,
      pageY: -2300
    })
    dispatchTouchEnd(wrapper, {
      pageX: 50,
      pageY: -2300
    })
    dispatchTouchStart(wrapper, {
      pageX: 50,
      pageY: -2300
    })
    dispatchTouchMove(wrapper, {
      pageX: 50,
      pageY: -2500
    })
    dispatchTouchStart(wrapper, {
      pageX: 50,
      pageY: -2800
    })
    expect(pullingUpHandler)
      .to.be.calledOnce
  })
  afterEach(() => {
    if (scroll) {
      document.body.removeChild(scroll.wrapper)
      scroll.destroy()
    }
  })
})
