<template>
  <div class="pulldown">
    <div ref="bsWrapper" class="pulldown-bswrapper">
      <div class="pulldown-scroller">
        <div class="pulldown-wrapper">
          <div v-show="beforePullDown">
            <span>继续下拉更新数据</span>
          </div>
          <div v-show="!beforePullDown">
            <div v-show="isPullingDown">
              <span>努力加载中...</span>
            </div>
            <div v-show="!isPullingDown"><span>加载成功</span></div>
          </div>
        </div>
        <ul class="pulldown-list">
          <li v-for="i of dataList" :key="i" class="pulldown-list-item">
            {{ `I am item ${i} ` }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import BScroll from '@better-scroll/core'
  import PullDown from '@better-scroll/pull-down'

  BScroll.use(PullDown)

  function getOneRandomList() {
    const arr = Array.apply(null, {length: 30}).map((...args) => args[1])
    return arr.sort(() => Math.random() - 0.5)
  }

  const TIME_BOUNCE = 800
  const TIME_STOP = 600
  const THRESHOLD = 70
  const STOP = 56

  export default {
    data() {
      return {
        beforePullDown: true,
        isPullingDown: false,
        dataList: getOneRandomList()
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
          pullDownRefresh: {
            threshold: THRESHOLD,
            stop: STOP
          }
        })

        this.bscroll.on('pullingDown', this.pullingDownHandler)
        this.bscroll.on('scroll', this.scrollHandler)
      },
      scrollHandler(pos) {
        console.log(pos.y)
      },
      async pullingDownHandler() {
        this.beforePullDown = false
        this.isPullingDown = true

        await this.requestData()

        this.isPullingDown = false
        this.finishPullDown()
      },
      async finishPullDown() {
        const stopTime = TIME_STOP
        await new Promise(resolve => {
          setTimeout(() => {
            this.bscroll.finishPullDown()
            resolve()
          }, stopTime)
        })
        setTimeout(() => {
          this.beforePullDown = true
          this.bscroll.refresh()
        }, TIME_BOUNCE)
      },
      async requestData() {
        try {
          const newData = await this.ajaxGet(/* url */)
          this.dataList = newData
        } catch (err) {
          // handle err
          console.log(err)
        }
      },
      ajaxGet(/* url */) {
        return new Promise(resolve => {
          setTimeout(() => {
            const dataList = getOneRandomList()
            resolve(dataList)
          }, 1000)
        })
      }
    }
  }
</script>

<style lang="stylus">
.pulldown
  height: 100%
.pulldown-bswrapper
  position: relative
  height: 100%
  padding: 0 10px
  border: 1px solid #ccc
  overflow: hidden
.pulldown-list-item
  padding: 10px 0
  border-bottom: 1px solid #ccc
.pulldown-wrapper
  position: absolute
  width: 100%
  transform: translateY(-100%) translateZ(0)
  padding: 20px
  text-align: center
  color: #999
</style>