<template>
  <div class="container">
    <div ref="outerScroll" class="outer-wrapper">
      <div class="outer-content">
        <ul>
          <li class="outer-list-item" v-for="(item, index) in items1" :key="index">{{item}}</li>
        </ul>
        <div ref="innerScroll" class="inner-wrapper">
          <div class="slide-banner-content">
          <div class="slide-item page1">page 1</div>
          <div class="slide-item page2">page 2</div>
          <div class="slide-item page3">page 3</div>
          <div class="slide-item page4">page 4</div>
        </div>
        </div>
        <ul>
          <li class="outer-list-item" v-for="(item, index) in items1" :key="index">{{item}}</li>
        </ul>
      </div>

    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from '@better-scroll/core'
import NestedScroll from '@better-scroll/nested-scroll'
import Slide from '@better-scroll/slide'

BScroll.use(NestedScroll)
BScroll.use(Slide)

const _data1 = [
  '😀 😁 😂 🤣 😃 🙃 ',
  '👆🏻 outer scroll 👇🏻 ',
  '🙂 🤔 😄 🤨 😐 🙃 ',
  '👆🏻 outer scroll 👇🏻 ',
  '😔 😕 🙃 🤑 😲 ☹️ ',
  '🙂 🤔 😄 🤨  😐 🙃 ',
  '👆🏻 outer scroll 👇🏻 ',
  '😔 😕 🙃 🤑 😲 ☹️ '
]

const _data2 = [
  'The Mountain top of Inner',
  '😀 😁 😂 🤣 😃 🙃 ',
  '👆🏻 inner scroll 👇🏻 ',
  '🙂 🤔 😄 🤨 😐 🙃 ',
  '👆🏻 inner scroll 👇🏻 ',
  '😔 😕 🙃 🤑 😲 ☹️ ',
  '👆🏻 inner scroll 👇🏻 ',
  '🐣 🐣 🐣 🐣 🐣 🐣 ',
  '👆🏻 inner scroll 👇🏻 ',
  '🐥 🐥 🐥 🐥 🐥 🐥 ',
  '👆🏻 inner scroll 👇🏻 ',
  '🤓 🤓 🤓 🤓 🤓 🤓 ',
  '👆🏻 inner scroll 👇🏻 ',
  '🦔 🦔 🦔 🦔 🦔 🦔 ',
  '👆🏻 inner scroll 👇🏻 ',
  '🙈 🙈 🙈 🙈 🙈 🙈 ',
  '👆🏻 inner scroll 👇🏻 ',
  '🚖 🚖 🚖 🚖 🚖 🚖 ',
  '👆🏻 inner scroll 👇🏻 ',
  '✌🏻 ✌🏻 ✌🏻 ✌🏻 ✌🏻 ✌🏻 ',
  'The Mountain foot of Inner',
]

export default {
  data() {
    return {
      items1: _data1,
      items2: _data2
    }
  },
  mounted () {
    this.initBScroll()
  },
  beforeDestroy () {
    this.outerScroll.destroy()
    this.innerScroll.destroy()
  },
  methods: {
    initBScroll () {
      // outer
      this.outerScroll = new BScroll(this.$refs.outerScroll, {
        nestedScroll: {
          groupId: 'slide-nested'
        }
      })
      // inner
      this.innerScroll = new BScroll(this.$refs.innerScroll, {
        nestedScroll: {
          groupId: 'slide-nested'
        },
        scrollX: true,
        scrollY: false,
        momentum: false,
        // close bounce effects
        bounce: {
          top: false,
          bottom: false
        },
        slide: {
          loop: true,
          autoplay: false
        }
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.container
  height: 100%
.outer-wrapper
.inner-wrapper
  
  border-radius: 5px
  transform: rotate(0deg)
  position: relative
  overflow: hidden
  box-sizing: border-box
.outer-wrapper
  height: 100%
  border: 1px solid rgba(0, 0, 0, .1)
  border: 1px solid #62B791
.inner-wrapper
  height: 200px

.outer-list-item
  height: 40px
  line-height: 40px
  text-align: center
  list-style: none

.slide-banner-content
  height 200px
  white-space nowrap
  width: 100%
  font-size 0
  .slide-item
    display inline-block
    height 200px
    width 100%
    line-height 200px
    text-align center
    font-size 26px
    &.page1
      background-color #95B8D1
    &.page2
      background-color #DDA789
    &.page3
      background-color #C3D899
    &.page4
      background-color #F2D4A7
</style>
