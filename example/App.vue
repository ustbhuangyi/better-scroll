<template>
  <div id="app">
    <section class="page-header">
      <h1 class="project-name">BetterScroll</h1>

      <h2 class="project-tagline">inspired by iscroll, and it has a better scroll perfermance</h2>
      <a href="https://github.com/ustbhuangyi/better-scroll" class="btn">View on GitHub</a>
      <a href="https://github.com/ustbhuangyi/better-scroll/zipball/master" class="btn">Download .zip</a>
      <a href="https://github.com/ustbhuangyi/better-scroll/tarball/master" class="btn">Download .tar.gz</a>
    </section>
    <section class="main-content">
      <div class="example">
        <div class="title">基础应用</div>
        <ul class="example-list">
          <li class="example-item">
            <router-link to="/normal-scroll">
              <span>普通 Scroll 组件</span>
            </router-link>
          </li>
          <li class="example-item">
            <router-link to="/picker">
              <span>Picker 组件</span>
            </router-link>
          </li>
          <li class="example-item">
            <router-link to="/slide">
              <span>Slide 组件</span>
            </router-link>
          </li>
        </ul>
        <div class="usage-wrap">
          <div class="title">普通 Scroll 组件</div>
          <div class="flex-box">
            <div class="options">
              <div class="title sub">Options</div>
              <ul class="option-list">
                <li>
                  <switch-option name="scrollbar" :value="scrollbar" @update:value="val => scrollbar = val"></switch-option>
                </li>
                <li>
                  <switch-option name="pull down refresh" :value="pullDownRefresh" @update:value="val => pullDownRefresh = val"></switch-option>
                </li>
                <li>
                  <switch-option name="pull up load" :value="pullUpLoad" @update:value="val => pullUpLoad = val"></switch-option>
                </li>
              </ul>
            </div>
            <div class="demo">
              <div class="title sub">Demo</div>
              <div class="scroll-list-wrap">
                <scroll-list :scrollbar="scrollbar" :pullDownRefresh="pullDownRefresh" :pullUpLoad="pullUpLoad"></scroll-list>
              </div>
            </div>
            <div class="methods">
              <div class="title sub">Methods</div>
            </div>
          </div>
        </div>
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
  import SwitchOption from './components/switch-option/switchOption.vue'

  export default {
    data() {
      return {
        scrollbar: false,
        pullDownRefresh: true,
        pullUpLoad: true
      }
    },
    components: {
      ScrollList,
      SwitchOption
    },
    watch: {
      scrollbar: function () {
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"

  .example
    .title
      font-size: 1.75rem
      font-weight: 500
      color: $color-dark-grey
      padding: 1rem
      border-bottom: 1px solid rgba(0,0,0,.1)
      margin-bottom: 1rem
      &.sub
        font-size: 1.50rem
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
    .usage-wrap
      @media screen and (min-width: 42rem)
        margin-top: 4rem
      .flex-box
        display: flex
        justify-content: space-between
        flex-wrap: wrap
        .options
          @media screen and (min-width: 42rem)
            flex: 0 1 25%
          @media screen and (max-width: 42rem)
            flex: 0 1 100%
            margin-bottom: 1rem

          .option-list
            border: 1px solid rgba(0,0,0,.1)
            border-radius: 1rem
            li
              padding: 5px 0
              border-bottom: 1px solid rgba(0,0,0,.1)
        .demo
          @media screen and (min-width: 42rem)
            flex: 0 0 23rem
          @media screen and (max-width: 42rem)
            flex: 0 0 100%
            margin-bottom: 1rem

          .scroll-list-wrap
            position relative
            height: 41rem
            border: 1px solid rgba(0,0,0,.1)
            border-radius: 1rem
            transform: rotate(0deg)  // fix 子元素超出边框圆角部分不隐藏的问题
            overflow: hidden
        .methods
          @media screen and (min-width: 42rem)
            flex: 0 1 25%
          @media screen and (max-width: 42rem)
            flex: 0 1 100%

  .view
    transition: all 0.3s
    transform: translate3d(0, 0, 0)
    &.move-enter-active, &.move-leave-active
      transform: translate3d(100%, 0, 0)
</style>
