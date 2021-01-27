<template>
  <div class="movable-multi-content-container">
    <div class="scroll-wrapper" ref="scroll">
      <div class="scroll-content content1">
        <figure>
          <figcaption>Cold Oasis</figcaption>
          <img class="picture" :src="picture1"
         alt="Cold Oasis">
        </figure>
      </div>
      <div class="scroll-content content2">
        <figure>
          <figcaption>Warm Oasis</figcaption>
          <img class="picture" :src="picture2"
         alt="Warm Oasis">
        </figure>
      </div>
    </div>
    <button class="btn" @click="handleClick">Put The Warm at center position</button>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from '@better-scroll/core'
  import Movable from '@better-scroll/movable'
  import picture1 from './oasis_one.png'
  import picture2 from './oasis_two.png'

  BScroll.use(Movable)

  export default {
    created() {
      this.picture1 = picture1
      this.picture2 = picture2
    },
    mounted() {
      this.init()
    },
    beforeDestroy() {
      this.bs1.destroy()
      this.bs2.destroy()
    },
    methods: {
      init() {
        this.bs1 = new BScroll(this.$refs.scroll, {
          bindToTarget: true,
          scrollX: true,
          scrollY: true,
          freeScroll: true,
          movable: true,
          startX: 10,
          startY: 10
        })
        this.bs2 = new BScroll(this.$refs.scroll, {
          // use wrapper.children[1] as content
          specifiedIndexAsContent: 1,
          bindToTarget: true,
          scrollX: true,
          scrollY: true,
          freeScroll: true,
          movable: true,
          startX: 0,
          startY: 170
        })
      },
      handleClick() {
        this.bs2.putAt('center', 'center')
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>

.movable-multi-content-container

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
