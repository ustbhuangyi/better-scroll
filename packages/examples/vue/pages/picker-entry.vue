<template>
  <div class="container">
    <ul class="example-list">
      <li class="example-item" @click="goPage('/picker/one-column')">
          <span>One Column Picker</span>
      </li>
      <li class="example-item" @click="goPage('/picker/double-column')">
          <span>Double Column Picker</span>
      </li>
      <li class="example-item" @click="goPage('/picker/linkage-column')">
          <span>Linkage Column Picker</span>
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
