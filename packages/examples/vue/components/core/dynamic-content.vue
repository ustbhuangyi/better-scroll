<template>
  <div class="core-dynamic-content-container">
    <div class="scroll-wrapper" ref="scroll">
      <div class="scroll-content c1" key="1" v-if="!switcher">
        <div class="scroll-item" v-for="n in nums1" :key="n">{{n}}</div>
      </div>
      <div class="scroll-content c2" key="2" v-else>
        <div class="scroll-item" v-for="n in nums2" :key="n">{{nums2 - n + 1}}</div>
      </div>
    </div>
    <button class="btn" @click="handleClick">switch content element</button>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from '@better-scroll/core'

  export default {
    data () {
      return {
        nums1: 30,
        nums2: 60,
        switcher: false
      }
    },
    mounted() {
      this.init()
    },
    beforeDestroy() {
      this.bs.destroy()
    },
    methods: {
      handleClick() {
        this.switcher = !this.switcher
        // wait for Vue rerender
        this.$nextTick(() => {
          this.bs.refresh()
        })
      },
      init() {
        this.bs = new BScroll(this.$refs.scroll, {
          probeType: 3
        })
        this.bs.on('contentChanged', (content) => {
          console.log('--- newContent ---')
          console.log(content)
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

.core-dynamic-content-container
  text-align center
  .scroll-wrapper
    height 300px
    overflow hidden
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
