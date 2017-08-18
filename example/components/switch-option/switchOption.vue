<template>
  <div class="switch-wrapper">
    <input id="checkbox" type="checkbox" v-model="checked">
    <span class="name">{{ name }}</span>
    <label for="checkbox">
      <div class="switch-ellipse" :class="{ active: checked }">
        <span class="switch-circle" :class="{ active: checked }"></span>
      </div>
    </label>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'switch-option'
  export default {
    name: COMPONENT_NAME,
    props: {
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

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"

  .switch-wrapper
    display flex
    justify-content space-between
    align-items center
    padding 0 15px
    input
      display none
    .name


    label
      text-align right
      .switch-ellipse
        margin-top: 5px;
        display: inline-block;
        position: relative;
        height: 30px;
        width: 52px;
        border-radius: 1000px;
        box-shadow: 0 0 2px #333;
        transition: all 0.1s
        &.active
          background: $color-green;
          transition: all 0.2s ease 0.2s;
      .switch-circle
        position: absolute;
        display: inline-block;
        height: 29px;
        width: 29px;
        background: white;
        border-radius: 50%;
        box-shadow: 0 0 2px #333;
        top: 1px
        left: 1px
        transition: all 0.3s;
        &.active
          left: 23px;
          transition: all 0.4s ease 0.1s;

</style>
