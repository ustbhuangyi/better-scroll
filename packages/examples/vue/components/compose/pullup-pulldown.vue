<template>
  <div class="pullup-down">
    <div
      class="pullup-down-bswrapper"
      ref="bsWrapper"
    >
      <div class="pulldown-scroller">
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
        <ul class="pullup-down-list">
          <li
            :key="idx"
            class="pullup-down-list-item"
            v-for="(item, idx) of dataList"
          >{{ `I am item ${idx} ` }}</li>
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

<script>
import BScroll from '@better-scroll/core'
import PullDown from '@better-scroll/pull-down'
import PullUp from '@better-scroll/pull-up'

BScroll.use(PullDown)
BScroll.use(PullUp)

const BASE = 30
const TIME_BOUNCE = 800
const REQUEST_TIME = 3000
const THRESHOLD = 70
const STOP = 56

export default {
  data() {
    return {
      beforePullDown: true,
      isPullingDown: false,
      isPullingUp: false,
      dataList: new Array(BASE)
    }
  },
  created() {
    this.bscroll = null
  },
  mounted() {
    this.initBscroll()
  },
  methods: {
    initBscroll() {
      this.bscroll = new BScroll(this.$refs.bsWrapper, {
        scrollY: true,
        bounceTime: TIME_BOUNCE,
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
      // listening evnets
      this.bscroll.on('pullingDown', this.pullingDownHandler)
      this.bscroll.on('pullingUp', this.pullingUpHandler)
      this.bscroll.on('scroll', this.scrollHandler)
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
        this.bscroll.finishPullDown()
        this.beforePullDown = true
        this.bscroll.refresh()
      })
    },
    // pullingUp event handler
    async pullingUpHandler() {
      this.isPullingUp = true
      await this.requestData('load')
      this.isPullingUp = false
      this.$nextTick(() => {
        this.bscroll.finishPullUp()
        this.bscroll.refresh()
      })
    },
    async requestData(type) {
      try {
        const newData = await this.ajaxGet(/* url */)
        if (type === 'load') {
          this.dataList = newData.concat(this.dataList)
        } else {
          this.dataList = newData
        }
      } catch (err) {
        // handle err
        console.log(err)
      }
    },
    ajaxGet(/* url */) {
      return new Promise(resolve => {
        setTimeout(() => {
          const dataList = new Array(BASE)
          resolve(dataList)
        }, REQUEST_TIME)
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.pullup-down
  height 100%

.pullup-down-bswrapper
  position relative
  height 100%
  padding 0 10px
  border 1px solid #ccc
  overflow hidden

.pullup-down-list
  padding 0

.pullup-down-list-item
  padding 10px 0
  list-style none
  border-bottom 1px solid #ccc

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