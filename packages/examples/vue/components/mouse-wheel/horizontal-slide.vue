<template>
  <div class="mouse-wheel-horizontal-slide">
    <div class="slide-container">
      <div class="slide-wrapper" ref="slide">
        <div class="slide-content">
          <div class="slide-page page1">page 1</div>
          <div class="slide-page page2">page 2</div>
          <div class="slide-page page3">page 3</div>
          <div class="slide-page page4">page 4</div>
        </div>
      </div>
      <div class="dots-wrapper">
        <span
          class="dot"
          v-for="(item, index) in 4"
          :key="index"
          :class="{'active': currentPageIndex === index}"></span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from '@better-scroll/core'
  import Slide from '@better-scroll/slide'
  import MouseWheel from '@better-scroll/mouse-wheel'

  BScroll.use(Slide)
  BScroll.use(MouseWheel)

  export default {
    data() {
      return {
        currentPageIndex: 0
      }
    },
    mounted() {
      this.init()
    },
    beforeDestroy() {
      this.slide.destroy()
    },
    methods: {
      init() {
        this.slide = new BScroll(this.$refs.slide, {
          scrollX: true,
          scrollY: false,
          slide: {
            loop: true,
            threshold: 100
          },
          useTransition: false,
          momentum: false,
          bounce: false,
          stopPropagation: true,
          mouseWheel: {
            speed: 2,
            invert: false,
            easeTime: 300
          }
        })
        this.slide.on('scrollEnd', this._onScrollEnd)
      },
      _onScrollEnd() {
        let pageIndex = this.slide.getCurrentPage().pageX
        this.currentPageIndex = pageIndex
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">

.mouse-wheel-horizontal-slide
  .slide-container
    position relative
  .slide-wrapper
    min-height 1px
    overflow hidden
  .slide-content
    height 200px
    white-space nowrap
    font-size 0
    .slide-page
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

</style>
