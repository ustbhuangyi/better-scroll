<template>
  <div id="app">
    <section class="page-header">
      <h1 class="project-name">BetterScroll</h1>

      <h2 class="project-tagline">inspired by iscroll, and it has a better scroll perfermance
  </h2>
      <a href="https://github.com/ustbhuangyi/better-scroll" class="btn">View on GitHub</a>
      <a href="https://github.com/ustbhuangyi/better-scroll/zipball/master" class="btn">Download .zip</a>
      <a href="https://github.com/ustbhuangyi/better-scroll/tarball/master" class="btn">Download .tar.gz</a>
    </section>
    <section class="main-content">
      <div class="example">
        <div class="scroll">
          <div class="title">Scroll</div>
          <div class="option">
            <div class="title sub">Options</div>
            <div class="option-list">
              <ul>
                <bs-option name="scrollbar" optionType="boolean" :value="scrollbar" @update:value="val => scrollbar = val"></bs-option>
              </ul>
            </div>
          </div>
          <div class="demo">Demo
            <scroll-list :scrollbar="scrollbar" :scrollbar-fade="scrollbarFade"></scroll-list>
          </div>
          <div class="methods">Methods</div>
        </div>

        <ul class="example-list">
          <li class="example-item">
            <router-link to="/picker">
              <span>Picker 组件</span>
            </router-link>
          </li>
          <li class="example-item">
            <router-link to="/normal-scroll">
              <span>普通 Scroll 组件</span>
            </router-link>
          </li>
          <li class="example-item">
            <router-link to="/slide">
              <span>Slide 组件</span>
            </router-link>
          </li>
        </ul>
      </div>
      <footer class="site-footer">
    <span class="site-footer-owner"><a href="https://github.com/ustbhuangyi/picker">BetterScroll</a> is maintained by <a
        href="https://github.com/ustbhuangyi">ustbhuangyi</a>.</span>
      </footer>
    </section>
    <transition name="move">
      <router-view class="view"></router-view>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import ScrollList from './components/scroll-list/scrollList.vue'
  import BsOption from './components/bs-option/bs-option.vue'

  export default {
    data() {
      return {
        scrollbar: false,
        scrollbarFade: true
      }
    },
    components: {
      ScrollList,
      BsOption
    },
    watch: {
      scrollbar: function () {
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .example
    .scroll
      max-width: 800px
      .demo
        position relative
        max-width: 375px
        height: 667px
        overflow: hidden
    .example-list
      display: flex
      justify-content: center
      flex-wrap: wrap
      .example-item
        max-width: 320px
        margin: 0 auto
        text-align: center
        a
          line-height: 60px
  .view
    transition: all 0.3s
    transform: translate3d(0, 0, 0)
    &.move-enter-active, &.move-leave-active
      transform: translate3d(100%, 0, 0)
</style>
