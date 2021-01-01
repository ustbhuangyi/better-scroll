<template>
  <div class="container">
    <div ref="outerScroll" class="outer-wrapper">
      <div class="outer-content">
        <ul>
          <li class="outer-list-item" @click="handleOuterClick" v-for="(item, index) in outerOpenData" :key="index">{{item}}</li>
        </ul>
        <div ref="middleScroll"  class="middle-wrapper">
          <div class="middle-content">
            <ul>
              <li class="middle-list-item" @click="handleMiddleClick" v-for="(item, index) in middleOpenData" :key="index">{{item}}</li>
            </ul>
            <div ref="innerScroll" class="inner-wrapper">
              <ul class="inner-content">
                <li class="inner-list-item" v-for="(item, index) in innerData" @click="handleInnerClick" :key="index">{{item}}</li>
              </ul>
            </div>
            <ul>
              <li class="middle-list-item" @click="handleMiddleClick" v-for="(item, index) in middleCloseData" :key="index + 100">{{item}}</li>
            </ul>
          </div>
        </div>
        <ul>
          <li class="outer-list-item" @click="handleOuterClick" v-for="(item, index) in outerCloseData" :key="index + 100">{{item}}</li>
        </ul>
      </div>

    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from '@better-scroll/core'
import NestedScroll from '@better-scroll/nested-scroll'
BScroll.use(NestedScroll)

const outerOpenData = [
  '----Outer Start----',
  '👆🏻 outer scroll 👇🏻 ',
  '🙂 🤔 😄 🤨 😐 🙃 ',
  '👆🏻 outer scroll 👇🏻 '
]

const outerCloseData = [
  '👆🏻 outer scroll 👇🏻 ',
  '🙂 🤔 😄 🤨 😐 🙃 ',
  '👆🏻 outer scroll 👇🏻 ',
  '😔 😕 🙃 🤑 😲 😲 ',
  '🙂 🤔 😄 🤨  😐 🙃 ',
  '👆🏻 outer scroll 👇🏻 ',
  '----Outer End----',
]

const middleOpenData = [
  '----Middle Start----',
  '👆🏻 middle scroll 👇🏻 ',
  '🐣 🐣 🐣 🐣 🐣 🐣 ',
]

const middleCloseData = [
  '👆🏻 middle scroll 👇🏻 ',
  '🤓 🤓 🤓 🤓 🤓 🤓 ',
  '👆🏻 middle scroll 👇🏻 ',
  '🦔 🦔 🦔 🦔 🦔 🦔 ',
  '👆🏻 middle scroll 👇🏻 ',
  '🙈 🙈 🙈 🙈 🙈 🙈 ',
  '👆🏻 middle scroll 👇🏻 ',
  '🚖 🚖 🚖 🚖 🚖 🚖 ',
  '👆🏻 middle scroll 👇🏻 ',
  '✌🏻 ✌🏻 ✌🏻 ✌🏻 ✌🏻 ✌🏻 ',
  '----Middle End----',
]

const innerData = [
  '------Inner Start-----',
  '😀 😁 😂 🤣 😃 🙃 ',
  '👆🏻 inner scroll 👇🏻 ',
  '🙂 🤔 😄 🤨 😐 🙃 ',
  '👆🏻 inner scroll 👇🏻 ',
  '😔 😕 🙃 🤑 😲 😐 🙃 ',
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
  '-----Inner End-----'
]

export default {
  data() {
    return {
      outerOpenData,
      outerCloseData,
      middleOpenData,
      middleCloseData,
      innerData,
    }
  },
  mounted () {
    this.initBScroll()
  },
  beforeDestroy () {
    this.outerScroll.destroy()
    this.middleScroll.destroy()
    this.innerScroll.destroy()
  },
  methods: {
    handleOuterClick () {
      window.alert('clicked outer item')
    },
    handleMiddleClick () {
      window.alert('clicked middle item')
    },
    handleInnerClick () {
      window.alert('clicked inner item')
    },
    initBScroll () {
      // outer
      this.outerScroll = this.outerScroll = new BScroll(this.$refs.outerScroll, {
        nestedScroll: {
          groupId: 'triple-nested-scroll' // groupId is a string or number
        },
        click: true
      })

      // inner
      this.innerScroll = new BScroll(this.$refs.innerScroll, {
        // please keep the same groupId as above
        // all scrolls will be controlled by the same nestedScroll instance
        nestedScroll: {
          groupId: 'triple-nested-scroll'
        },
        probeType:2,
        click: true
      })

      this.innerScroll.on('scroll', () => {
        console.log('innerScroll scroll')
      })
      this.innerScroll.on('scrollEnd', () => {
        console.log('innerScroll scrollEnd')
      })

      // middle
      this.middleScroll = new BScroll(this.$refs.middleScroll, {
        nestedScroll: {
          groupId: 'triple-nested-scroll' // groupId is a string or number
        },
        probeType: 2,
        click: true
      })

      this.middleScroll.on('scroll', () => {
        console.log('middleScroll scroll')
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.container
  height: 100%
.outer-wrapper
.middle-wrapper
.inner-wrapper
  border: 2px solid #62B791
  border-radius: 5px
  transform: rotate(0deg)
  position: relative
  overflow: hidden
.outer-wrapper
  height: 100%
  border: 1px solid rgba(0, 0, 0, .1)
.middle-wrapper
  height: 480px
  background-color rgba(240,65,85, 0.2)  
  border: 2px solid #f04155
.inner-wrapper
  height: 240px
  background-color rgb(98,183,145)
.middle-list-item
.inner-list-item
  height: 50px
  line-height: 50px
  text-align: center
  list-style: none
  color: white

.middle-list-item
  color: #894e06

.outer-list-item
  height: 40px
  line-height: 40px
  text-align: center
  list-style: none
</style>
