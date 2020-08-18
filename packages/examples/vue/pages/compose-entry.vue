<template>
  <div class="core">
    <ul class="example-list">
      <li
        @click="goPage('/compose/pullup-pulldown')"
        class="example-item"
      >
        <span>pullup-pulldown</span>
      </li>
    </ul>
    <transition name="move">
      <router-view class="view"></router-view>
    </transition>
  </div>
</template>
<script>
export default {
  methods: {
    goPage(path) {
      this.$router.push(path)
    }
  }
}
</script>
<style lang="stylus">
.free-scroll-container
  &.view
    position fixed !important
</style>
