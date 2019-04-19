<template>
  <page :title="$t('examples.picker')" :desc="$t('pickerPage.desc')">
    <div slot="content">
      <picker-render></picker-render>
    </div>
  </page>
</template>

<script type="text/ecmascript-6">
  import Page from 'example/components/page/page.vue'
  import PickerRender from 'example/page-render/picker-render.vue'

  export default {
    components: {
      Page,
      PickerRender
    }
  }
</script>
