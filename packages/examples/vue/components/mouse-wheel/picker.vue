<template>
  <div class="container">
    <ul class="example-list">
      <li class="example-item" @click="show">
          <span class="open">{{selectedText}}</span>
      </li>
    </ul>
    <transition name="picker-fade">
      <div class="picker" v-show="state===1" @touchmove.prevent @click="_cancel">
        <transition name="picker-move">
          <div class="picker-panel" v-show="state===1" @click.stop>
            <div class="picker-choose border-bottom-1px">
              <span class="cancel" @click="_cancel">Cancel</span>
              <span class="confirm" @click="_confirm">Confirm</span>
              <h1 class="picker-title">Title</h1>
            </div>
            <div class="picker-content">
              <div class="mask-top border-bottom-1px"></div>
              <div class="mask-bottom border-top-1px"></div>
              <div class="wheel-wrapper" ref="wheelWrapper">
                <div class="wheel">
                  <ul class="wheel-scroll">
                    <li
                      v-for="(item, index) in pickerData" :key="index"
                      :class="{'wheel-disabled-item':item.disabled}"
                      class="wheel-item">{{item.text}}</li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="picker-footer"></div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from '@better-scroll/core'
  import Wheel from '@better-scroll/wheel'
  import MouseWheel from '@better-scroll/mouse-wheel'
  BScroll.use(Wheel)
  BScroll.use(MouseWheel)

  const STATE_HIDE = 0
  const STATE_SHOW = 1

  const COMPONENT_NAME = 'picker'
  const EVENT_SELECT = 'select'
  const EVENT_CANCEL = 'cancel'
  const EVENT_CHANGE = 'change'

  const DATA = [
    {
      text: 'Venomancer',
      value: 1,
      disabled: 'wheel-disabled-item'
    }, {
      text: 'Nerubian Weaver',
      value: 2
    },
    {
      text: 'Spectre',
      value: 3
    },
    {
      text: 'Juggernaut',
      value: 4
    },
    {
      text: 'Karl',
      value: 5
    },
    {
      text: 'Zeus',
      value: 6
    },
    {
      text: 'Witch Doctor',
      value: 7
    }, {
      text: 'Lich',
      value: 8
    },
    {
      text: 'Oracle',
      value: 9
    },
    {
      text: 'Earthshaker',
      value: 10
    }
  ]

  export default {
    name: COMPONENT_NAME,
    data() {
      return {
        state: STATE_HIDE,
        selectedIndex: 2,
        selectedText: 'open',
        pickerData: DATA
      }
    },
    methods: {
      _confirm() {
        if (this._isMoving()) {
          return
        }
        this.hide()

        const currentSelectedIndex = this.wheel.getSelectedIndex()
        this.selectedIndex = currentSelectedIndex
        this.selectedText = this.pickerData[this.selectedIndex].text
        this.$emit(EVENT_SELECT, currentSelectedIndex)
      },
      _cancel() {
        this.hide()
        this.$emit(EVENT_CANCEL)
      },
      _isMoving() {
        return this.wheel.pending
      },
      show() {
        if (this.state === STATE_SHOW) {
          return
        }
        this.state = STATE_SHOW
        if (!this.wheel) {
          // waiting for DOM rendered
          this.$nextTick(() => {
            const wrapper = this.$refs.wheelWrapper.children[0]
            this._createWheel(wrapper)
          })
        } else {
          this.wheel.enable()
          this.wheel.wheelTo(this.selectedIndex)
        }
      },
      hide() {
        this.state = STATE_HIDE
        // if wheel is in animation, clear timer in it
        this.wheel.disable()
      },
      refresh() {
        this.$nextTick(() => {
          this.wheel.refresh()
        })
      },
      _createWheel(wheelWrapper) {
        if (!this.wheel) {
          this.wheel = new BScroll(wheelWrapper, {
            mouseWheel: true,
            wheel: {
              selectedIndex: this.selectedIndex,
              wheelWrapperClass: 'wheel-scroll',
              wheelItemClass: 'wheel-item',
              wheelDisabledItemClass: 'wheel-disabled-item'
            },
            probeType: 3,
            useTransition: true,
          })
          this.wheel.on('scrollEnd', () => {
            console.log('scrollEnd---')
            this.$emit(EVENT_CHANGE, this.wheel.getSelectedIndex())
          })
        } else {
          this.wheel.refresh()
        }
        return this.wheel
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

  /* reset */
  ul
    list-style none
    padding 0

  .example-list
    display: flex
    justify-content: space-between
    flex-wrap: wrap
    margin: 2rem

    .example-item
      background-color white
      padding: 0.8rem
      border: 1px solid rgba(0, 0, 0, .1)
      box-shadow: 0 1px 2px 0 rgba(0,0,0,0.1)
      text-align: center
      margin-bottom: 1rem
      flex: 1
      &.placeholder
        visibility: hidden
        height: 0
        margin: 0
        padding: 0

  .picker
    position: fixed
    left: 0
    top: 0
    z-index: 100
    width: 100%
    height: 100%
    overflow: hidden
    text-align: center
    font-size: 14px
    background-color: rgba(37, 38, 45, .4)
    &.picker-fade-enter, &.picker-fade-leave-active
      opacity: 0
    &.picker-fade-enter-active, &.picker-fade-leave-active
      transition: all .3s ease-in-out

    .picker-panel
      position: absolute
      z-index: 600
      bottom: 0
      width: 100%
      height: 273px
      background: white
      &.picker-move-enter, &.picker-move-leave-active
        transform: translate3d(0, 273px, 0)
      &.picker-move-enter-active, &.picker-move-leave-active
        transition: all .3s ease-in-out
      .picker-choose
        position: relative
        height: 60px
        color: #999
        .picker-title
          margin: 0
          line-height: 60px
          font-weight: normal
          text-align: center
          font-size: 18px
          color: #333
        .confirm, .cancel
          position: absolute
          top: 6px
          padding: 16px
          font-size: 14px
        .confirm
          right: 0
          color: #007bff
          &:active
            color: #5aaaff
        .cancel
          left: 0
          &:active
            color: #c2c2c2
      .picker-content
        position: relative
        top: 20px
        .mask-top, .mask-bottom
          z-index: 10
          width: 100%
          height: 68px
          pointer-events: none
          transform: translateZ(0)
        .mask-top
          position: absolute
          top: 0
          background: linear-gradient(to top, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.8))
        .mask-bottom
          position: absolute
          bottom: 1px
          background: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.8))
      .wheel-wrapper
        display: flex
        padding: 0 16px
        .wheel
          -ms-flex: 1 1 0.000000001px
          -webkit-box-flex: 1
          -webkit-flex: 1
          flex: 1
          -webkit-flex-basis: 0.000000001px
          flex-basis: 0.000000001px
          width: 1%
          height: 173px
          overflow: hidden
          font-size: 18px
          .wheel-scroll
            padding: 0
            margin-top: 68px
            line-height: 36px
            list-style: none
            .wheel-item
              list-style: none
              height: 36px
              overflow: hidden
              white-space: nowrap
              color: #333
              &.wheel-disabled-item
                opacity: .2;
    .picker-footer
      height: 20px
</style>
