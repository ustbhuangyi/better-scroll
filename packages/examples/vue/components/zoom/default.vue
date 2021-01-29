<template>
  <div class="zoom-default">
    <div class="zoom-wrapper" ref="zoom">
      <div class="zoom-items">
        <div class="grid-item" v-for="num in nums" :key="num">{{num}}</div>
      </div>
    </div>
    <div class="btn-wrap">
      <button class="zoom-half" @click="zoomTo(0.5)">zoomTo:0.5</button>
      <button class="zoom-original" @click="zoomTo(1)">zoomTo:1</button>
      <button class="zoom-double" @click="zoomTo(2)">zoomTo:2</button>
    </div>
    <div class="linkwork-wrap">
      <p>changing with zooming action</p>
      <div class="linkwork-block" :style="{transform: linkworkTransform}"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from '@better-scroll/core'
  import Zoom from '@better-scroll/zoom'

  BScroll.use(Zoom)

  const COMPONENT_NAME = 'zoom'

  export default {
    name: COMPONENT_NAME,
    data() {
      return {
        nums: 16,
        linkworkTransform: 'scale(1)'
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.zoom = new BScroll(this.$refs.zoom, {
          freeScroll: true,
          scrollX: true,
          scrollY: true,
          disableMouse: true,
          useTransition: true,
          zoom: {
            start: 1.5,
            min: 0.5,
            max: 3,
            initialOrigin: ['center', 'center']
          }
        })

        this.zoom.on('zooming', ({ scale }) => {
          this.linkworkTransform = `scale(${scale})`
        })

        this.zoom.on('zoomEnd', ({ scale }) => {
          console.log(scale)
        })
      },
      zoomTo(value) {
        this.zoom.zoomTo(value, 'center', 'center')
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">

.zoom-default
  .zoom-wrapper
    width 100%
    overflow hidden
    .zoom-items
      display flex
      flex-direction row
      flex-wrap wrap
      align-content space-between
      .grid-item
        flex 1 1 25%
        box-sizing border-box
        height 52px
        line-height 52px
        border 1px solid #eee
        text-align center
        &:nth-child(2n)
          background-color #b3d4a8
        &:nth-child(2n+1)
          background-color #b6b7a3
  .btn-wrap
    margin-top 20px
    display flex
    justify-content center
    button
      margin 0 10px
      padding 10px
      color #fff
      border-radius 4px
      background-color #666
  .linkwork-wrap
    margin-top 50px
    p
      margin 10px 0
      font-size 16px
      font-weight bold
      text-align center
  .linkwork-block
    margin 10px auto
    width 60px
    height 60px
    border-radius 50%
    background-image url("./good.svg")
    background-size 100%
</style>
