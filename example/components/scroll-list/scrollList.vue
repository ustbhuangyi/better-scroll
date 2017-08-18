<template>
  <div ref="wrapper" class="list-wrapper">
    <ul class="list-content">
      <li @click="clickItem($event,item)" class="list-item" v-for="item in items">{{item}}</li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'scroll/index'

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
          '我是第一行',
          '我是第二行',
          '我是第三行',
          '我是第四行',
          '我是第五行',
          '我是第六行',
          '我是第七行',
          '我是第八行',
          '我是第九行',
          '我是第十行',
          '我是第十一行',
          '我是第十二行',
          '我是第十三行',
          '我是第十四行',
          '我是第十五行',
          '我是第十六行',
          '我是第十七行',
          '我是第十八行',
          '我是第十九行',
          '我是第二十行',
          '我是第二十一行',
          '我是第二十二行',
          '我是第二十三行',
          '我是第二十四行',
          '我是第二十五行',
          '我是第二十六行',
          '我是第二十七行',
          '我是第二十八行',
          '我是第二十九行'
        ]
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

        let params = {
          probeType: this.probeType,
          click: this.click,
          eventPassthrough: this.direction === DIRECTION_V ? DIRECTION_H : DIRECTION_V
        }

        if (this.scrollbar) {
          Object.assign(params, {
            scrollbar: {
              fade: this.scrollbarFade
            }
          })
        }

        this.scroll = new BScroll(this.$refs.wrapper, params)

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
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this.refresh()
        }, this.refreshDelay)
      },
      scrollbar: function () {
        this.scroll.destroy()
        this._initScroll()
      }
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

</style>
