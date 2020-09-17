<template>
  <div class="observe-dom-container">
    <div class="scroll-wrapper" ref="scroll">
      <div class="scroll-content">
        <div class="scroll-item" v-for="num in nums" :key="num">{{nums - num + 1}}</div>
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
				nums: 10
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
					scrollX: true,
					scrollY: false
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

.observe-dom-container
  text-align center
  .scroll-wrapper
    width 90%
    margin 80px auto
    white-space nowrap
    border 3px solid #42b983
    border-radius 5px
    overflow hidden
    .scroll-content
      display inline-block
      .scroll-item
        height 50px
        line-height 50px
        font-size 24px
        display inline-block
        text-align center
        padding 0 20px
        &:nth-child(2n)
          background-color #C3D899
        &:nth-child(2n+1)
          background-color #F2D4A7
	.btn
		margin 40px auto
		padding 10px
		color #fff
		border-radius 4px
		font-size 20px
		background-color #666   			
</style>
