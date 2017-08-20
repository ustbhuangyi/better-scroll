<template>
  <div ref="wrapper" class="list-wrapper">
    <ul class="list-content">
      <li @click="clickItem($event,item)" class="list-item" v-for="item in items">{{item}}</li>
      <li class="pullup-wrapper" v-if="pullUpLoad">
        <div class="before-trigger" v-if="!isPullUpLoad">
          上拉加载

        </div>
        <div class="after-trigger" v-else>
          <loading></loading>
        </div>
      </li>
    </ul>
    <div class="pulldown-wrapper" v-if="pullDownRefresh">
      <div class="before-trigger" v-if="!isPullDownRefresh">
        下拉刷新

      </div>
      <div class="after-trigger" v-if="isPullDownRefresh">
        <div v-if="loading" class="loading">
          <loading></loading>
        </div>
        <div v-else>刷新成功</div>
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
        items: [
          '我是第 1 行',
          '我是第 2 行',
          '我是第 3 行',
          '我是第 4 行',
          '我是第 5 行',
          '我是第 6 行',
          '我是第 7 行',
          '我是第 8 行',
          '我是第 9 行',
          '我是第 10 行',
          '我是第 11 行',
          '我是第 12 行',
          '我是第 13 行',
          '我是第 14 行',
          '我是第 15 行',
          '我是第 16 行',
          '我是第 17 行',
          '我是第 18 行',
          '我是第 19 行',
          '我是第 20 行'
        ],
        isPullDownRefresh: false,
        loading: true,
        itemIndex: 20,
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
          this.scroll.on('pullingDown', this.pullDownHandle)
        }

        if (this.pullUpLoad) {
          this.scroll.on('pullingUp', this.pullUpHandle)
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
      clickItem(e, item) {
        console.log(`${item} is clicked}`, e)
      },
      pullDownHandle() {
        this.isPullDownRefresh = true
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.items.unshift('我是新数据: ' + +new Date())
        }, 1000)
        setTimeout(() => {
          this.scroll.finishPullDown()
          setTimeout(() => {
            this.isPullDownRefresh = false
          }, this.bounceTime || 700)
        }, 2000)
      },
      pullUpHandle() {
        let newPage = [
          '我是第 ' + ++this.itemIndex + ' 行',
          '我是第 ' + ++this.itemIndex + ' 行',
          '我是第 ' + ++this.itemIndex + ' 行',
          '我是第 ' + ++this.itemIndex + ' 行',
          '我是第 ' + ++this.itemIndex + ' 行'
        ]
        this.isPullUpLoad = true
        setTimeout(() => {
          this.items = this.items.concat(newPage)
          if (this.isPullUpLoad) {
            this.scroll.finishPullUp()
            this.isPullUpLoad = false
          }
        }, 1000)
      }
    },
    watch: {
      items: function () {
        setTimeout(() => {
          this.refresh()
        }, this.isPullDownRefresh ? 1700 : this.refreshDelay)
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
