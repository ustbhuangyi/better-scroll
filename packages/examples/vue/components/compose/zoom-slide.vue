<template>
  <div class="slide-banner">
    <div class="banner-wrapper">
      <div
        class="slide-banner-wrapper"
        ref="slide"
      >
        <div class="slide-banner-content">
          <div class="slide-item page1">page 1</div>
          <div class="slide-item page2">page 2</div>
          <div class="slide-item page3">page 3</div>
          <div class="slide-item page4">page 4</div>
        </div>
      </div>
      <div class="dots-wrapper">
        <span
          :class="{'active': currentPageIndex === index}"
          :key="index"
          class="dot"
          v-for="(item, index) in 4"
        ></span>
      </div>
    </div>
    <div class="btn-wrap">
      <button
        @click="nextPage"
        class="next"
      >nextPage</button>
      <button
        @click="prePage"
        class="prev"
      >prePage</button>
    </div>
    <div class="btn-wrap">
      <button
        @click="zoomTo(0.5)"
        class="zoom-half"
      >zoomTo:0.5</button>
      <button
        @click="zoomTo(1)"
        class="zoom-original"
      >zoomTo:1</button>
      <button
        @click="zoomTo(2)"
        class="zoom-double"
      >zoomTo:2</button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
import Zoom from '@better-scroll/zoom'

BScroll.use(Slide)
BScroll.use(Zoom)

export default {
  data() {
    return {
      currentPageIndex: 0,
      playTimer: 0
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    clearTimeout(this.playTimer)
    this.slide.destroy()
  },
  methods: {
    init() {
      clearTimeout(this.playTimer)
      this.slide = new BScroll(this.$refs.slide, {
        scrollX: true,
        scrollY: false,
        slide: {},
        zoom: {},
        // zoom: {
        //   start: 1.5,
        //   min: 0.5,
        //   max: 3,
        //   initialOrigin: ['center', 'center']
        // },
        useTransition: true,
        momentum: false,
        bounce: false,
        stopPropagation: true,
        probeType: 2
      })
      this.slide.on('scrollEnd', this._onScrollEnd)

      // user touches the slide area
      this.slide.on('beforeScrollStart', () => {
        clearTimeout(this.playTimer)
      })
      // user touched the slide done
      this.slide.on('scrollEnd', () => {
        this.autoGoNext()
      })
      this.slide.on('slideWillChange', page => {
        this.currentPageIndex = page.pageX
      })
      // this.zoom.on('zooming', ({ scale }) => {
      //   this.linkworkTransform = `scale(${scale})`
      // })

      // this.zoom.on('zoomEnd', ({ scale }) => {
      //   console.log(scale)
      // })
      this.autoGoNext()
    },
    nextPage() {
      this.slide.next()
    },
    prePage() {
      this.slide.prev()
    },
    _onScrollEnd() {
      this.autoGoNext()
    },
    zoomTo(value) {
      this.slide.zoomTo(value, 'center', 'center')
    },
    autoGoNext() {
      clearTimeout(this.playTimer)
      this.playTimer = setTimeout(() => {
        this.nextPage()
      }, 4000)
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
.slide-banner
  .banner-wrapper
    position relative

  .slide-banner-wrapper
    min-height 1px
    overflow hidden

  .slide-banner-content
    height 200px
    white-space nowrap
    font-size 0

    .slide-item
      display inline-block
      height 200px
      width 100%
      line-height 200px
      text-align center
      font-size 26px

      &.page1
        background-color #95B8D1

      &.page2
        background-color #DDA789

      &.page3
        background-color #C3D899

      &.page4
        background-color #F2D4A7

  .dots-wrapper
    position absolute
    bottom 4px
    left 50%
    transform translateX(-50%)

    .dot
      display inline-block
      margin 0 4px
      width 8px
      height 8px
      border-radius 50%
      background #eee

      &.active
        width 20px
        border-radius 5px

  .btn-wrap
    margin-top 20px
    display flex
    justify-content center

    button
      margin 0 10px
      padding 10px
      color #fff
      border-radius 4px
      background-color #666
</style>
