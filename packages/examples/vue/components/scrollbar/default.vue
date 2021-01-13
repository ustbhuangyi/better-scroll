<template>
  <div class="scrollbar">
    <div ref="wrapper" class="scrollbar-wrapper">
      <ul class="scrollbar-content">
        <li v-for="i of 40" :key="i" @click="handleClick" class="scrollbar-content-item">
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
    mounted() {
      this.initBscroll()
    },
    methods: {
      handleClick() {
        alert(1)
      },
      initBscroll() {
        this.scroll = new BScroll(this.$refs.wrapper, {
          scrollY: true,
          probeType: 2,
          click: true,
          scrollbar: {
            fade: false,
            interactive: true,
            scrollbarTrackOffsetType: 'clickedPoint'
          }
        })
        this.scroll.on('scrollEnd', () => {
          console.log('scrollEnd')
        })
        this.scroll.on('scrollStart', () => {
          console.log('scrollStart')
        })
        this.scroll.on('scroll', () => {
          console.log('scroll')
        })
      }
    }
  }
</script>

<style lang="stylus">
.scrollbar
  height: 100%
.scrollbar-wrapper
  position: relative
  height: 100%
  padding: 0 10px
  border: 1px solid #ccc
  overflow: hidden
.scrollbar-content-item
  padding: 10px 0
  list-style: none
  border-bottom: 1px solid #ccc
  text-align: left
</style>
