<template>
  <div class="vertical-rotated-container">
    <div class="description">Horizontal layout via CSS</div>
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
          // v2.3.0
          quadrant: 2 // rotate90
        })
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>

/* horizontal by CSS */
.scroll-wrapper
  transform rotate(90deg)
.vertical-rotated-container
  .description
    text-align center
  .scroll-wrapper
    height 250px
    width 100px
    position relative
    overflow hidden
    margin 0 auto
    border 1px solid #ccc
    .scroll-item
      height 100px
      width 100px
      line-height 100px
      font-size 24px
      font-weight bold
      text-align center
      &:nth-child(2n)
        background-color #f3f5f7
      &:nth-child(2n+1)
        background-color #42b983
</style>
