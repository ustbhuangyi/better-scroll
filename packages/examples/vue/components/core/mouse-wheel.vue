<template>
  <div class="core-mouse-wheel">
    <div class="scroll-wrapper" ref="scroll">
      <div class="wheel-scroll">
        <div class="wheel-item" v-for="n in 15" :key="n">{{n}}</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from '@better-scroll/core'
  import MouseWheel from '@better-scroll/mouse-wheel'
  BScroll.use(MouseWheel)

  export default {
    mounted() {
      this.init()
    },
    beforeDestroy() {
      this.slide.destroy()
    },
    methods: {
      init() {
        this.slide = new BScroll(this.$refs.scroll, {
          scrollX: false,
          scrollY: true,
          mouseWheel: {
            speed: 2,
            invert: false,
            easeTime: 300,
          }
        })
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>

.core-mouse-wheel
  .scroll-wrapper
    height 200px
    overflow hidden
    .wheel-item
      height 30px
      line-height 30px
      font-size 20px
      font-weight bold
      border-bottom 1px solid #eee
      text-align center
      &:nth-child(2n)
        background-color #c3d899
      &:nth-child(2n+1)
        background-color #f1ffc7
</style>
