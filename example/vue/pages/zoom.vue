<template>
  <div class="zoom">
    <zoom ref="zoom" :zoom-opt="zoomOpt"/>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import Zoom from 'example/vue/demo/zoom.vue'
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
</style>
