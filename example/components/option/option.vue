<template>
  <div class="option-wraper">
    <div v-if="optionType === 'boolean'">
      <input type="checkbox" v-modal="checked">
      <label for="checkbox">{{ checked }}</label>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'option'
  export default {
    name: COMPONENT_NAME,
    props: {
      optionType: {
        type: String,
        default: 'boolean'
      },
      key: {
        type: String
      },
      val: null,
      checked: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus"></style>
