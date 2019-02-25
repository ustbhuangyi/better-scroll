<template>
  <div class="slide" ref="slide">
    <div class="slide-group" ref="slideGroup">
      <slot>
      </slot>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { addClass } from 'common/js/dom'
  import BScroll from 'scroll/index'

  const COMPONENT_NAME = 'slide'

  export default {
    name: COMPONENT_NAME,
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      },
      click: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        currentPageIndex: 0
      }
    },
    mounted() {
      this.update()

      window.addEventListener('resize', () => {
        if (!this.slide || !this.slide.enabled) {
          return
        }
        clearTimeout(this.resizeTimer)
        this.resizeTimer = setTimeout(() => {
          if (this.slide.isInTransition) {
            this._onScrollEnd()
          } else {
            if (this.autoPlay) {
              this._play()
            }
          }
          this.refresh()
        }, 60)
      })
    },
    activated() {
      if (!this.slide) {
        return
      }
      this.slide.enable()
      let pageIndex = this.slide.getCurrentPage().pageY
      this.slide.goToPage(0, pageIndex, 0)
      this.currentPageIndex = pageIndex
      if (this.autoPlay) {
        this._play()
      }
    },
    deactivated() {
      this.slide.disable()
      clearTimeout(this.timer)
    },
    beforeDestroy() {
      this.slide.disable()
      clearTimeout(this.timer)
    },
    methods: {
      update() {
        if (this.slide) {
          this.slide.destroy()
        }
        this.$nextTick(() => {
          this.init()
        })
      },
      refresh() {
        this._setSlideHeight(true)
        this.slide.refresh()
      },
      next() {
        this.slide.next()
      },
      init() {
        clearTimeout(this.timer)
        this.currentPageIndex = 0
        this._setSlideHeight()
        this._initSlide()

        if (this.autoPlay) {
          this._play()
        }
      },
      _setSlideHeight(isResize) {
        this.children = this.$refs.slideGroup.children

        let height = 0
        let slideHeight = this.$refs.slide.clientHeight
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          addClass(child, 'slide-item')

          child.style.height = slideHeight + 'px'
          height += slideHeight
        }
        if (this.loop && !isResize) {
          height += 2 * slideHeight
        }
        this.$refs.slideGroup.style.height = height + 'px'
      },
      _initSlide() {
        this.slide = new BScroll(this.$refs.slide, {
          scrollX: false,
          scrollY: true,
          momentum: false,
          snap: {
            loop: this.loop,
            threshold: 0.3,
            speed: 400,
            easing: {
              style: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }
          },
          bounce: false,
          click: this.click
        })

        this.slide.on('scrollEnd', this._onScrollEnd)

        this.slide.on('touchEnd', () => {
          if (this.autoPlay) {
            this._play()
          }
        })

        this.slide.on('beforeScrollStart', () => {
          if (this.autoPlay) {
            clearTimeout(this.timer)
          }
        })
      },
      _onScrollEnd() {
        let pageIndex = this.slide.getCurrentPage().pageY
        this.currentPageIndex = pageIndex
        if (this.autoPlay) {
          this._play()
        }
      },
      _play() {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.slide.next()
        }, this.interval)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slide
    min-height: 1px
    .slide-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slide-item
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          height: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          height: 100%
</style>
