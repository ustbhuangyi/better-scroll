<template>
  <page :title="$t('examples.zoom')" :desc="$t('zoomPage.desc')">
    <div slot="content" class="zoomView">
      <zoom ref="zoom" :zoom-opt="zoomOpt"/>
      <div class="group">
        <free-option class="free-option item" :name="$t('zoomPage.changeZoom')" >
          <button class="change-button" @click="zoomTo(0.5)">zoom:0.5</button>
          <button class="change-button" @click="zoomTo(1)">zoom:1</button>
          <button class="change-button" @click="zoomTo(2)">zoom:2</button>
        </free-option>
      </div>
    </div>
  </page>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import Page from 'example/components/page/page.vue'
  import FreeOption from 'example/components/free-option/free-option.vue'
  import Zoom from 'example/components/zoom/zoom.vue'

  import { ease } from '../common/js/ease'

  export default {
    data() {
      return {
        zoomOpt: {
          start: 1,
          min: 0.5,
          max: 2
        }
      }
    },
    components: {
      Page,
      FreeOption,
      Zoom
    },
    methods: {
      zoomTo(value) {
        this.$refs.zoom.zoomTo(value)
      }
    }
  }
</script>
<style lang='stylus' rel='stylesheet/stylus'>
@import "~common/stylus/variable.styl"
.zoomView
  .group
    margin-top: 1rem
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
</style>
