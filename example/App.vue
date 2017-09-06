<template>
  <div id="app">
    <section class="page-header">
      <nav class="nav">
        <div class="left">
          <a class="brand" href="">BetterScroll</a>
          <a class="tab" href="https://ustbhuangyi.github.io/better-scroll/doc/" target="_blank">文档</a>
          <a class="tab" href="">示例</a>
        </div>

        <div class="right">
          <a href="https://github.com/ustbhuangyi/better-scroll" target="_blank"><img :src="githubIcon" alt="GitHub"></a>
        </div>
      </nav>
      <h1 class="project-name">BetterScroll</h1>

      <h2 class="project-tagline">inspired by iscroll, and it has a better scroll perfermance</h2>
      <a href="https://ustbhuangyi.github.io/better-scroll/doc/" class="btn" target="_blank">Get Started</a>
      <a class="btn">DEMO</a>
    </section>
    <section class="main-content">
      <div class="example">
        <ul class="example-list">
          <li class="example-item">
            <router-link to="/vertical-scroll">
              <img :src="verticalScrollImg">
              <span>普通 Scroll 组件</span>
            </router-link>
          </li>
          <li class="example-item">
            <router-link to="/index-view">
              <img :src="indexListImg">
              <span>索引列表</span>
            </router-link>
          </li>
          <li class="example-item">
            <router-link to="/picker">
              <img :src="pickerImg">
              <span>Picker 组件</span>
            </router-link>
          </li>
          <li class="example-item">
            <router-link to="/slide">
              <img :src="slideImg">
              <span>Slide 组件</span>
            </router-link>
          </li>
          <li class="example-item">
            <router-link to="/full-page-slide">
              <img :src="fullPageSliderImg">
              <span>全屏 Slide</span>
            </router-link>
          </li>
          <li class="example-item">
            <router-link to="/free-scroll">
              <img :src="freeScrollImg">
              <span>自由滚动</span>
            </router-link>
          </li>
          <li class="example-item placeholder">
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
  export default {
    data() {
      return {
        githubIcon: require('./common/images/github.svg'),
        verticalScrollImg: require('./common/images/vertical-scroll.jpeg'),
        indexListImg: require('./common/images/index-list.jpeg'),
        pickerImg: require('./common/images/picker.jpeg'),
        slideImg: require('./common/images/slide.jpeg'),
        fullPageSliderImg: require('./common/images/full-page-slide.jpeg'),
        freeScrollImg: require('./common/images/free-scroll.jpeg')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"

  .page-header
    .nav
      margin-bottom: 5rem
      vertical-align: middle
      @media screen and (min-width: 42rem)
        margin-bottom: 5rem
      @media screen and (max-width: 42rem)
        margin-bottom: 3rem
      a
        color: $color-white
        &:hover
          text-decoration: none
      .left
        float: left
        .brand
          font-size: $fontsize-large-xx
          margin-right: 3rem
        .tab
          margin-right: 1rem
          padding-bottom: 5px
          &:hover
            box-shadow: 0 3px 0 rgba(255,255,255,0.5)
      .right
        float: right
        vertical-align: middle
        img
          position: relative
          top: 0.2rem
          width: 1.2rem
    h1
      margin-bottom: 1rem


  .main-content
    .example
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
          box-shadow: 0 1px 2px 0 rgba(0,0,0,0.1)
          text-align: center
          margin-bottom: 2rem
          &.placeholder
            visibility: hidden
            height: 0
            margin: 0
            padding: 0
          @media screen and (min-width: 42rem)
            flex: 0 1 28%
          @media screen and (max-width: 42rem)
            flex: 0 1 100%
            margin-bottom: 2rem
          img
            border: 1px solid rgba(0, 0, 0, .1)
          a
            line-height: 3rem
            color: #606c71

    .site-footer
      text-align: center
      @media screen and (max-width: 42rem)
        margin-top: -1rem

  .view
    transition: all 0.3s
    transform: translate3d(0, 0, 0)
    &.move-enter-active, &.move-leave-active
      transform: translate3d(100%, 0, 0)
</style>
