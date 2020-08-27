<template>
  <div class="pullup-down-slide-wrapper">
    <!-- pulldown -->
    <div
      class="pulldown-wrapper"
      ref="pulldown"
    >
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
    <div
      class="pullup-pulldown-slide-bswrapper"
      ref="bsWrapper"
    >
      <div class="pullup-pulldown-slide-scroller">
        <!-- slide item -->
        <div
          :key="idx"
          class="pullup-pulldown-slide-item"
          :class="{['page' + idx % 4 ]: true}"
          v-for="(item, idx) of dataList"
        >{{ `Page ${idx} ` }}</div>

      </div>
    </div>
    <!-- pollup -->
    <div class="pullup-wrapper" ref="pullup">
      <div v-show="!isPullingUp">
        <span>Pull Up and load</span>
      </div>
      <div v-show="isPullingUp">
        <span>Loading...</span>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core'
import PullDown from '@better-scroll/pull-down'
import PullUp from '@better-scroll/pull-up'
import Slide from '@better-scroll/slide'

BScroll.use(PullDown)
BScroll.use(PullUp)
BScroll.use(Slide)

const BASE = 2
const TIME_BOUNCE = 700
const REQUEST_TIME = 1000
const THRESHOLD = 50
const STOP = 56

export default {
  data() {
    return {
      beforePullDown: true,
      isPullingDown: false,
      isPullingUp: false,
      dataList: new Array(BASE),
      stopPullup: false
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
          threshold: -THRESHOLD
        },
        // slide options
        slide: {
          threshold: 5,
          disableSetHeight: true,
          autoplay: false,
          loop: false
        }
      })
      // listening evnets
      this.bscroll.on('pullingDown', this.pullingDownHandler)
      this.bscroll.on('pullingUp', this.pullingUpHandler)
      this.bscroll.on('scroll', this.scrollHandler)
    },
    // scroll event handler
    scrollHandler(pos) {
      if (pos.y >= 0) {
        const pullDownEle = this.$refs.pulldown
        const { height: pulldownH } = getComputedStyle(pullDownEle, null)
        pullDownEle.style.transform = `translateY(${-parseInt(pulldownH) +
          pos.y}px) translateZ(0)`
      }
      const pullupThreshold = -30
      const maxScrollY = this.bscroll.maxScrollY
      if (pos.y - maxScrollY <= pullupThreshold && this.isPullingUp) {
        this.stopPullup = true
      }
      if (pos.y - maxScrollY <= 0 && !this.stopPullup) {
        const pullUpEle = this.$refs.pullup
        const { height: pullupH } = getComputedStyle(pullUpEle, null)
        pullUpEle.style.transform = `translateY(${pos.y - maxScrollY}px) translateZ(0)`
      }
    },
    // pullingDown event handler
    async pullingDownHandler() {
      this.beforePullDown = false
      this.isPullingDown = true
      this.bscroll.enabled = false
      await this.requestData('refresh')
      this.isPullingDown = false
      this.$nextTick(() => {
        this.bscroll.finishPullDown()
        this.beforePullDown = true
        this.bscroll.enabled = true
        this.bscroll.refresh()
      })
    },
    // pullingUp event handler
    async pullingUpHandler() {
      this.isPullingUp = true
      this.bscroll.enabled = false
      await this.requestData('load')
      this.$nextTick(() => {
        this.isPullingUp = false
        this.bscroll.finishPullUp()
        this.bscroll.enabled = true
        this.bscroll.refresh()
        this.resetPullupPos()
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
    },
    resetPullupPos() {
      const pullUpEle = this.$refs.pullup
      pullUpEle.style.transform = `translateY(0px) translateZ(0)`
      pullUpEle.style.transition = 'transform 0.5s'
      this.stopPullup = false
    }
  }
}
</script>

<style lang="stylus" scoped>
.pullup-down-slide-wrapper
  height 100%
  overflow hidden

.pullup-pulldown-slide-bswrapper
  position relative
  height 100%
  overflow hidden

.pullup-down-list
  padding 0

.pullup-pulldown-slide-item
  list-style none
  // border-bottom 1px solid #ccc
  width 100%
  line-height 200px
  text-align center
  font-size 26px
  transform translate3d(0,0,0)
  backface-visibility hidden
  box-sizing: border-box

.pulldown-wrapper
  position absolute
  width 100%
  padding 20px
  box-sizing border-box
  transform translateY(-100%) translateZ(0)
  text-align center
  color #999

.pullup-wrapper
  height 40px !important
  padding 20px
  text-align center
  color #999
.page1
  background-color #D6EADF
.page2
  background-color #DDA789
.page3
  background-color #C3D899
.page0
  background-color #F2D4A7
</style>