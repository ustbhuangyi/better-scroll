<template>
  <div class="core">
    <ul class="example-list">
      <li
        @click="goPage('/compose/pullup-pulldown')"
        class="example-item"
      >
        <span>pullup-pulldown</span>
      </li>
      <li
        @click="goPage('/compose/pullup-pulldown-slide')"
        class="example-item"
      >
        <span>pullup-pulldown-slide</span>
      </li>
      <li
        @click="goPage('/compose/zoom-slide')"
        class="example-item"
      >
        <span>zoom-slide</span>
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
