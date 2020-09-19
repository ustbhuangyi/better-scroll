<template>
  <div class="movable-multi-content-scale-container">
    <div class="scroll-wrapper" ref="scroll">
      <div class="scroll-content">
        <figure>
          <figcaption>Swordsman</figcaption>
          <img class="picture" src="./images/ftstr.webp"
         alt="ftstr">
        </figure>
      </div>
      <div class="scroll-content">
        <figure>
          <figcaption>The Witch</figcaption>
          <img class="picture" src="./images/qos_crop.webp"
         alt="qos_crop">
        </figure>
      </div>
    </div>
    <button class="btn" @click="handleClick">Put The Witch at right-bottom corner</button>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from '@better-scroll/core'
  import Movable from '@better-scroll/movable'
  import Zoom from '@better-scroll/zoom'

  BScroll.use(Movable)
  BScroll.use(Zoom)

  export default {
    mounted() {
      this.init()
    },
    beforeDestroy() {
      this.bs1.destroy()
      this.bs2.destroy()
    },
    methods: {
      handleClick() {
        this.bs2.putAt('right', 'bottom', 500)
      },
      init() {
        this.bs1 = new BScroll(this.$refs.scroll, {
          bindToTarget: true,
          scrollX: true,
          scrollY: true,
          freeScroll: true,
          movable: true,
          zoom: {
            start: 1.2,
            min: 0.5,
            max: 3
          }
        })
        this.bs1.putAt('center', 'center', 0)
        this.bs2 = new BScroll(this.$refs.scroll, {
          specifiedIndexAsContent: 1,
          bindToTarget: true,
          scrollX: true,
          scrollY: true,
          freeScroll: true,
          movable: true,
          startY: 150,
          zoom: {
            start: 1,
            min: 0.5,
            max: 3
          }
        })
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>

.movable-multi-content-scale-container

  .scroll-wrapper
    height 400px
    overflow hidden
    position relative
    box-shadow 0 0 3px rgba(0, 0, 0, .3)
    .scroll-content
      position absolute
      top 0
      left 0
      width 200px
      figure
        margin 0
      figcaption
        font-weight bold
        margin-bottom 5px
        text-align center
        color #ea4c89
      .picture
        width 200px
        height 150px
        border-radius 10px
    .scroll-item
      height 50px
      line-height 50px
      font-size 24px
      font-weight bold
      border-bottom 1px solid #eee
      text-align center
      &:nth-child(2n)
        background-color #f3f5f7
      &:nth-child(2n+1)
        background-color #42b983

  .btn
    margin 40px auto
    padding 10px
    color #fff
    border-radius 4px
    font-size 20px
    background-color #666  
</style>
