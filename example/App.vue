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
        <div class="usage-wrap">
          <div class="title">Scroll</div>
          <div class="flex-box">
            <div class="options">
              <div class="title sub">Options</div>
              <div class="option-list">
                <ul>
                  <bs-option name="scrollbar" optionType="boolean" :value="scrollbar" @update:value="val => scrollbar = val"></bs-option>
                </ul>
              </div>
            </div>
            <div class="demo">
              <div class="title sub">Demo</div>
              <div class="scroll-list-wrap">
                <scroll-list :scrollbar="scrollbar" :scrollbar-fade="scrollbarFade"></scroll-list>
              </div>
            </div>
            <div class="methods">
              <div class="title sub">Methods</div>
            </div>
          </div>
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
    .usage-wrap
      .title
        font-size: 20px
        font-weight: 400
        padding: 15px
        border-bottom: 1px solid rgba(0,0,0,.1)
        margin-bottom 15px
      .flex-box
        max-width: 800px
        display: flex
        justify-content: space-between
        .options
          flex: 0 1 200px
        .demo
          flex: 0 0 375px
          .scroll-list-wrap
            position relative
            max-width: 375px
            height: 667px
            overflow: hidden
        .methods
          flex: 0 1 200px
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
