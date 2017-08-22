<template>
  <div ref="wrapper" class="list-wrapper">
    <div>
      <slot>
        <ul class="list-content">
          <li @click="clickItem($event,item)" class="list-item" v-for="item in data">{{item}}</li>
        </ul>
      </slot>
      <slot name="pullup"
            :pullUpLoad="pullUpLoad"
            :isPullUpLoad="isPullUpLoad"
      >
        <div class="pullup-wrapper" v-if="pullUpLoad">
          <div class="before-trigger" v-if="!isPullUpLoad">
            <span>加载更多</span>
          </div>
          <div class="after-trigger" v-else>
            <loading></loading>
          </div>
        </div>
      </slot>
    </div>
    <slot name="pulldown"
          :pullDownRefresh="pullDownRefresh"
          :pullDownStyle="pullDownStyle"
          :beforePullDown="beforePullDown"
          :pulling="pulling"
          :bubbleY="bubbleY"
    >
      <div ref="pulldown" class="pulldown-wrapper" :style="pullDownStyle" v-if="pullDownRefresh">
        <div class="before-trigger" v-if="beforePullDown">
          <bubble :y="bubbleY"></bubble>
          <span>下拉刷新</span>
        </div>
        <div class="after-trigger" v-else>
          <div v-if="pulling" class="loading">
            <loading></loading>
          </div>
          <div v-else><span>刷新成功</span></div>
        </div>
      </div>
    </slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from '../../../src/index'
  import Loading from '../loading/loading.vue'
  import Bubble from '../bubble/bubble.vue'

  const COMPONENT_NAME = 'scroll-list'
  const DIRECTION_H = 'horizontal'
  const DIRECTION_V = 'vertical'

  export default {
    name: COMPONENT_NAME,
    props: {
      data: {
        type: Array,
        default: []
      },
      scrollbar: {
        type: Boolean,
        default: false
      },
      pullDownRefresh: {
        type: Boolean,
        default: false
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      },
      scrollbarFade: {
        type: Boolean,
        default: false
      },
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: false
      },
      listenScroll: {
        type: Boolean,
        default: false
      },
      pullup: {
        type: Boolean,
        default: false
      },
      beforeScroll: {
        type: Boolean,
        default: false
      },
      refreshDelay: {
        type: Number,
        default: 20
      },
      direction: {
        type: String,
        default: DIRECTION_V
      }
    },
    data() {
      return {
        beforePullDown: true,
        isPullingDown: false,
        pulling: false,
        isPullUpLoad: false,
        bubbleY: 0,
        pullDownStyle: ''
      }
    },
    created() {
      this.pulldownInitTop = -50
    },
    mounted() {
      setTimeout(() => {
        this._initScroll()
      }, 20)
    },
    methods: {
      _initScroll() {
        if (!this.$refs.wrapper) {
          return
        }

        let options = {
          probeType: this.probeType,
          click: this.click,
          scrollY: this.direction === DIRECTION_V,
          scrollX: this.direction === DIRECTION_H,
          scrollbar: this.scrollbar,
          pullDownRefresh: this.pullDownRefresh,
          pullUpLoad: this.pullUpLoad
        }

        this.scroll = new BScroll(this.$refs.wrapper, options)

        if (this.listenScroll) {
          this.scroll.on('scroll', (pos) => {
            this.$emit('scroll', pos)
          })
        }

        if (this.beforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            this.$emit('beforeScroll')
          })
        }

        if (this.pullDownRefresh) {
          this.scroll.on('pullingDown', () => {
            this.$emit('pullingDown')
            this.beforePullDown = false
            this.isPullingDown = true
            this.pulling = true
          })

          this.scroll.on('scroll', (pos) => {
            if (this.beforePullDown) {
              this.bubbleY = Math.max(0, pos.y + this.pulldownInitTop)
              this.pullDownStyle = `transitionDuration:0;top:${Math.min(pos.y + this.pulldownInitTop, 10)}px`
            } else {
              this.bubbleY = 0
            }
          })
        }

        if (this.pullUpLoad) {
          this.scroll.on('pullingUp', () => {
            this.$emit('pullingUp')
            this.isPullUpLoad = true
          })
        }
      },
      disable() {
        this.scroll && this.scroll.disable()
      },
      enable() {
        this.scroll && this.scroll.enable()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      },
      finishPullDown() {
        this.scroll && this.scroll.finishPullDown()
      },
      finishPullUp() {
        this.scroll && this.scroll.finishPullUp()
      },
      clickItem(e, item) {
        console.log(`${item} is clicked}`, e)
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          if (this.pullDownRefresh && this.isPullingDown) {
            this.pulling = false
            setTimeout(() => {
              this.finishPullDown()
              this.isPullingDown = false
              setTimeout(() => {
                this.beforePullDown = true
                this.refresh()
              }, this.scroll.options.bounceTime)
            }, 600)
          } else if (this.pullUpLoad && this.isPullUpLoad) {
            this.isPullUpLoad = false
            this.finishPullUp()
            this.refresh()
          } else {
            this.refresh()
          }
        }, this.refreshDelay)
      },
      isPullingDown(val) {
        if (!val) {
          this.pullDownStyle = `top:${this.pulldownInitTop}px;transitionDuration:700ms;transitionTimingFunction:cubic-bezier(0.165, 0.84, 0.44, 1)`
        }
      },
      scrollbar() {
        this.scroll.destroy()
        this._initScroll()
      },
      pullDownRefresh() {
        this.scroll.destroy()
        this._initScroll()
      },
      pullUpLoad() {
        this.scroll.destroy()
        this._initScroll()
      }
    },
    components: {
      Loading,
      Bubble
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .list-wrapper
    position: absolute
    left: 0
    top: 0
    right: 0
    bottom: 0
    overflow: hidden
    background: #fff
    .list-content
      position: relative
      z-index: 10
      background: #fff
      .list-item
        height: 60px
        line-height: 60px
        font-size: 18px
        padding-left: 20px
        border-bottom: 1px solid #e5e5e5
    .pulldown-wrapper
      position: absolute
      width: 100%
      left: 0
      display: flex
      justify-content center
      align-items center
      transition: all
      .after-trigger
        margin-top: 10px
    .pullup-wrapper
      width: 100%
      display: flex
      justify-content center
      align-items center
      padding: 1rem 0

</style>
