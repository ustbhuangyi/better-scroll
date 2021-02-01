<template>
  <div class="custom-scrollbar-container">
    <div ref="wrapper" class="custom-scrollbar-wrapper">
      <img @load="onload" class="custom-scrollbar-content" :src="girlImageLink" alt="">
      <!-- custom-vertical-scrollbar-->
      <div class="custom-vertical-scrollbar" ref="vertical">
        <div class="custom-vertical-indicator"></div>
      </div>
      <!-- custom-horizontal-scrollbar-->
      <div class="custom-horizontal-scrollbar" ref="horizontal">
        <div class="custom-horizontal-indicator"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import BScroll from '@better-scroll/core'
  import ScrollBar from '@better-scroll/scroll-bar'
  import girlImage from './girl.jpg'

  BScroll.use(ScrollBar)

  export default {
    data () {
      return {
        girlImageLink : girlImage
      }
    },
    methods: {
      initBscroll() {
        this.scroll = new BScroll(this.$refs.wrapper, {
          freeScroll: true,
          click: true,
          scrollbar: {
            customElements: [this.$refs.horizontal, this.$refs.vertical],
            fade: false,
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
.custom-scrollbar-container
  .custom-scrollbar-wrapper
    position relative
    width 280px
    height 280px
    overflow hidden
  .custom-scrollbar-content
    max-width none
  .custom-vertical-scrollbar
    position absolute
    top 50%
    right 10px
    height 100px
    width 7px
    border-radius 6px
    transform translateY(-50%) translateZ(0)
    background-color rgb(200, 200, 200, 0.3)
  .custom-vertical-indicator
    width 100%
    height 20px
    border-radius 6px
    background-color #db8090
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
</style>
