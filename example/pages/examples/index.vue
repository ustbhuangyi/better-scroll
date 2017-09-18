<template>
  <div class="example">
    <ul class="example-list">
      <li class="example-item">
        <router-link :to="verticalScrollPath">
          <img :src="verticalScrollImg">
          <span>{{ $t('examples.normalScrollList') }}</span>
        </router-link>
      </li>
      <li class="example-item">
        <router-link :to="indexListPath">
          <img :src="indexListImg">
          <span>{{ $t('examples.indexList') }}</span>
        </router-link>
      </li>
      <li class="example-item">
        <router-link :to="pickerPath">
          <img :src="pickerImg">
          <span>{{ $t('examples.picker') }}</span>
        </router-link>
      </li>
      <li class="example-item">
        <router-link :to="slidePath">
          <img :src="slideImg">
          <span>{{ $t('examples.slide') }}</span>
        </router-link>
      </li>
      <li class="example-item">
        <router-link :to="startGuidancePath">
          <img :src="startGuidanceImg">
          <span>{{ $t('examples.startGuidance') }}</span>
        </router-link>
      </li>
      <li class="example-item">
        <router-link :to="freeScrollPath">
          <img :src="freeScrollImg">
          <span>{{ $t('examples.freeScroll') }}</span>
        </router-link>
      </li>
      <li class="example-item placeholder">
      </li>
    </ul>

    <transition name="move">
      <router-view class="view"></router-view>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {}
    },
    computed: {
      verticalScrollImg() {
        return require('../../common/images/' + this.$i18n.t('examples.verticalScrollImg'))
      },
      indexListImg() {
        return require('../../common/images/' + this.$i18n.t('examples.indexListImg'))
      },
      pickerImg() {
        return require('../../common/images/' + this.$i18n.t('examples.pickerImg'))
      },
      slideImg() {
        return require('../../common/images/' + this.$i18n.t('examples.slideImg'))
      },
      startGuidanceImg() {
        return require('../../common/images/' + this.$i18n.t('examples.startGuidanceImg'))
      },
      freeScrollImg() {
        return require('../../common/images/' + this.$i18n.t('examples.freeScrollImg'))
      },
      verticalScrollPath() {
        return '/examples/vertical-scroll/' + this.$i18n.locale
      },
      indexListPath() {
        return '/examples/index-view/' + this.$i18n.locale
      },
      pickerPath() {
        return '/examples/picker/' + this.$i18n.locale
      },
      slidePath() {
        return '/examples/slide/' + this.$i18n.locale
      },
      startGuidancePath() {
        return '/examples/full-page-slide/' + this.$i18n.locale
      },
      freeScrollPath() {
        return '/examples/free-scroll/' + this.$i18n.locale
      }
    },
    created() {
      this.$i18n.locale = this.$route.params.lang === 'zh' ? 'zh' : 'en'
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"

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
        border: 1px solid rgba(0, 0, 0, .1)
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
    .view
      transition: all 0.3s
      transform: translate3d(0, 0, 0)
      &.move-enter-active, &.move-leave-active
        transform: translate3d(100%, 0, 0)
</style>
