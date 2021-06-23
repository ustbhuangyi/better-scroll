<template>
  <div class="pulldown-sina">
    <div
      class="pulldown-bswrapper"
      ref="bsWrapper"
    >
      <div class="pulldown-scroller">
        <div class="pulldown-wrapper">
          <div v-html="tipText"></div>
        </div>
        <ul class="pulldown-list">
          <li
            :key="i"
            class="pulldown-list-item"
            v-for="i of dataList"
          >{{ `I am item ${i} ` }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core'
import PullDown from '@better-scroll/pull-down'

BScroll.use(PullDown)

function generateData() {
  const BASE = 30
  const begin = BASE * STEP
  const end = BASE * (STEP + 1)
  let ret = []
  for (let i = end; i > begin; i--) {
    ret.push(i)
  }
  return ret
}

// pulldownRefresh state
const PHASE = {
  moving: {
    enter: 'enter',
    leave: 'leave'
  },
  fetching: 'fetching',
  succeed: 'succeed'
}
const TIME_BOUNCE = 800
const REQUEST_TIME = 2000
const THRESHOLD = 70
const STOP = 56
let STEP = 0
const ARROW_BOTTOM = '<svg width="16" height="16" viewBox="0 0 512 512"><path fill="currentColor" d="M367.997 338.75l-95.998 95.997V17.503h-32v417.242l-95.996-95.995l-22.627 22.627L256 496l134.624-134.623l-22.627-22.627z"></path></svg>'
const ARROW_UP = '<svg width="16" height="16" viewBox="0 0 512 512"><path fill="currentColor" d="M390.624 150.625L256 16L121.376 150.625l22.628 22.627l95.997-95.998v417.982h32V77.257l95.995 95.995l22.628-22.627z"></path></svg>'

export default {
  data() {
    return {
      tipText: '',
      isPullingDown: false,
      dataList: generateData()
    }
  },
  mounted() {
    this.initBscroll()
  },
  methods: {
    initBscroll() {
      this.bscroll = new BScroll(this.$refs.bsWrapper, {
        scrollY: true,
        bounceTime: TIME_BOUNCE,
        useTransition: false,
        pullDownRefresh: {
          threshold: THRESHOLD,
          stop: STOP
        }
      })

      this.bscroll.on('pullingDown', this.pullingDownHandler)
      this.bscroll.on('scrollEnd', e => {
        console.log('scrollEnd')
      })
      // v2.4.0 supported
      this.bscroll.on('enterThreshold', () => {
        this.setTipText(PHASE.moving.enter)
      })
      this.bscroll.on('leaveThreshold', () => {
        this.setTipText(PHASE.moving.leave)
      })
    },
    async pullingDownHandler() {
      this.setTipText(PHASE.fetching)
      STEP += 1
      await this.getData()

      this.setTipText(PHASE.succeed)
      // tell BetterScroll to finish pull down
      this.bscroll.finishPullDown()
      // waiting for BetterScroll's bounceAnimation then refresh size
      setTimeout(() => {
        this.bscroll.refresh()
      }, TIME_BOUNCE + 50)
    },
    async getData() {
      const newData = await this.mockFetchData()
      this.dataList = newData.concat(this.dataList)
    },
    mockFetchData() {
      return new Promise(resolve => {
        setTimeout(() => {
          const dataList = generateData()
          resolve(dataList)
        }, REQUEST_TIME)
      })
    },
    setTipText(phase = PHASE.default) {
      const TEXTS_MAP = {
        'enter': `${ARROW_BOTTOM} Pull down`,
        'leave': `${ARROW_UP} Release`,
        'fetching': 'Loading...',
        'succeed': 'Refresh succeed'
      }
      this.tipText = TEXTS_MAP[phase]
    }
  }
}
</script>

<style lang="stylus" scoped>
.pulldown-sina
  height 100%

.pulldown-bswrapper
  position relative
  height 100%
  padding 0 10px
  border 1px solid #ccc
  overflow hidden

.pulldown-list
  padding 0

.pulldown-list-item
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
</style>
