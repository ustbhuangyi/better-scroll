<template>
  <div class="movable">
    <ul class="example-list">
      <li class="example-item" @click="goPage('/movable/default')">
        <span>default</span>
      </li>
      <li class="example-item" @click="goPage('/movable/scale')">
        <span>scale</span>
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
