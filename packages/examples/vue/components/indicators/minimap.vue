<template>
  <div class="minimap-container">
    <div class="scroll-wrapper" ref="wrapper">
      <!-- maxWidth is used to overwrite vuepress default theme style -->
      <!-- because this component is used in vuepress markdown as a demo -->
      <img :style="{ maxWidth: 'none' }" class="scroll-content" :src="dinnerLink" />
    </div>
    <div class="scroll-indicator" ref="indicatorWrapper">
      <img class="scroll-indicator-bg" :src="dinnerLink">
      <div class="scroll-indicator-handle"></div>
    </div>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core'
import Indicators from '@better-scroll/indicators'
import dinnerLink from './dinner.jpg'

BScroll.use(Indicators)

export default {
  created () {
    this.dinnerLink = dinnerLink
  },
  mounted () {
    this.initScroll()
  },
  methods: {
    initScroll () {
      this.scroll = new BScroll(this.$refs.wrapper, {
        startX: -50,
        startY: -50,
        freeScroll: true,
        bounce: false,
        indicators: [
          {
            relationElement: this.$refs.indicatorWrapper,
            // choose div.scroll-indicator-handle as indicatorHandle
            relationElementHandleElementIndex: 1
          }
        ]
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.minimap-container
  .scroll-wrapper
    width 320px
    height 180px
    overflow hidden
  .scroll-content
    width 1920px
    height 1080px
  .scroll-indicator
    margin-top 15px
    width 320px
    height 180px
    position relative
  .scroll-indicator-bg
    position absolute
    width 100%
    height 100%
  .scroll-indicator-handle
    position absolute
    border 1px solid white
    box-shadow 0 0 5px white
    width 64px
    height 36px
    z-index 1
    background-color rgba(255, 255, 255, 0.3)
</style>