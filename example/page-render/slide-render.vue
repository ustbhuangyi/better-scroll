<template>
  <div class="slide-render-view">
    <div class="slide-wrapper">
      <div class="slide-content">
        <slide ref="slide" :autoPlay="isAutoPlay" :loop="isLoop" :showDot="isShowDot" :interval="interval" :threshold="threshold" :speed="speed">
          <div v-for="item in data">
            <a :href="item.linkUrl">
              <img :src="item.picUrl">
            </a>
          </div>
        </slide>
      </div>
    </div>
    <div class="group">
      <switch-option class="item sub" :name="$t('slidePage.isAutoPlayTip')" :value="isAutoPlay"
                     @update:value="updateAutoPlay"></switch-option>
      <input-option v-if="isAutoPlay" class="item sub" name="interval" :value="interval"
                     @update:value="updateInterval"></input-option>
      <switch-option class="item sub" :name="$t('slidePage.isLoopTip')" :value="isLoop"
                     @update:value="updateLoop"></switch-option>
      <input-option class="item sub" name="threshold" :value="threshold"
                     @update:value="updateThreshold"></input-option>
      <input-option class="item sub" name="speed" :value="speed"
                     @update:value="updateSpeed"></input-option>
      <switch-option class="item sub" :name="$t('slidePage.isShowDotTip')" :value="isShowDot"
                     @update:value="updateShowDot"></switch-option>
      <free-option class="free-option item" :name="$t('slidePage.pageTurn')" >
        <button @click="turnToPrevFun" :class="{ 'active': turnToPrev }"><<</button>
        <button @click="turnToNextFun" :class="{ 'active': turnToNext }">>></button>
      </free-option>
      <free-option class="free-option item" :name="$t('slidePage.changeData')" >
        <button @click="changeData" class="change-button">{{$t('slidePage.click')}}</button>
      </free-option>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Slide from 'example/components/slide/slide.vue'
  import SwitchOption from 'example/components/switch-option/switch-option.vue'
  import InputOption from 'example/components/input-option/input-option.vue'
  import FreeOption from 'example/components/free-option/free-option.vue'

  const items = [
    [
      {
        linkUrl: 'http://y.qq.com/w/album.html?albummid=0044K2vN1sT5mE',
        picUrl: 'http://y.gtimg.cn/music/photo_new/T003R720x288M000001YCZlY3aBifi.jpg',
        id: 11351
      },
      {
        linkUrl: 'https://y.qq.com/m/digitalbum/gold/index.html?_video=true&id=2197820&g_f=shoujijiaodian',
        picUrl: 'http://y.gtimg.cn/music/photo_new/T003R720x288M000004ckGfg3zaho0.jpg',
        id: 11372
      }
    ],
    [
      {
        linkUrl: 'http://y.qq.com/w/album.html?albummid=001tftZs2RX1Qz',
        picUrl: 'http://y.gtimg.cn/music/photo_new/T003R720x288M00000236sfA406cmk.jpg',
        id: 11378
      },
      {
        linkUrl: 'https://y.qq.com/msa/218/0_4085.html',
        picUrl: 'http://y.gtimg.cn/music/photo_new/T003R720x288M000001s0BXx3Zxcwb.jpg',
        id: 11375
      },
      {
        linkUrl: 'https://y.qq.com/m/digitalbum/gold/index.html?_video=true&id=2195876&g_f=shoujijiaodian',
        picUrl: 'http://y.gtimg.cn/music/photo_new/T003R720x288M000002cwng4353HKz.jpg',
        id: 11287
      }
    ]
  ]

  const COMPONENT_NAME = 'slide-render'
  export default {
    name: COMPONENT_NAME,
    computed: {
      data() {
        return items[this.index]
      }
    },
    data() {
      return {
        index: 0,
        turnToPrev: false,
        turnToNext: false,
        isAutoPlay: true,
        isLoop: true,
        isShowDot: true,
        speed: 400,
        threshold: 0.3,
        interval: 4000
      }
    },
    methods: {
      changeData() {
        this.index = (this.index + 1) % 2
        this.turnToPrev = false
        this.turnToNext = false
      },
      updateAutoPlay(val) {
        this.isAutoPlay = val
      },
      updateInterval(val) {
        if (val) {
          this.interval = +val
        }
      },
      updateLoop(val) {
        this.isLoop = val
      },
      updateShowDot(val) {
        this.isShowDot = val
      },
      turnToPrevFun() {
        if (!this.$refs.slide.slide.isInTransition) {
          this.turnTo(1)
          this.$refs.slide.prev()
        }
      },
      turnToNextFun() {
        if (!this.$refs.slide.slide.isInTransition) {
          this.turnTo(2)
          this.$refs.slide.next()
        }
      },
      turnTo(index) {
        index === 1 ? this.turnToPrev = true : this.turnToPrev = false
        index === 2 ? this.turnToNext = true : this.turnToNext = false
      },
      updateThreshold(val) {
        if (val) {
          this.threshold = +val
        }
      },
      updateSpeed(val) {
        if (val) {
          this.speed = +val
        }
      }
    },
    watch: {
      index() {
        this.$refs.slide.update()
      }
    },
    components: {
      Slide,
      SwitchOption,
      FreeOption,
      InputOption
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  @import "~common/stylus/variable.styl"
  .slide-render-view
    .slide-wrapper
      position: relative
      width: 100%
      padding-top: 40%
      margin-bottom: 10px
      overflow: hidden
      .slide-content
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
    .group
      margin-bottom: 1rem
      border: 1px solid rgba(0, 0, 0, .1)
      border-radius: $radius-size-medium
      background: #fff
      .item
        height: 3.2rem
        border-bottom: 1px solid rgba(0, 0, 0, .1)
        &.sub
          font-size: $fontsize-medium
          /*box-shadow: 0 1px 1px 1px #eee inset*/
      .item:last-child
        border-bottom: none
      .item:nth-child(even)
        background-color: rgba(0,0,0,0.04)
  .free-option
    .button-container
      button
        padding: 5px
        border-radius: 5px
        background-color: #fff
        outline: none
      .active
        background-color: #3b99fc
        border: #fff 1px solid
        color: #fff
      .change-button
        background-color: #3b99fc
        padding: 5px 10px
        color: #fff
</style>
