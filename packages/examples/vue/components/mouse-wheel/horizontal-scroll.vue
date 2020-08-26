<template>
  <div class="mouse-wheel-horizontal-scroll">
    <div class="mouse-wheel-wrapper" ref="scroll">
      <div class="mouse-wheel-content">
        <div class="mouse-wheel-item" v-for="n in 100" :key="n">{{n}}</div>
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
    methods: {
      init() {
        this.bs = new BScroll(this.$refs.scroll, {
          scrollX: true,
          scrollY: false,
          mouseWheel: true
        })
      }
    }
  }
</script>
<style lang="stylus" scoped>

.mouse-wheel-horizontal-scroll
  .mouse-wheel-wrapper
    width 90%
    margin 80px auto
    white-space nowrap
    border 3px solid #42b983
    border-radius 5px
    overflow hidden
    .mouse-wheel-content
      display inline-block
      .mouse-wheel-item
        height 50px
        line-height 50px
        font-size 24px
        display inline-block
        text-align center
        padding 0 20px
        &:nth-child(2n)
          background-color #C3D899
        &:nth-child(2n+1)
          background-color #F2D4A7
</style>
