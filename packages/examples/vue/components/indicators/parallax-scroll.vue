<template>
  <div class="parallax-scroll-container">
    <div class="parallax-scroll-box">
      <div class="scroll-wrapper" ref="wrapper">
        <div class="scroll-content" />
      </div>
      <div class="scroll-indicator stars1" ref="indicator1">
        <div class="star1-bg"></div>
      </div>
      <div class="scroll-indicator stars2" ref="indicator2">
        <div class="star2-bg"></div>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core'
import Indicators from '@better-scroll/indicators'

BScroll.use(Indicators)

export default {
  mounted () {
    this.initScroll()
  },
  methods: {
    initScroll () {
      this.scroll = new BScroll(this.$refs.wrapper, {
        freeScroll: true,
        bounce: false,
        indicators: [
          {
            relationElement: this.$refs.indicator1,
            interactive: false,
            ratio: 0.4
          },
          {
            relationElement: this.$refs.indicator2,
            interactive: false,
            ratio: 0.2
          }
        ]
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.parallax-scroll-container
  height 100%
  .parallax-scroll-box
    position relative
    width 100%
    height 100%
    box-sizing border-box
    border 1px solid #fe0
  .scroll-wrapper
    position absolute
    z-index 3
    top 0
    right 0
    bottom 0
    left 0
    overflow hidden
  .scroll-content
    width 100%
    height 4000px
    background: url('./galaxies1.png')
  .scroll-indicator
    position absolute
    top 0
    right 0
    bottom 0
    left 0
    overflow hidden
    &.stars1
      z-index 2
    &.stars2
      z-index 1
  .star1-bg
    height 3000px
    background: url('./galaxies2.png')
  .star2-bg
    height 2000px
    background: url('./stars.jpg')
</style>