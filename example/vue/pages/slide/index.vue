<template>
  <div class="slide">
    <ul class="example-list">
      <li class="example-item" @click="goPage('/slide/normal')">
          <span>normal slider</span>
      </li>
      <li class="example-item">
          <span>page slider</span>
      </li>
      <li class="example-item placeholder">
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
</style>
