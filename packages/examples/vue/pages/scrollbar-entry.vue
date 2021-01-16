<template>
  <div class="scroll-bar">
    <ul class="example-list">
      <li class="example-item" @click="goPage('/scrollbar/vertical')">
        <span>vertical</span>
      </li>
      <li class="example-item" @click="goPage('/scrollbar/horizontal')">
        <span>horizontal</span>
      </li>
      <li class="example-item" @click="goPage('/scrollbar/custom')">
        <span>custom</span>
      </li>
      <li class="example-item" @click="goPage('/scrollbar/mousewheel')">
        <span>use mousewheel</span>
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