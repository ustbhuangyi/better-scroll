<template>
  <div class="slide-vertical">
    <div class="vertical-wrapper">
      <div class="slide-vertical-scroll" ref="slide">
        <div class="slide-group" ref="slideGroup">
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
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from '../../../../src/index.ts'
  import SlidePlugin from '../../../../src/plugins/slide'

  BScroll.use(SlidePlugin)

  export default {
    data() {
      return {
        slide: null,
        playTimer: 0,
        currentPageIndex: 0
      }
    },
    mounted() {
      this._setSlideHeight()
      this.init()
    },
    beforeDestroy() {
      this.slide.destroy()
    },
    methods: {
      init() {
        clearTimeout(this.playTimer)
        this.slide = new BScroll(this.$refs.slide, {
          scrollX: false,
          scrollY: true,
          slide: {
            loop: true,
            threshold: 50
          },
          momentum: false,
          bounce: false,
          stopPropagation: true
        })
        this.slide.on('scrollEnd', this._onScrollEnd)
      },
      _onScrollEnd() {
        let pageIndex = this.slide.getCurrentPage().pageY
        this.currentPageIndex = pageIndex
      },
      _setSlideHeight() {
        const children = this.$refs.slideGroup.children
        let height = 0
        let slideHeight = this.$refs.slide.clientHeight
        for (let i = 0; i < children.length; i++) {
          let child = children[i]
          child.style.height = slideHeight + 'px'
          height += slideHeight
        }
        height += 2 * slideHeight
        this.$refs.slideGroup.style.height = height + 'px'
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
.slide-vertical
  height 100%
  &.view
    padding 0
    height 100%
  .vertical-wrapper
    position relative
    height 100%
    font-size 0
  .slide-vertical-scroll
    height 100%
    overflow hidden
    .slide-item
      display inline-block
      height 100%
      width 100%
      line-height 200px
      text-align center
      font-size 26px
      &.page1
        background-color #D6EADF
      &.page2
        background-color #DDA789
      &.page3
        background-color #C3D899
      &.page4
        background-color #F2D4A7
  .docs-wrapper
    position absolute
    right 4px
    top 50%
    transform translateY(-50%)
    .doc
      display block
      margin 4px 0
      width 8px
      height 8px
      border-radius 50%
      background #eee
      &.active
        height  20px
        border-radius 5px

</style>
