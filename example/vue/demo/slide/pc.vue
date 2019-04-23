<template>
  <div class="slide-banner">
    <div class="banner-wrapper">
      <div class="slide-banner-scroll" ref="slide">
        <div class="slide-banner-wrapper">
          <div class="slide-item page1">page 1</div>
          <div class="slide-item page2">page 2</div>
          <div class="slide-item page3">page 3</div>
          <div class="slide-item page4">page 4</div>
        </div>
      </div>
      <div class="docs-wrapper">
        <span
          class="doc"
          v-for="(item, index) in 4"
          :key="index"
          :class="{'active': currentPageIndex === index}"></span>
      </div>
    </div>
    <div class="btn-wrap">
      <button @click="nextPage">nextPage</button>
      <button @click="prePage">prePage</button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from '../../../../src/index.ts'
  import SlidePlugin from '../../../../src/plugins/slide'
  import MouseWheel from '../../../../src/plugins/mouse-wheel'
  BScroll.use(SlidePlugin)
  BScroll.use(MouseWheel)

  export default {
    data() {
      return {
        slide: null,
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
      nextPage() {
        this.slide.next()
      },
      prePage() {
        this.slide.prev()
      },
      _onScrollEnd() {
        let pageIndex = this.slide.getCurrentPage().pageX
        this.currentPageIndex = pageIndex
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
.slide-banner
  .banner-wrapper
    position relative
  .slide-banner-scroll
    min-height 1px
    overflow hidden
  .slide-banner-wrapper
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
  .docs-wrapper
    position absolute
    bottom 4px
    left 50%
    transform translateX(-50%)
    .doc
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
