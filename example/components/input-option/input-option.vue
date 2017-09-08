<template>
  <div class="input-option">
    <span class="name">{{ name }}</span>
    <input type="text" v-model="inputValue">
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'input-option'
  export default {
    name: COMPONENT_NAME,
    props: {
      name: {
        type: String
      },
      value: null,
      minValue: null
    },
    data() {
      return {
        inputValue: this.value
      }
    },
    watch: {
      inputValue: function (newValue) {
        this.$emit('update:value', this.minValue ? Math.max(newValue, this.minValue) : newValue)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"

  .input-option
    display: flex
    width: 100%
    height: 100%
    justify-content space-between
    align-items stretch
    padding-left: 15px
    .name
      flex: 1 1 auto
      display inline-flex
      align-items center
    input
      flex: 0 1 auto
      width: 10rem
      padding-left: 0.8rem
      background-color: $color-white
      border-left: 1px solid rgba(0, 0, 0, .1)
      box-shadow: 0 0 1px 1px #eee inset
      outline: none
      &:focus
        border: 1px solid $color-main

</style>
