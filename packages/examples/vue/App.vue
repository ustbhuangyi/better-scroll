<template>
  <div id="app">
    <section class="page-header">
      <h1 class="project-name">BetterScroll</h1>
      <h2 class="project-tagline">inspired by iscroll, and it has a better scroll perfermance</h2>
    </section>
    <section class="main-content">
      <div class="example">
        <ul class="example-list">
          <li class="example-item" v-for="(item, index) in examples" :key="index" @click="goPage(item.path)">
              <span>{{item.name}}</span>
          </li>
          <li class="example-item placeholder">
          </li>
        </ul>
      </div>
    </section>
    <transition name="move">
      <router-view class="view"></router-view>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  const examples = [
    {
      name: 'core scroll',
      path: '/core/'
    },
    {
      name: 'slide',
      path: '/slide/'
    },
    {
      name: 'zoom',
      path: '/zoom/'
    },
    {
      name: 'picker',
      path: '/picker/'
    },
    {
      name: 'pullup',
      path: '/pullup/'
    },
    {
      name: 'pulldown',
      path: '/pulldown/'
    },
    {
      name: 'scrollbar',
      path: '/scrollbar/'
    },
    {
      name: 'form',
      path: '/form/'
    },
    {
      name: 'nestedScroll',
      path: '/nested-scroll/'
    }
  ]
  export default {
    data() {
      return {
        examples: examples
      }
    },
    methods: {
      goPage(path) {
        this.$router.push(path)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"

  .page-header
    h1
      @media screen and (min-width: 42rem)
        margin-bottom: 1rem
      @media screen and (max-width: 42rem)
        margin-bottom: 0.5rem
  .main-content
    .site-footer
      text-align: center
      @media screen and (max-width: 42rem)
        margin-top: -1rem

  .example-list
    display: flex
    justify-content: space-between
    flex-wrap: wrap
    @media screen and (min-width: 42rem)
      margin: 2rem 0 2rem 0
    @media screen and (max-width: 42rem)
      margin: 1rem 0
    .example-item
      background-color $color-white
      padding: 0.8rem
      border: 1px solid rgba(0, 0, 0, .1)
      box-shadow: 0 1px 2px 0 rgba(0,0,0,0.1)
      text-align: center
      margin-bottom: 1rem
      &.placeholder
        visibility: hidden
        height: 0
        margin: 0
        padding: 0
      @media screen and (min-width: 42rem)
        flex: 0 1 28%
      @media screen and (max-width: 42rem)
        flex: 0 1 100%
        margin-bottom: 1rem
  .view
    position fixed
    top 0
    left 0
    bottom 0
    right 0
    z-index: 1
    padding: 20px
    background #fff
    transform translate3d(0, 0, 0)
    &.move-enter, &.move-leave-active
      transform translate3d(100%, 0, 0)
    &.move-enter-active, &.move-leave-active
      transition transform .3s
</style>
