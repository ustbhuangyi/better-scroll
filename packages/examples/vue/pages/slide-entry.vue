<template>
  <div class="slide">
    <ul class="example-list">
      <li class="example-item" @click="goPage('/slide/banner')">
          <span>banner slide</span>
      </li>
      <li class="example-item" @click="goPage('/slide/fullpage')">
          <span>page slide</span>
      </li>
      <li class="example-item" @click="goPage('/slide/vertical')">
          <span>vertical slide</span>
      </li>
      <li class="example-item" @click="goPage('/slide/dynamic')">
          <span>dynamic slide（v2.1.0）</span>
      </li>
      <li class="example-item" @click="goPage('/slide/specified')">
          <span>specified index slide（v2.3.0）</span>
      </li>
      <li class="example-item placeholder"></li>
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
