<template>
  <div class="example">
    <ul class="example-list">
      <li class="example-item">
        <router-link to="/examples/vertical-scroll">
          <img :src="verticalScrollImg">
          <span>{{ $t('examples.normalScrollList') }}</span>
        </router-link>
      </li>
      <li class="example-item">
        <router-link to="/examples/index-view">
          <img :src="indexListImg">
          <span>{{ $t('examples.indexList') }}</span>
        </router-link>
      </li>
      <li class="example-item">
        <router-link to="/examples/picker">
          <img :src="pickerImg">
          <span>{{ $t('examples.picker') }}</span>
        </router-link>
      </li>
      <li class="example-item">
        <router-link to="/examples/slide">
          <img :src="slideImg">
          <span>{{ $t('examples.slide') }}</span>
        </router-link>
      </li>
      <li class="example-item">
        <router-link to="/examples/full-page-slide">
          <img :src="fullPageSliderImg">
          <span>{{ $t('examples.startGuidance') }}</span>
        </router-link>
      </li>
      <li class="example-item">
        <router-link to="/examples/free-scroll">
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
      return {
        githubIcon: require('../../common/images/github.svg'),
        verticalScrollImg: require('../../common/images/vertical-scroll.jpeg'),
        indexListImg: require('../../common/images/index-list.jpeg'),
        pickerImg: require('../../common/images/picker.jpeg'),
        slideImg: require('../../common/images/slide.jpeg'),
        fullPageSliderImg: require('../../common/images/full-page-slide.jpeg'),
        freeScrollImg: require('../../common/images/free-scroll.jpeg')
      }
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
