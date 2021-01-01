<template>
  <div class="dynamic-slide-banner">
    <div class="banner-wrapper">
      <div class="slide-banner-wrapper" ref="slide">
        <div class="slide-banner-content">
          <div v-for="num in nums" class="slide-page" :class="'page' + num" :key="num">page {{num}}</div>
        </div>
      </div>
      <div class="dots-wrapper">
        <span
          class="dot"
          v-for="num in nums"
          :key="num"
          :class="{'active': currentPageIndex === (num - 1)}"></span>
      </div>
    </div>
    <div class="btn-wrap">
      <button @click="increase" class="increase">increase</button>
      <button @click="decrease" class="decrease">decrease</button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from '@better-scroll/core'
  import Slide from '@better-scroll/slide'

  BScroll.use(Slide)

  export default {
    data() {
      return {
        nums: 1,
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
      increase() {
        this.nums += 1
        this.$nextTick(() => {
          this.slide.refresh()
        })
      },
      decrease() {
        this.nums -= 1
        this.nums = Math.max(1, this.nums) // at least one page
        this.$nextTick(() => {
          this.slide.refresh()
        })
      },
      init() {
        window.slide = this.slide = new BScroll(this.$refs.slide, {
          scrollX: true,
          scrollY: false,
          slide: {
            autoplay: false,
            loop: true
          },
          momentum: false,
          bounce: false,
          probeType: 3
        })
        this.slide.on('scrollEnd', this._onScrollEnd)

        this.slide.on('slideWillChange', (page) => {
          console.log('【slideWillChange】CurrentPage =>', page)
          this.currentPageIndex = page.pageX
        })

        // v2.1.0
        this.slide.on('slidePageChanged', (page) => {
          console.log('【slidePageChanged】CurrentPage =>', page)
        })
      },
      _onScrollEnd () {
        console.log('【scrollEnd】CurrentPage =>', this.slide.getCurrentPage())
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
.dynamic-slide-banner
  .banner-wrapper
    position relative
  .slide-banner-wrapper
    min-height 1px
    overflow hidden
  .slide-banner-content
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
      &.page5
        background-color #E71D36
      &.page6
        background-color #2EC4B6
      &.page7
        background-color #EFFFE9
      &.page8
        background-color #011627
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
