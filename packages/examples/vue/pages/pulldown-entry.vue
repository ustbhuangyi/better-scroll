<template>
  <div class="container">
    <ul class="example-list">
      <li class="example-item" @click="goPage('/pulldown/default')">
          <span>Default</span>
      </li>
      <li class="example-item" @click="goPage('/pulldown/sina')">
          <span>Sina-Weibo(v2.4.0)</span>
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
