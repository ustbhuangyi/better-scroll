<template>
  <div class="observe-image-container">
    <div class="scroll-wrapper" ref="scroll">
      <div class="scroll-content">
        <img width="100%" v-for="(url, index) in images" :src="url" alt="" :key="index">
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from '@better-scroll/core'
  import ObserveImage from '@better-scroll/observe-image'

  BScroll.use(ObserveImage)
  export default {
    data () {
      return {
        images: [
          'https://dpubstatic.udache.com/static/dpubimg/dEswI1MVy6/zoo.png',
          'https://dpubstatic.udache.com/static/dpubimg/BYb_wPak21/home.png',
          'https://dpubstatic.udache.com/static/dpubimg/B6q1pWB0sB/cabin.png',
          'https://dpubstatic.udache.com/static/dpubimg/76n1ilzf4R/stone.png'
        ]
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
          observeImage: true
        })
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>

.observe-image-container
  text-align center
  .scroll-wrapper
    position relative
    width 300px
    height 300px
    margin 20px auto
    border 3px solid #42b983
    border-radius 5px
    overflow hidden
  .scroll-content
    font-size 0
</style>
