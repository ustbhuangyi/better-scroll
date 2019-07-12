<template>
  <div class="core">
    <ul class="example-list">
      <li class="example-item" @click="goPage('/nested-scroll-manager/nested-vertical-scroll')">
        <span>nested-vertical-scroll</span>
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
