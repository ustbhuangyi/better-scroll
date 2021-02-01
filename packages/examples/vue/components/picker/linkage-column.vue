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
                <div class="wheel" v-for="(data, index) in pickerData" :key="index">
                  <ul class="wheel-scroll">
                    <li
                      v-for="item in data" :key="item.value"
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
  BScroll.use(Wheel)

  const STATE_HIDE = 0
  const STATE_SHOW = 1

  const COMPONENT_NAME = 'picker'
  const EVENT_SELECT = 'select'
  const EVENT_CANCEL = 'cancel'
  const EVENT_CHANGE = 'change'

  const DATA = [
    {
      text: '北京市',
      value: '110000',
      children: [
        {
          text: "北京市",
          value: '110100'
        }
      ]
    },
    {
      text: '天津市',
      value: '120000',
      children: [
        {
          text: "天津市",
          value: '120000'
        }
      ]
    },
    {
      text: '河北省',
      value: '130000',
      children: [
        {
          text: '石家庄市',
          value: '130100'
        },
        {
          text: '唐山市',
          value: '130200'
        },
        {
          text: '秦皇岛市',
          value: '130300'
        },
        {
          text: '邯郸市',
          value: '130400'
        },
        {
          text: '邢台市',
          value: '130500'
        },
        {
          text: '保定市',
          value: '130600'
        },
        {
          text: '张家口市',
          value: '130700'
        },
        {
          text: '承德市',
          value: '130800'
        }
      ]
    },
    {
      text: '山西省',
      value: '140000',
      children: [
        {
          text: '太原市',
          value: '140100'
        },
        {
          text: '大同市',
          value: '140200'
        },
        {
          text: '阳泉市',
          value: '140300'
        },
        {
          text: '长治市',
          value: '140400'
        },
        {
          text: '晋城市',
          value: '140500'
        },
        {
          text: '朔州市',
          value: '140600'
        },
        {
          text: '晋中市',
          value: '140700'
        }
      ]
    }
  ]

  export default {
    name: COMPONENT_NAME,
    data() {
      return {
        state: STATE_HIDE,
        selectedIndexPair: [0, 0],
        selectedText: 'open',
        pickerData: []
      }
    },
    created () {
      // generate data
      this._loadPickerData(this.selectedIndexPair, undefined /* no prevSelectedIndex due to instantiating */)
    },
    methods: {
      _loadPickerData (newIndexPair, oldIndexPair) {
        let provinces
        let cities
        // first instantiated
        if (!oldIndexPair) {
          provinces = DATA.map(({ value, text }) => ({ value, text }))
          cities = DATA[newIndexPair[0]].children
          this.pickerData = [provinces, cities]
        } else {
          // provinces'index changed, refresh cities data
          if (newIndexPair[0] !== oldIndexPair[0]) {
            cities = DATA[newIndexPair[0]].children
            this.pickerData.splice(1, 1, cities)
            // Since cities data changed
            // refresh better-scroll to recaculate scrollHeight
            this.$nextTick(() => {
              this.wheels[1].refresh()
            })
          }
        }
      },
      _confirm() {
        this.wheels.forEach(wheel => {
          /*
          * if bs is scrolling, force it stop at the nearest wheel-item
          * or you can use 'restorePosition' method as the below
          */
          // wheel.stop()
          /*
          * if bs is scrolling, restore it to the start position
          * it is same with iOS picker and web Select element implementation
          * supported at v2.1.0
          */
          wheel.restorePosition()
        })
        this.hide()

        const currentSelectedIndexPair = this.selectedIndexPair = this.wheels.map(wheel => {
          return wheel.getSelectedIndex()
        })

        this.selectedText = this.pickerData.map((data, i) => {
          const index = currentSelectedIndexPair[i]
          return `${data[index].text}-${index}`
        }).join('__')
        this.$emit(EVENT_SELECT, currentSelectedIndexPair)
      },
      _cancel() {
        /*
         * if bs is scrolling, restore it to the start position
         * it is same with iOS picker and web Select element implementation
         * supported at v2.1.0
        */
        this.wheels.forEach(wheel => {
          wheel.restorePosition()
        })
        this.hide()
        this.$emit(EVENT_CANCEL)
      },
      show() {
        if (this.state === STATE_SHOW) {
          return
        }
        this.state = STATE_SHOW
        if (!this.wheels) {
          this.$nextTick(() => {
            this.wheels = []
            let wheelWrapper = this.$refs.wheelWrapper
            for (let i = 0; i < this.pickerData.length; i++) {
              this._createWheel(wheelWrapper, i)
            }
          })
        }
      },
      hide() {
        this.state = STATE_HIDE
      },
      _createWheel(wheelWrapper, i) {
        const wheels = this.wheels
        if (!wheels[i]) {
          wheels[i] = new BScroll(wheelWrapper.children[i], {
            wheel: {
              selectedIndex: this.selectedIndexPair[i],
              wheelWrapperClass: 'wheel-scroll',
              wheelItemClass: 'wheel-item'
            },
            probeType: 3
          })
          // when any of wheels'scrolling ended , refresh data
          let prevSelectedIndexPair = this.selectedIndexPair
          wheels[i].on('scrollEnd', () => {
            const currentSelectedIndexPair = wheels.map(wheel => wheel.getSelectedIndex())
            this._loadPickerData(currentSelectedIndexPair, prevSelectedIndexPair)
            prevSelectedIndexPair = currentSelectedIndexPair
            this.$emit(EVENT_CHANGE, i, this.wheels[i].getSelectedIndex())
          })
        } else {
          wheels[i].refresh()
        }
        return wheels[i]
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

  /* reset */
  ul
    list-style none
    padding 0

  .border-bottom-1px, .border-top-1px
    position: relative
    &:before, &:after
      content: ""
      display: block
      position: absolute
      transform-origin: 0 0
  .border-bottom-1px
    &:after
      border-bottom: 1px solid #ebebeb
      left: 0
      bottom: 0
      width: 100%
      transform-origin: 0 bottom
  .border-top-1px
    &:before
      border-top: 1px solid #ebebeb
      left: 0
      top: 0
      width: 100%
      transform-origin: 0 top
  @media (-webkit-min-device-pixel-ratio: 2), (min-device-pixel-ratio: 2)
    .border-top-1px
      &:before
        width: 200%
        transform: scale(.5) translateZ(0)
    .border-bottom-1px
      &:after
        width: 200%
        transform: scale(.5) translateZ(0)

  @media (-webkit-min-device-pixel-ratio: 3), (min-device-pixel-ratio: 3)
    .border-top-1px
      &:before
        width: 300%
        transform: scale(.333) translateZ(0)
    .border-bottom-1px
      &:after
        width: 300%
        transform: scale(.333) translateZ(0)

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
          flex: 1
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
