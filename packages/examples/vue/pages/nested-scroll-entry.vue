<template>
  <div class="core">
    <ul class="example-list">
      <li
        class="example-item"
        :key="index"
        v-for="(route, index) in routes"
        @click="goPage(route.path)">
        <span>{{route.name}}</span>
      </li>
    </ul>
    <transition name="move">
      <router-view class="view"></router-view>
    </transition>
  </div>
</template>
<script>
export default {
  data () {
    return {
      routes: [
        {
          path: '/nested-scroll/vertical',
          name: 'vertical'
        },
        {
          path: '/nested-scroll/horizontal',
          name: 'horizontal'
        },
        {
          path: '/nested-scroll/horizontal-in-vertical',
          name: 'horizontal-in-vertical'
        },
        {
          path: '/nested-scroll/triple-vertical',
          name: 'triple-vertical'
        }
      ]
    }
  },
  methods: {
    goPage(path) {
      this.$router.push(path)
    }
  }
}
</script>
