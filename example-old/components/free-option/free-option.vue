<template>
  <div class="free-option">
    <span class="name">{{ name }}</span>
    <div class="button-container">
      <slot></slot>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default{
    props: {
      name: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
      }
    }
  }
</script>

<style lang="stylus">
  .free-option
    display flex
    justify-content space-between
    align-items stretch
    width: 100%
    height: 100%
    padding 12px 15px
    font-size: 14px
    .name
      display flex
      align-items: center
      flex: 0 1 auto
</style>
