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
          path: '/nested-scroll/nested-vertical-scroll',
          name: 'vertical-scroll'
        },
        {
          path: '/nested-scroll/nested-horizontal-scroll',
          name: 'horizontal-scroll'
        },
        {
          path: '/nested-scroll/nested-horizontal-in-vertical',
          name: 'nested-horizontal-in-vertical-scroll'
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
