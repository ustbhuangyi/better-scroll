<template>
  <page class="free-scroll-view" title="free scroll（自由滚动）" desc="支持横向和纵向同时滚动">
    <div slot="content">
      <scroll ref="scroll" :freeScroll="true">
        <img :src="imgUrl"/>
      </scroll>
    </div>
  </page>
</template>

<script type="text/ecmascript-6">
  import Page from 'example/components/page/page.vue'
  import Scroll from 'example/components/scroll/scroll.vue'

  export default {
    data() {
      return {
        imgUrl: require('../../common/images/vertical-scroll.jpeg')
      }
    },
    components: {
      Page,
      Scroll
    }
  }
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
  img
    width: 1500px
    height: 1000px
</style>