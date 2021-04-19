<template>
  <div class="horizontal-rotated-container">
    <div class="description">Force flipping layout via CSS</div>
    <div class="scroll-wrapper" ref="scroll">
      <div class="scroll-content">
        <div class="scroll-item" v-for="num in nums" :key="num">{{num}}</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from '@better-scroll/core'

  export default {
    data () {
      return {
        nums: 8
      }
    },
    mounted() {
      this.init()
    },
    beforeDestroy() {
      this.bs.destroy()
    },
    methods: {
      init() {
        this.bs = new BScroll(this.$refs.scroll, {
          scrollX: true,
          scrollY: false,
          // v2.3.0
          quadrant: 3 // rotate180
        })
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>

/* force flipping by CSS */
.scroll-wrapper
  transform rotate(180deg)
.horizontal-rotated-container
  .description
    text-align center
  .scroll-wrapper
    height 100px
    width 250px
    position relative
    overflow hidden
    white-space nowrap
    margin 0 auto
    border 1px solid #ccc
    .scroll-content
      display inline-block
    .scroll-item
      height 100px
      width 100px
      line-height 100px
      font-size 24px
      font-weight bold
      text-align center
      display inline-block
      &:nth-child(2n)
        background-color #f3f5f7
      &:nth-child(2n+1)
        background-color #42b983
</style>
