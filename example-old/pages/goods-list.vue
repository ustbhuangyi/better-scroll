<template>
  <page :title="$t('examples.goodsList')">
    <div slot="content">
      <good-list-render></good-list-render>
    </div>
  </page>
</template>

<script>
  import Page from 'example/components/page/page.vue'
  import GoodListRender from 'example/page-render/goods-list-render.vue'

  export default {
    components: {
      Page,
      GoodListRender
    }
  }
</script>
