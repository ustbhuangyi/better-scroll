<template>
  <div class="container">
    <div ref="outerScroll" class="outer-wrapper">
      <div class="outer-content">
        <ul>
          <li class="outer-list-item" @click="handleOuterClick" v-for="(item, index) in items1" :key="index">{{item}}</li>
        </ul>
        <div ref="innerScroll" class="inner-wrapper">
          <ul class="inner-content">
            <li class="inner-list-item" v-for="(item, index) in items2" @click="handleInnerClick" :key="index">{{item}}</li>
          </ul>
        </div>
        <ul>
          <li class="outer-list-item" @click="handleOuterClick" v-for="(item, index) in items1" :key="index">{{item}}</li>
        </ul>
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
  beforeDestroy () {
    this.outerScroll.destroy()
    this.innerScroll.destroy()
  },
  methods: {
    handleOuterClick () {
      window.alert('clicked outer item')
    },
    handleInnerClick () {
      window.alert('clicked inner item')
    },
    initBScroll () {
      // outer
      this.outerScroll = new BScroll(this.$refs.outerScroll, {
        nestedScroll: {
          groupId: 'vertical-nested-scroll' // groupId is a string or number
        },
        click: true
      })

      // inner
      this.innerScroll = new BScroll(this.$refs.innerScroll, {
        // please keep the same groupId as above
        // outerScroll and innerScroll will be controlled by the same nestedScroll instance
        nestedScroll: {
          groupId: 'vertical-nested-scroll'
        },
        click: true
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
  border: 2px solid #62B791
  border-radius: 5px
  transform: rotate(0deg)
  position: relative
  overflow: hidden
.outer-wrapper
  height: 100%
  border: 1px solid rgba(0, 0, 0, .1)
.inner-wrapper
  height: 240px
  background-color rgba(98,183,145, 0.2)
.inner-list-item
  height: 50px
  line-height: 50px
  text-align: center
  list-style: none

.outer-list-item
  height: 40px
  line-height: 40px
  text-align: center
  list-style: none
</style>
