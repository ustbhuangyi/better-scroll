<template>
  <page :title="$t('examples.slide')" :desc="$t('slidePage.desc')">
    <div slot="content" class="slid">
      <slide-render></slide-render>
    </div>
  </page>
</template>

<script type="text/ecmascript-6">
  import Page from 'example/components/page/page.vue'
  import SlideRender from 'example/page-render/slide-render.vue'

  export default {
    components: {
      Page,
      SlideRender
    }
  }
</script>
<style lang='stylus' rel='stylesheet/stylus'>
  .example
    .page
      .wrapper
        overflow: auto
        padding-bottom: 50px
</style>
