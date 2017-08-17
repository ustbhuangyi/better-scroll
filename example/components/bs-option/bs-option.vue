<template>
  <div class="option-wraper">
    <div v-if="optionType === 'boolean'">
      <input id="checkbox" type="checkbox" v-model="checked">
      <label for="checkbox">{{ name }}</label>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'bs-option'
  export default {
    name: COMPONENT_NAME,
    props: {
      optionType: {
        type: String,
        default: 'boolean'
      },
      name: {
        type: String
      },
      value: null
    },
    data() {
      return {
        checked: this.value
      }
    },
    watch: {
      checked: function (newValue) {
        this.$emit('update:value', newValue)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus"></style>
