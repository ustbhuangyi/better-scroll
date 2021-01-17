<template>
  <div class="horizontal-scrollbar-container">
    <div class="scroll-wrapper" ref="scroll">
      <div class="scroll-content">
        <div class="scroll-item" v-for="index in num" :key="index">{{index}}</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from '@better-scroll/core'
  import Scrollbar from '@better-scroll/scroll-bar'

  BScroll.use(Scrollbar)

  export default {
    data () {
      return {
        num: 12
      }
    },
    mounted() {
      this.init()
    },
    beforeDestroy() {
      this.scroll.destroy()
    },
    methods: {
      init() {
        this.scroll = new BScroll(this.$refs.scroll, {
          scrollX: true,
          scrollY: false,
          click: true,
          probeType: 1,
          scrollbar: {
            fade: false,
            interactive: true,
            scrollbarTrackClickable: true,
            scrollbarTrackOffsetType: 'clickedPoint' // can use 'step'
          }
        })
        this.scroll.on('scrollEnd', () => {
          console.log('scrollEnd')
        })
        this.scroll.on('scrollStart', () => {
          console.log('scrollStart')
        })
        this.scroll.on('scroll', () => {
          console.log('scroll')
        })
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>

.horizontal-scrollbar-container
  .scroll-wrapper
    position relative
    display flex
    align-content center
    width 90%
    height 100px
    margin 80px auto
    white-space nowrap
    border 3px solid rgba(30, 80, 255, 0.3)
    border-radius 5px
    overflow hidden
    .scroll-content
      display inline-block
      align-self center
    .scroll-item
      opacity  0.6
      color white
      box-sizing border-box
      height 50px
      width 50px
      line-height 50px
      border-radius 50%
      font-size 18px
      display inline-block
      text-align center
      padding 0 10px
      margin 0 10px
      &:nth-child(4n)
        background-color #06F
      &:nth-child(4n+1)
        background-color #0f9d00
      &:nth-child(4n+2)
        background-color #F00
      &:nth-child(4n+3)
        background-color #ffea00
</style>
