<template>
  <div class="indicators">
    <ul class="example-list">
      <li class="example-item" @click="goPage('/indicators/minimap')">
        <span>minimap</span>
      </li>
      <li class="example-item" @click="goPage('/indicators/parallax-scroll')">
        <span>parallax scroll</span>
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
