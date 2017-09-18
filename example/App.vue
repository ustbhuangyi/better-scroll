<template>
  <div id="app">
    <section class="page-header">
      <nav class="nav">
        <div class="left">
          <router-link :to="lang" class="brand">BetterScroll</router-link>
          <a class="tab" href="https://ustbhuangyi.github.io/better-scroll/doc/" target="_blank">{{ $t('navigator.doc') }}</a>
          <router-link :to="examplesPath" class="tab">{{ $t('navigator.demo') }}</router-link>
        </div>

        <div class="right">
          <span class="tab language-wrapper" @click="toggleLanguage">
            <span>Language</span>
            <ul class="option-wrapper" v-if="showLanguage">
              <li @click="chooseLanguage('en')">English</li>
              <li @click="chooseLanguage('zh')">中文</li>
            </ul>
          </span>

          <a href="https://github.com/ustbhuangyi/better-scroll" target="_blank"><img :src="githubIcon" alt="GitHub"></a>
        </div>
      </nav>
      <h1 class="project-name">BetterScroll</h1>

      <h2 class="project-tagline">inspired by iscroll, and it has a better scroll perfermance</h2>
      <a href="https://ustbhuangyi.github.io/better-scroll/doc/" class="btn" target="_blank">{{ $t('navigator.started') }}</a>
      <router-link :to="examplesPath" class="btn">{{ $t('navigator.demo') }}</router-link>
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
        showLanguage: false,
        githubIcon: require('./common/images/github.svg')
      }
    },
    computed: {
      lang() {
        return '/' + this.$i18n.locale
      },
      examplesPath() {
        return '/examples/' + this.$i18n.locale
      }
    },
    methods: {
      toggleLanguage() {
        this.showLanguage = !this.showLanguage
      },
      chooseLanguage(lang) {
        if (this.$route.params.lang !== lang) {
          this.$i18n.locale = lang
          let newPath = this.$route.path.substring(0, -2) + lang
          this.$router.replace(newPath)
        }
      }
    },
    created() {
      this.$i18n.locale = this.$route.params.lang === 'zh' ? 'zh' : 'en'
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"

  .page-header
    .nav
      margin-bottom: 1.5rem
      vertical-align: middle
      line-height: 1.6rem
      @media screen and (min-width: 42rem)
        margin-bottom: 5rem
      @media screen and (max-width: 42rem)
        margin-bottom: 4rem
      .tab
        padding-bottom: 5px
        @media screen and (min-width: 42rem)
          margin-right: 1rem
        @media screen and (max-width: 42rem)
          margin-right: 0.4rem
        &:hover
          box-shadow: 0 3px 0 rgba(255,255,255,0.5)
          cursor: pointer
      .language-wrapper
        position: relative
        .option-wrapper
          width: 100%
          position: absolute
          top: 2rem
          left: 0
          line-height: 2rem
      a
        color: $color-white
        &:hover
          text-decoration: none
      .left
        float: left
        .brand
          font-size: $fontsize-large-xx
          @media screen and (min-width: 42rem)
            margin-right: 3rem
          @media screen and (max-width: 42rem)
            margin-right: 1rem

      .right
        float: right
        vertical-align: middle
        img
          position: relative
          top: 0.2rem
          width: 1.2rem
    h1
      @media screen and (min-width: 42rem)
        margin-bottom: 1rem
      @media screen and (max-width: 42rem)
        margin-bottom: 0.5rem
    .btn
      min-width: 7rem

  .main-content
    .site-footer
      text-align: center
      @media screen and (max-width: 42rem)
        margin-top: -1rem

    .view
      transition: all 0.4s ease-in-out
      &.fade-enter-active, &.fade-leave-active
        opacity: 0.01
      &.fade-enter, &.fade-leave
        transition: opacity .4s
</style>
