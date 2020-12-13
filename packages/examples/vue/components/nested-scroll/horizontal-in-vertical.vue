<template>
  <div class="horizontal-in-vertical-container">
    <div class="vertical-wrapper" ref="outerScroll">
      <div class="vertical-content">
        <div class="vertical-item" @click="handleOuterClick" v-for="(item, idx) in list1" :key="idx">{{item}}</div>
        <div class="horizontal-wrapper" ref="innerScroll">
          <div class="slide-banner-content" @click="handleInnerClick">
              <div class="slide-item page1">horizontal scroll 1</div>
              <div class="slide-item page2">horizontal scroll 2</div>
              <div class="slide-item page3">horizontal scroll 3</div>
              <div class="slide-item page4">horizontal scroll 4</div>
          </div>
        </div>
        <div class="vertical-item" @click="handleOuterClick" v-for="(item, idx) in list2" :key="idx + 10">{{item}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core';
import NestedScroll from '@better-scroll/nested-scroll'
BScroll.use(NestedScroll)
const LIST1 = [
  '😀 😁 😂 🤣 😃 🙃 ',
  '👆🏻 vertical scroll 👇🏻 ',
  '🙂 🤔 😄 🤨 😐 🙃 ',
  '👆🏻 vertical scroll 👇🏻 ',
  '😔 😕 🙃 🤑 😲 ☹️ ',
  '🙂 🤔 😄 🤨  😐 🙃 ',
  '👆🏻 vertical scroll 👇🏻 ',
  '😔 😕 🙃 🤑 😲 ☹️ '
]
const LIST2 = [
  '😀 😁 😂 🤣 😃 🙃 ',
  '👆🏻 vertical scroll 👇🏻 ',
  '🙂 🤔 😄 🤨 😐 🙃 ',
  '👆🏻 vertical scroll 👇🏻 ',
  '😔 😕 🙃 🤑 😲 ☹️ ',
  '🙂 🤔 😄 🤨  😐 🙃 ',
  '👆🏻 vertical scroll 👇🏻 ',
  '😔 😕 🙃 🤑 😲 ☹️ '
]
export default {
  data () {
    return {
      list1: LIST1,
      list2: LIST2
    }
  },
  mounted () {
    this.initScroll()
  },
  methods: {
    handleOuterClick () {
      window.alert('clicked outer item')
    },
    handleInnerClick () {
      window.alert('clicked inner item')
    },
    initScroll () {
      let outerScroll = new BScroll(this.$refs.outerScroll, {
        nestedScroll: {
          groupId: 'mixed-nested-scroll'
        },
        click: true
      })
      let innerScroll = new BScroll(this.$refs.innerScroll, {
        nestedScroll: {
          groupId: 'mixed-nested-scroll'
        },
        scrollX: true,
        scrollY: false,
        slide: {
          loop: false,
          autoplay: false,
          threshold: 100
        },
        momentum: false,
        bounce: false,
        click: true
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  .horizontal-in-vertical-container
    .vertical-wrapper
      width: 100%
      height: 500px
      border: 2px solid #62B791
      overflow: hidden
      .vertical-item
        line-height: 40px
        text-align: center
    .slide-banner-content
      height: 200px
      white-space: nowrap
      font-size: 0
      .slide-item
        display: inline-block
        height: 200px
        width: 100%
        line-height: 200px
        text-align: center
        font-size: 26px
        &.page1
          background-color: #95B8D1
        &.page2
          background-color: #DDA789
        &.page3
          background-color: #C3D899
        &.page4
          background-color: #F2D4A7
</style>
