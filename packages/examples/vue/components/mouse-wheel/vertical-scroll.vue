<template>
  <div class="vertical-mouse-wheel">
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

.vertical-mouse-wheel
  .mouse-wheel-wrapper
    height 400px
    overflow hidden
    .mouse-wheel-item
      height 30px
      line-height 30px
      font-size 20px
      font-weight bold
      color black
      border-bottom 1px solid #eee
      text-align center
      &:nth-child(2n)
        background-color #c3d899
      &:nth-child(2n+1)
        background-color #f1ffc7
</style>
