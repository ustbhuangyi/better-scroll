import BScroll, { createBScroll } from 'better-scroll'

const a = new BScroll('', {
  zoom: false
})

const b = new BScroll('', {})

const c = createBScroll('', {
  pullDownRefresh: true,
  wheel: true
  // zoom: {
  //   start: 1,
  //   max: 1,
  //   min: 1
  // }
})

const d = createBScroll('', {
  // pullUpLoad: true,
})
d.zoomTo
const e = createBScroll('', {
  movable: true,
  slide: {}
})
e.openPullDown
