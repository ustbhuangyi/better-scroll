<template>
  <div class="scrollbar">
    <div ref="wrapper" class="scrollbar-wrapper">
      <ul class="scrollbar-content">
        <li v-for="i of 40" :key="i" class="scrollbar-content-item">
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
      initBscroll() {
        this.scroll = new BScroll(this.$refs.wrapper, {
          scrollY: true,
          scrollbar: true
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
