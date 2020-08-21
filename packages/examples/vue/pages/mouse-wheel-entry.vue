<template>
  <div class="mouse-wheel">
    <ul class="example-list">
      <li class="example-item" @click="goPage('/mouse-wheel/vertical-scroll')">
        <span>vertical scroll</span>
      </li>
      <li class="example-item" @click="goPage('/mouse-wheel/horizontal-scroll')">
        <span>horizontal scroll</span>
      </li>
      <li class="example-item" @click="goPage('/mouse-wheel/vertical-slide')">
        <span>vertical slide</span>
      </li>
      <li class="example-item" @click="goPage('/mouse-wheel/horizontal-slide')">
        <span>horizontal slide</span>
      </li>
      <li class="example-item" @click="goPage('/mouse-wheel/pullup')">
        <span>pull up load</span>
      </li>
      <li class="example-item" @click="goPage('/mouse-wheel/pulldown')">
        <span>pull down refresh</span>
      </li>
      <li class="example-item" @click="goPage('/mouse-wheel/picker')">
        <span>picker</span>
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
    position fixed!important
</style>
