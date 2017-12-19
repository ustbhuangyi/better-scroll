<template>
  <div class="slide-render-view">
    <div class="slide-wrapper">
      <div class="slide-content">
        <slide ref="slide">
          <div v-for="item in data">
            <a :href="item.linkUrl">
              <img :src="item.picUrl">
            </a>
          </div>
        </slide>
      </div>
    </div>
    <button @click="changeData">click me and change data</button>
  </div>
</template>

<script type="text/ecmascript-6">
  import Slide from 'example/components/slide/slide.vue'

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
        index: 0
      }
    },
    methods: {
      changeData() {
        this.index = (this.index + 1) % 2
      }
    },
    watch: {
      index() {
        this.$refs.slide.update()
      }
    },
    components: {
      Slide
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
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
</style>
