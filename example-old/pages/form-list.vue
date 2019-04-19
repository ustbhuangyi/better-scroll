<template>
  <page :title="$t('examples.formList')" :desc="$t('formListPage.desc')">
    <div slot="content">
      <form-list-render></form-list-render>
    </div>
  </page>
</template>

<script type="text/ecmascript-6">
  import Page from 'example/components/page/page.vue'
  import FormListRender from 'example/page-render/form-list-render.vue'

  export default {
    components: {
      Page,
      FormListRender
    }
  }
</script>
