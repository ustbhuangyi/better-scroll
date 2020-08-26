<template>
  <div class="container">
    <div ref="outerScroll" class="outer-wrapper">
      <div class="outer-content">
        <div class="pulldown-wrapper">
          <div v-show="beforePullDown">
            <span>Pull Down and refresh</span>
          </div>
          <div v-show="!beforePullDown">
            <div v-show="isPullingDown">
              <span>Loading...</span>
            </div>
            <div v-show="!isPullingDown">
              <span>Refresh success</span>
            </div>
          </div>
        </div>
        <ul>
          <li class="outer-list-item" v-for="(item, index) in topOutItems" :key="index">{{item}}</li>
        </ul>
        <div ref="innerScroll" class="inner-wrapper">
          <ul class="inner-content">
            <li class="inner-list-item" v-for="(item, index) in innerItems" :key="index">{{item}}</li>
          </ul>
        </div>
        <ul>
          <li class="outer-list-item2" v-for="(item, index) in bottomOutItems" :key="index">{{item}}</li>
        </ul>
        <div class="pullup-wrapper">
          <div v-show="!isPullingUp">
            <span>Pull Up and load</span>
          </div>
          <div v-show="isPullingUp">
            <span>Loading...</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from '@better-scroll/core'
import NestedScroll from '@better-scroll/nested-scroll'
import PullUp from '@better-scroll/pull-up'
import PullDown from '@better-scroll/pull-down'

BScroll.use(NestedScroll)
BScroll.use(PullUp)
BScroll.use(PullDown)

const _data1 = [
  '😀  😁   😂  🤣   😃  🙃',
  '👆🏻 Pull Down and refresh👆🏻',
  '🙂  🤔   😄  🤨   😐  🙃',
  '👆🏻 Pull Down and refresh👆🏻',
  '😔  😕   🙃  🤑   😲  ☹️',
  '🙂  🤔  😄  🤨   😐  🙃 ',
  '👆🏻 Pull Down and refresh👆🏻',
  '😔  😕   🙃  🤑   😲  ☹️ '
]

const _data2 = [
  '😀  😁   😂  🤣   😃  🙃',
  '👆🏻 Pull Up and refresh👆🏻',
  '🙂  🤔   😄  🤨   😐  🙃',
  '👆🏻 Pull Up and refresh👆🏻',
  '😔  😕   🙃  🤑   😲  ☹️',
  '🙂  🤔  😄  🤨   😐  🙃 ',
  '👆🏻 Pull Up and refresh👆🏻',
  '😔  😕   🙃  🤑   😲  ☹️ '
]

const _data3 = [
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

const TIME_BOUNCE = 800
const REQUEST_TIME = 3000
const THRESHOLD = 70
const STOP = 56

export default {
  data() {
    return {
      topOutItems: _data1,
      bottomOutItems:_data2,
      innerItems: _data3,
      beforePullDown: true,
      isPullingDown: false,
      isPullingUp: false,
    }
  },
  mounted () {
    this.initBScroll()
  },
  methods: {
    initBScroll () {
      // outer
      this.outerScroll = new BScroll(this.$refs.outerScroll, {
        nestedScroll: true,
        bounceTime:TIME_BOUNCE,
        // pullDown options
        pullDownRefresh: {
          threshold: THRESHOLD,
          stop: STOP
        },
        // pullUp options
        pullUpLoad: {
          threshold: THRESHOLD
        }
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
      this.outerScroll.on('pullingDown', this.pullingDownHandler)
      this.outerScroll.on('pullingUp', this.pullingUpHandler)
      this.outerScroll.on('scroll', this.scrollHandler)
    },
    // scroll event handler
    scrollHandler(pos) {
      console.log(pos.y)
    },
    // pullingDown event handler
    async pullingDownHandler() {
      this.beforePullDown = false
      this.isPullingDown = true
      await this.requestData('refresh')
      this.isPullingDown = false
      this.$nextTick(() => {
        this.outerScroll.finishPullDown()
        this.beforePullDown = true
        this.outerScroll.refresh()
      })
    },
    // pullingUp event handler
    async pullingUpHandler() {
      this.isPullingUp = true
      await this.requestData('load')
      this.isPullingUp = false
      this.$nextTick(() => {
        this.outerScroll.finishPullUp()
        this.outerScroll.refresh()
      })
    },
    async requestData(type) {
      try {
        const {topOutItems, bottomOutItems} = await this.ajaxGet(/* url */)
        if (type === 'load') {
          this.bottomOutItems = this.bottomOutItems.concat(bottomOutItems)
        } else {
          this.topOutItems = topOutItems
          this.bottomOutItems = bottomOutItems
        }
      } catch(err) {
        console.log(err)
      }
    },
    ajaxGet(/* url */) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            topOutItems: _data1,
            bottomOutItems: _data2
          })
        }, REQUEST_TIME)
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

.inner-list-item
  height: 50px
  line-height: 50px
  text-align: center
  list-style: none
  
.outer-list-item2,
.outer-list-item
  height: 40px
  line-height: 40px
  text-align: center
  list-style: none

.pulldown-wrapper
  position absolute
  width 100%
  padding 20px
  box-sizing border-box
  transform translateY(-100%) translateZ(0)
  text-align center
  color #999

.pullup-wrapper
  padding 20px
  text-align center
  color #999
</style>
