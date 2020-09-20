<template>
  <div class="core-specified-content-container">
    <div class="scroll-wrapper" ref="scroll">
      <div class="ignore-content">
        The Blue area is not taken as BetterScroll's content
      </div>
      <div class="scroll-content">
        <div class="scroll-item" v-for="n in nums" :key="n">{{n}}</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from '@better-scroll/core'

  export default {
    data () {
      return {
        nums: 30
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
        window.bs = this.bs = new BScroll(this.$refs.scroll, {
          specifiedIndexAsContent: 1,
          probeType: 3
        })
        this.bs.on('scroll', () => {
          console.log('scrolling-')
        })
        this.bs.on('scrollEnd', () => {
          console.log('scrollingEnd')
        })
      }
    }
  }
</script>
<style lang="stylus" scoped>

.core-specified-content-container
  text-align center
  .scroll-wrapper
    height 400px
    overflow hidden
    border 1px solid #42b983
    .ignore-content
      padding 20px
      color white
      font-size 20px
      font-weight bold
      background-color #2c3e50
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
</style>
