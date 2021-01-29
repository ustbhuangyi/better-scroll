<template>
  <div class="mousewheel-scrollbar-container">
    <div ref="wrapper" class="custom-scrollbar-wrapper">
      <div class="custom-scrollbar-content">
        <img @load="onload" :src="girlImageLink" alt="">
      </div>
      <!-- custom-horizontal-scrollbar-->
      <div class="custom-horizontal-scrollbar" ref="horizontal">
        <div class="custom-horizontal-indicator"></div>
      </div>
    </div>
    <div class="tip">please use your mouse-wheel</div>
  </div>
</template>

<script>
  import BScroll from '@better-scroll/core'
  import ScrollBar from '@better-scroll/scroll-bar'
  import MouseWheel from '@better-scroll/mouse-wheel'
  import girlImage from './sad-girl.jpg'

  BScroll.use(ScrollBar)
  BScroll.use(MouseWheel)

  export default {
    data () {
      return {
        girlImageLink : girlImage
      }
    },
    methods: {
      initBscroll() {
        this.scroll = new BScroll(this.$refs.wrapper, {
          scrollX: true,
          scrollY: false,
          click: true,
          mouseWheel: true,
          scrollbar: {
            customElements: [this.$refs.horizontal],
            fade: true,
            interactive: true,
            scrollbarTrackClickable: true
          }
        })
      },
      onload () {
        this.initBscroll()
      }
    }
  }
</script>

<style lang="stylus" scoped>
.mousewheel-scrollbar-container
  .custom-scrollbar-wrapper
    position relative
    width 280px
    height 280px
    overflow hidden
  .custom-scrollbar-content
    display inline-block
    height 280px
    > img
      max-width none
  .custom-horizontal-scrollbar
    position absolute
    left 50%
    bottom 10px
    width 100px
    height 7px
    border-radius 6px
    transform translateX(-50%) translateZ(0)
    background-color rgb(200, 200, 200, 0.3)
  .custom-horizontal-indicator
    height 100%
    width 20px
    border-radius 6px
    background-color #db8090
  .tip
    text-align center
    margin-top 10px
</style>
