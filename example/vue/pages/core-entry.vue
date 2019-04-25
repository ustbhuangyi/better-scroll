<template>
  <div class="core">
    <ul class="example-list">
      <li class="example-item" @click="goPage('/core/mouse-wheel')">
          <span>mouse wheel</span>
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