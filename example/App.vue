<template>
  <div id="app">
    <section class="page-header">
      <nav class="nav">
        <div class="left">
          <router-link to="/" class="brand">BetterScroll</router-link>
          <a class="tab" href="https://ustbhuangyi.github.io/better-scroll/doc/" target="_blank">文档</a>
          <router-link to="/examples" class="tab">示例</router-link>
        </div>

        <div class="right">
          <a href="https://github.com/ustbhuangyi/better-scroll" target="_blank"><img :src="githubIcon" alt="GitHub"></a>
        </div>
      </nav>
      <h1 class="project-name">BetterScroll</h1>

      <h2 class="project-tagline">inspired by iscroll, and it has a better scroll perfermance</h2>
      <a href="https://ustbhuangyi.github.io/better-scroll/doc/" class="btn" target="_blank">起步</a>
      <router-link to="/examples" class="btn">示例</router-link>
    </section>
    <section class="main-content">
      <transition name="fade">
        <router-view class="view"></router-view>
      </transition>
      <footer class="site-footer">
        <span class="site-footer-owner"><a href="https://github.com/ustbhuangyi/picker">BetterScroll</a> is maintained by <a
        href="https://github.com/ustbhuangyi">ustbhuangyi</a>.</span>
      </footer>
    </section>
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
    .btn
      min-width: 6rem

  .main-content
    .site-footer
      text-align: center
      @media screen and (max-width: 42rem)
        margin-top: -1rem

    .view
      transition: all 0.5s
      &.fade-enter-active, &.fade-leave-active
        opacity: 0;
      &.fade-enter, &.fade-leave
        transition: opacity .5s
</style>
