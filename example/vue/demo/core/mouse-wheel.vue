<template>
  <div class="core-mouse-wheel">
    <div class="scroll-wrapper" ref="scroll">
      <div class="wheel-scroll">
        <div class="wheel-item">1</div>
        <div class="wheel-item">2</div>
        <div class="wheel-item">3</div>
        <div class="wheel-item">4</div>
        <div class="wheel-item">5</div>
        <div class="wheel-item">6</div>
        <div class="wheel-item">7</div>
        <div class="wheel-item">8</div>
        <div class="wheel-item">9</div>
        <div class="wheel-item">10</div>
        <div class="wheel-item">11</div>
        <div class="wheel-item">12</div>
        <div class="wheel-item">13</div>
        <div class="wheel-item">14</div>
        <div class="wheel-item">15</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from '../../../../src/index.ts'
  import MouseWheel from '../../../../src/plugins/mouse-wheel'
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
<style lang="stylus" rel="stylesheet/stylus" scope>
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
