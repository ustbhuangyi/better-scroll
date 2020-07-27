import BScroll, { createBScroll } from 'better-scroll'

const a = new BScroll('', {
  zoom: {
    start: 1,
    max: 1,
    min: 1
  }
})

const b = new BScroll('', {})

const c = createBScroll('', {
  pullDownRefresh: true
  // zoom: {
  //   start: 1,
  //   max: 1,
  //   min: 1
  // }
})
c

const d = createBScroll('', {
  // pullUpLoad: true,
  pullDownRefresh: true
})
d.zoomTo
const e = createBScroll('', {
  movable: true,
  slide: {}
})
e.openPullDown
