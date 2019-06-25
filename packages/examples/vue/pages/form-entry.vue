<template>
  <div class="core">
    <ul class="example-list">
      <li class="example-item" @click="goPage('/form/textarea')">
        <span>textarea</span>
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
