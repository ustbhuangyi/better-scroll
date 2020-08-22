<template>
  <div class="mouse-wheel-vertical-scroll">
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
        this.scroll = new BScroll(this.$refs.scroll, {
          mouseWheel: true
        })
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>

.mouse-wheel-vertical-scroll
  .mouse-wheel-wrapper
    height 400px
    overflow hidden
    .mouse-wheel-item
      height 50px
      line-height 50px
      font-size 20px
      font-weight bold
      text-align center
      &:nth-child(2n)
        background-color #C3D899
      &:nth-child(2n+1)
        background-color #F2D4A7
</style>
