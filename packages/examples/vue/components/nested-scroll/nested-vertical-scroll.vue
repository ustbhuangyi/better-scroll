<template>
  <div class="scroll-wrapper">
    <div class="demo">
      <div
        ref="outerScroll"
        class="scroll-outer-wrapper">
        <div class="scroll-outer-content">
          <ul>
          <li class="outer-row"
            v-for="(item, index) in items1"
            :key="index">{{item}}</li>
          </ul>
          <div
            ref="innerScroll"
            class="scroll-inner-wrapper">
            <ul class="scroll-inner-content">
              <li class="row"
                v-for="(item, index) in items2"
                :key="index">{{item}}</li>
            </ul>
          </div>
          <ul>
            <li class="outer-row"
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
import NestedScroll from '@better-scroll/nested-scroll'
BScroll.use(NestedScroll)

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
  methods: {
    initBScroll () {
      // outer
      this.outerScroll = new BScroll(this.$refs.outerScroll, {
        nestedScroll: true
      })
      // inner
      this.innerScroll = new BScroll(this.$refs.innerScroll, {
        nestedScroll: true,
        // close bounce effects
        bounce: {
          top: false,
          bottom: false
        }
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.scroll-outer-wrapper
.scroll-inner-wrapper
  border: 2px solid #62B791
  border-radius: 5px
  transform: rotate(0deg)
  position: relative
  overflow: hidden
.scroll-outer-wrapper
  height: 500px
  border: 1px solid rgba(0, 0, 0, .1)
.scroll-inner-wrapper
  height: 260px

.row
  height: 50px
  line-height: 50px
  text-align: center

.outer-row
  height: 40px
  line-height: 40px
  text-align: center
</style>
