<template>
  <div class="scrollbar">
    <div ref="scroller" class="scrollbar-bswrapper">
      <ul class="scrollbar-list">
        <li v-for="i of 40" :key="i" class="scrollbar-list-item">
          {{ `I am item ${i} `}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import BScroll from '@better-scroll/core'
  import ScrollBar from '@better-scroll/scroll-bar'

  BScroll.use(ScrollBar)

  export default {
    created() {
      this.bscroll = null
    },
    mounted() {
      this.initBscroll()
    },
    methods: {
      initBscroll() {
        this.bscroll = new BScroll(this.$refs.scroller, {
          scrollY: true,
          scrollbar: true
        })

        this.bscroll.on('pullingUp', this.pullingUpHandler)
      }
    }
  }
</script>

<style lang="stylus">
.scrollbar
  height: 100%
.scrollbar-bswrapper
  position: relative
  height: 100%
  padding: 0 10px
  border: 1px solid #ccc
  overflow: hidden
.scrollbar-list-item
  padding: 10px 0
  border-bottom: 1px solid #ccc
.scrollbar-wrapper
  padding: 20px
  text-align: center
  color: #999
</style>