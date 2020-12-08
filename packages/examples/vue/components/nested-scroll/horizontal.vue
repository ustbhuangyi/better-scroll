<template>
  <div class="container">
      <div ref="outerScroll" class="outer-wrapper">
        <ul class="outer-content">
          <li v-for="(item, idx) in items1" @click="handleOuterClick" :key="idx" class="list-item">{{ item }}</li>
          <li class="list-item inner-list-item">
            <div
              ref="innerScroll"
              class="inner-wrapper">
              <ul class="inner-content">
                <li v-for="(item, idx) in items2" @click="handleInnerClick" :key="idx" class="list-item">{{ item }}</li>
              </ul>
            </div>
          </li>
          <li v-for="(item, idx) in items1" :key="idx + 100" class="list-item">{{ item }}</li>
        </ul>
      </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from '@better-scroll/core'
import NestedScroll from '@better-scroll/nested-scroll'
BScroll.use(NestedScroll)

const _data1 = [
  '👈🏻  outer 👉🏻 ',
  '🙂 🤔 😄 🤨 😐 🙃 '
]

const _data2 = [
  '👈🏻  inner 👉🏻  ',
  '🙂 🤔 😄 🤨 😐 🙃 ',
  '👈🏻  inner 👉🏻 ',
  '😔 😕 🙃 🤑 😲 ☹️ ',
  '👈🏻  inner 👉🏻 ',
  '🐣 🐣 🐣 🐣 🐣 🐣 ',
  '👈🏻  inner 👉🏻 ',
  '🐥 🐥 🐥 🐥 🐥 🐥 '
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
    handleOuterClick () {
      window.alert('clicked outer item')
    },
    handleInnerClick () {
      window.alert('clicked inner item')
    },
    initBScroll () {
      // outer
      this.outerScroll = new BScroll(this.$refs.outerScroll, {
        nestedScroll: true,
        scrollX: true,
        scrollY: false,
        click: true
      })
      // inner
      this.innerScroll = new BScroll(this.$refs.innerScroll, {
        nestedScroll: true,
        scrollX: true,
        scrollY: false,
        click: true,
        // close bounce effects
        bounce: {
          left: false,
          right: false
        }
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .outer-wrapper
    border: 1px solid rgba(0, 0, 0, 0.1)
    border-radius: 5px
    transform: rotate(0deg)
    margin-top: 50px
    position: relative
    overflow: hidden
    .outer-content
      display: inline-block
      vertical-align: top
      white-space: nowrap

  .inner-wrapper
    border: 2px solid #62B791
    border-radius: 5px
    transform: rotate(0deg)
    position: relative
    width: 200px
    overflow: hidden
    .inner-content
      display: inline-block
      vertical-align: top

  .list-item
    display: inline-block
    line-height: 60px

  .inner-list-item
    vertical-align: top // important
    background-color: rgba(98,183,145, 0.2)
</style>
