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
                  <switch-option name="scrollbar" :value="scrollbar"
                                 @update:value="val => scrollbar = val"></switch-option>
                </li>
                <li>
                  <switch-option name="pull down refresh" :value="pullDownRefresh"
                                 @update:value="val => pullDownRefresh = val"></switch-option>
                </li>
                <li>
                  <switch-option name="pull up load" :value="pullUpLoad"
                                 @update:value="val => pullUpLoad = val"></switch-option>
                </li>
              </ul>
            </div>
            <div class="demo">
              <div class="title sub">Demo</div>
              <div class="scroll-list-wrap">
                <scroll-list ref="scrollList"
                             :data="items"
                             :scrollbar="scrollbar"
                             :pullDownRefresh="pullDownRefresh"
                             :pullUpLoad="pullUpLoad"
                             @pullingDown="onPullingDown"
                             @pullingUp="onPullingUp"></scroll-list>
              </div>
            </div>
            <div class="methods">
              <div class="title sub">Methods</div>
              <ul class="method-list">
                <li>
                  <input type="text" placeholder="Y:number" v-model="y">
                  <div class="button" @click="scrollTo">scrollTo</div>
                </li>
              </ul>
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

  const _data = [
    '我是第 1 行',
    '我是第 2 行',
    '我是第 3 行',
    '我是第 4 行',
    '我是第 5 行',
    '我是第 6 行',
    '我是第 7 行',
    '我是第 8 行',
    '我是第 9 行',
    '我是第 10 行',
    '我是第 11 行',
    '我是第 12 行',
    '我是第 13 行',
    '我是第 14 行',
    '我是第 15 行',
    '我是第 16 行',
    '我是第 17 行',
    '我是第 18 行',
    '我是第 19 行',
    '我是第 20 行'
  ]

  export default {
    data() {
      return {
        scrollbar: true,
        pullDownRefresh: true,
        pullUpLoad: true,
        y: 300,
        items: _data,
        itemIndex: _data.length
      }
    },
    components: {
      ScrollList,
      SwitchOption
    },
    watch: {},
    methods: {
      scrollTo() {
        this.$refs.scrollList.scrollTo(0, -this.y)
      },
      onPullingDown() {
        this.loading = true
        // 更新数据
        setTimeout(() => {
          this.loading = false
          this.items.unshift('我是新数据: ' + +new Date())
        }, 1000)
      },
      onPullingUp() {
        let newPage = [
          '我是第 ' + ++this.itemIndex + ' 行',
          '我是第 ' + ++this.itemIndex + ' 行',
          '我是第 ' + ++this.itemIndex + ' 行',
          '我是第 ' + ++this.itemIndex + ' 行',
          '我是第 ' + ++this.itemIndex + ' 行'
        ]
        // 更新数据
        setTimeout(() => {
          this.items = this.items.concat(newPage)
        }, 1000)
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
      border-bottom: 1px solid rgba(0, 0, 0, .1)
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
            border: 1px solid rgba(0, 0, 0, .1)
            border-radius: 1rem
            li
              padding: 5px 0
              border-bottom: 1px solid rgba(0, 0, 0, .1)
        .demo
          @media screen and (min-width: 42rem)
            flex: 0 0 23rem
          @media screen and (max-width: 42rem)
            flex: 0 0 100%
            margin-bottom: 1rem

          .scroll-list-wrap
            position relative
            height: 41rem
            border: 1px solid rgba(0, 0, 0, .1)
            border-radius: 1rem
            transform: rotate(0deg) // fix 子元素超出边框圆角部分不隐藏的问题
            overflow: hidden
        .methods
          @media screen and (min-width: 42rem)
            flex: 0 1 25%
          @media screen and (max-width: 42rem)
            flex: 0 1 100%
          .method-list
            li
              display: flex
              width: 100%
              justify-content: center
              align-items: center
              transform: rotate(0deg) // fix 子元素超出边框圆角部分不隐藏的问题
              overflow: hidden
              input
              .button
                flex: 1 1 50%
                border: 1px solid rgba(0, 0, 0, .1)
                padding: 0.5rem 1rem
                line-height: 1.6rem
              input
                border-radius: 1rem 0 0 1rem
                outline: none
                &:focus
                  border-color: $color-green
              .button
                border-radius: 0 1rem 1rem 0
                background-color: $color-green
                border-color: $color-green
                color: $color-white

  .view
    transition: all 0.3s
    transform: translate3d(0, 0, 0)
    &.move-enter-active, &.move-leave-active
      transform: translate3d(100%, 0, 0)
</style>
