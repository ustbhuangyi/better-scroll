<template>
  <div class="core-container">
    <div class="scroll-wrapper" ref="scroll">
      <div class="scroll-content c1" :key="1">
        <div class="scroll-item" v-for="num in nums" :key="num">{{num}}</div>
      </div>
    </div>
		<button class="btn" @click="handleClick">append two children element</button>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from '@better-scroll/core'
  import ObserveDOM from '@better-scroll/observe-dom'

  BScroll.use(ObserveDOM)
  export default {
    data () {
      return {
				nums: 10,
				switcher: true
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
					observeDOM: true,
					probeType: 3
        })
			},
			handleClick() {
				// observe-dom plugin will refresh bs
				this.nums += 2
			}
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>

.core-container
  .scroll-wrapper
    height 400px
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
