import BScroll from 'scroll/index'
// import { dispatchTouchStart, dispatchTouchMove, dispatchSwipe } from '../../utils/event'

describe('BScroll - snap', () => {
  let scroll
  let slideWrapper
  beforeEach(() => {
    let style = document.createElement('style')
    style.type = 'text/css'
    const styleSheet = `
      .full-page-slide-wrapper {
        position: fixed;
        z-index: 20;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgb(239, 239, 244);
        overflow: hidden;
      }

      .slide {
        height: 100%;
      }

      .slide-group {
        height: 100%;
        position: relative;
        overflow: hidden;
        white-space: nowrap;
      }

      .slide-item {
        height: 100%;
        box-sizing: border-box;
        overflow: hidden;
        text-align: center;
        float: left;
      }

      .slide-item:first-child {
        background: #fc9153;
      }
      .slide-item:nth-child(2) {
        background: yellowgreen;
      }
      .slide-item:nth-child(3) {
        background: #333;
      }
    `
    style.appendChild(document.createTextNode(styleSheet))
    document.head.appendChild(style)

    slideWrapper = document.createElement('div')
    slideWrapper.className = 'full-page-slide-wrapper'
    slideWrapper.innerHTML = `
      <div class="slide">
        <div class="slide-group">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    `
    document.body.appendChild(slideWrapper)

    const slideEle = document.querySelector('.slide')
    const slideGroup = document.querySelector('.slide-group')

    let loop = false

    function setSlideWidth(isResize) {
      let children = slideGroup.children

      let width = 0
      let slideWidth = slideEle.clientWidth
      for (let i = 0; i < children.length; i++) {
        let child = children[i]
        child.classList.add('slide-item')

        child.style.width = slideWidth + 'px'
        width += slideWidth
      }
      if (loop && !isResize) {
        width += 2 * slideWidth
      }
      slideGroup.style.width = width + 'px'
    }

    setSlideWidth(false)

    scroll = new BScroll(slideEle, {
      scrollX: true,
      momentum: false,
      snap: {
        loop: false,
        threshold: 0.3,
        speed: 400
      },
      startX: 0,
      click: true
    })
  })
  afterEach(() => {
    if (slideWrapper) {
      document.body.removeChild(slideWrapper)
      scroll.destroy()
    }
  })
  it('next', (done) => {
    setTimeout(() => {
      scroll.next()
      expect(scroll.currentPage.pageX)
        .to.equal(1)
      scroll.next()
      expect(scroll.currentPage.pageX)
        .to.equal(2)
      expect(scroll.currentPage.pageX)
        .to.equal(2)
      done()
    }, 0)
  })
  it('prev', (done) => {
    setTimeout(() => {
      scroll.next()
      expect(scroll.currentPage.pageX)
        .to.equal(1)
      scroll.next()
      expect(scroll.currentPage.pageX)
        .to.equal(2)
      scroll.prev()
      expect(scroll.currentPage.pageX)
        .to.equal(1)
      scroll.prev()
      expect(scroll.currentPage.pageX)
        .to.equal(0)
      done()
    }, 0)
  })
  it('goToPage', (done) => {
    setTimeout(() => {
      scroll.goToPage(1, 0)
      expect(scroll.currentPage.pageX)
        .to.equal(1)
      scroll.prev()
      scroll.goToPage(2, 0)
      expect(scroll.currentPage.pageX)
        .to.equal(2)
      scroll.pages = undefined
      scroll.goToPage(1, 0)
      expect(scroll.currentPage.pageX)
        .to.equal(2)
      scroll.pages = []
      scroll.goToPage(1, 0)
      expect(scroll.currentPage.pageX)
        .to.equal(2)
      done()
    }, 0)
  })
  it('getCurrentPage', (done) => {
    setTimeout(() => {
      let curPage = scroll.getCurrentPage()
      expect(curPage.pageX)
        .to.equal(0)
      scroll.next()
      curPage = scroll.getCurrentPage()
      expect(curPage.pageX)
        .to.equal(1)
      done()
    })
  })
})
