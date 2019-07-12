<template>
  <div class="scroll-wrapper">
    <div class="demo">
      <div
        ref="outerScroll"
        class="scroll-outer-wrapper">
        <div class="scroll-outer-content">
          <ul>
          <li class="row"
            v-for="(item, index) in items1"
            :key="index">{{item}}</li>
          </ul>
          <div
            ref="innerScroll"
            class="scroll-inner-wrapper">
            <ul>
              <li class="row"
                v-for="(item, index) in items2"
                :key="index">{{item}}</li>
            </ul>
          </div>
          <ul>
            <li
              v-for="(item, index) in items1"
              :key="index">{{item}}</li>
          </ul>
        </div>

      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from '@better-scroll/core'
import NestedScrollManager from '@better-scroll/nested-scroll-manager'
BScroll.use(NestedScrollManager)

const _data1 = [
  '😀 😁 😂 🤣 😃 🙃 ',
  '👆🏻 outer 👇🏻 ',
  '🙂 🤔 😄 🤨 😐 🙃 ',
  '👆🏻 outer 👇🏻 ',
  '😔 😕 🙃 🤑 😲 ☹️ '
]

const _data2 = [
  '😀 😁 😂 🤣 😃 🙃 ',
  '👆🏻 inner 👇🏻 ',
  '🙂 🤔 😄 🤨 😐 🙃 ',
  '👆🏻 inner 👇🏻 ',
  '😔 😕 🙃 🤑 😲 ☹️ ',
  '👆🏻 inner 👇🏻 ',
  '🐣 🐣 🐣 🐣 🐣 🐣 ',
  '👆🏻 inner 👇🏻 ',
  '🐥 🐥 🐥 🐥 🐥 🐥 ',
  '👆🏻 inner 👇🏻 ',
  '🤓 🤓 🤓 🤓 🤓 🤓 ',
  '👆🏻 inner 👇🏻 ',
  '🦔 🦔 🦔 🦔 🦔 🦔 ',
  '👆🏻 inner 👇🏻 ',
  '🙈 🙈 🙈 🙈 🙈 🙈 ',
  '👆🏻 inner 👇🏻 ',
  '🚖 🚖 🚖 🚖 🚖 🚖 ',
  '👆🏻 inner 👇🏻 ',
  '✌🏻 ✌🏻 ✌🏻 ✌🏻 ✌🏻 ✌🏻 '
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
  methods: {
    initBScroll () {
      // outer
      this.outerScroll = new BScroll(this.$refs.outerScroll, {
        nestedScrollManager: true
      })
      // inner
      this.innerScroll = new BScroll(this.$refs.innerScroll, {
        nestedScrollManager: true,
        probeType: 3
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.scroll-outer-wrapper
.scroll-inner-wrapper
  border: 1px solid rgba(0, 0, 0, 0.1)
  border-radius: 5px
  transform: rotate(0deg) // fix 子元素超出边框圆角部分不隐藏的问题
  position: relative
  overflow: hidden
.scroll-outer-wrapper
  height: 500px
.scroll-inner-wrapper
  height: 300px
.row
  height: 100px
  line-height: 100px
</style>
