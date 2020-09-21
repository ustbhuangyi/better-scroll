<template>
  <div class="core">
    <ul class="example-list">
      <li class="example-item" @click="goPage('/core/default')">
        <span>vertical</span>
      </li>
      <li class="example-item" @click="goPage('/core/horizontal')">
        <span>horizontal</span>
      </li>
      <li class="example-item" @click="goPage('/core/dynamic-content')">
        <span>dynamic-content</span>
      </li>
      <li class="example-item" @click="goPage('/core/specified-content')">
        <span>specified-content</span>
      </li>
      <li class="example-item" @click="goPage('/core/freescroll')">
        <span>freescroll</span>
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
