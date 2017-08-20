<template>
  <div ref="wrapper" class="list-wrapper">
    <ul class="list-content">
      <li @click="clickItem($event,item)" class="list-item" v-for="item in data">{{item}}</li>
      <li class="pullup-wrapper" v-if="pullUpLoad">
        <div class="before-trigger" v-if="!isPullUpLoad">
          <span>加载更多</span>
        </div>
        <div class="after-trigger" v-else>
          <loading></loading>
        </div>
      </li>
    </ul>
    <div name="pulldown" class="pulldown-wrapper" v-if="pullDownRefresh">
      <div class="before-trigger" v-if="!isPullDownRefresh">
        <span>下拉刷新</span>
      </div>
      <div class="after-trigger" v-else>
        <div v-if="loading" class="loading">
          <loading></loading>
        </div>
        <div v-else><span>刷新成功</span></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from '../../../src/index'
  import Loading from '../loading/loading.vue'

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
        isPullDownRefresh: false,
        loading: false,
        isPullUpLoad: false
      }
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
          pullDownRefresh: this.pullDownRefresh ? {stop: 40} : false,
          pullUpLoad: this.pullUpLoad
        }

        this.scroll = new BScroll(this.$refs.wrapper, options)

        if (this.listenScroll) {
          this.scroll.on('scroll', (pos) => {
            this.$emit('scroll', pos)
          })
        }

        if (this.pullup) {
          this.scroll.on('scrollEnd', () => {
            if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
              this.$emit('scrollToEnd')
            }
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
            this.isPullDownRefresh = true
            this.loading = true
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
      data: function () {
        setTimeout(() => {
          if (this.pullDownRefresh && this.isPullDownRefresh) {
            this.loading = false
            this.finishPullDown()
            setTimeout(() => {
              this.isPullDownRefresh = false
              this.refresh()
            }, this.scroll.options.bounceTime)
          } else if (this.pullUpLoad && this.isPullUpLoad) {
            this.isPullUpLoad = false
            this.finishPullUp()
            this.refresh()
          } else {
            this.refresh()
          }
        }, this.refreshDelay)
      },
      scrollbar: function () {
        this.scroll.destroy()
        this._initScroll()
      },
      pullDownRefresh: function () {
        this.scroll.destroy()
        this._initScroll()
      },
      pullUpLoad: function () {
        this.scroll.destroy()
        this._initScroll()
      }
    },
    components: {
      Loading
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
      top: 0
      display: flex
      justify-content center
      align-items center
      padding: 10px 0
    .pullup-wrapper
      width: 100%
      display: flex
      justify-content center
      align-items center
      padding: 1rem 0

</style>
