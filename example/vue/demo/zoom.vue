<template>
  <div class="zoom-wrapper" ref="zoom">
    <div class="zoom-items">
      <p>I am the No.1 line</p>
      <p>I am the No.2 line</p>
      <p>I am the No.3 line</p>
      <p>I am the No.4 line</p>
      <p>I am the No.5 line</p>
      <p>I am the No.6 line</p>
      <p>I am the No.7 line</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from '../../../src/index.ts'
  import ZoomPlugin from '../../../src/plugins/zoom'

  BScroll.use(ZoomPlugin)
  const COMPONENT_NAME = 'zoom'

  export default {
    name: COMPONENT_NAME,
    props: {
      zoomOpt: {
        type: Object
      }
    },
    data() {
      return {
        zoom: null
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
          zoom: this.zoomOpt
        })
        window.bs = this.zoom
      },
      zoomTo(value) {
        this.zoom.zoomTo(value, 0, 0)
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
.zoom-wrapper
  margin: 0 auto
  width: 80%
  border: 1px solid #000
  background-color: #eee
  overflow: hidden
  p
    padding-left: 1rem
    height: 40px
    line-height 40px
    border-bottom: 1px solid #999
</style>
