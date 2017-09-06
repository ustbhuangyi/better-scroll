<template>
  <optional-demo class="scroll-view" title="普通 Scroll 组件" desc="基于 BScroll 实现垂直滚动列表组件">
    <div slot="options">
      <div class="group">
        <switch-option class="item" name="滚动条" :value="scrollbar"
                       @update:value="updateScrollbar"></switch-option>
        <switch-option v-if="scrollbar" class="item sub first last" name="fade" :value="scrollbarFade"
                       @update:value="updateScrollbarFade"></switch-option>
      </div>
      <div class="group">
        <switch-option class="item" name="下拉刷新" :value="pullDownRefresh"
                       @update:value="updatePullDownRefresh"></switch-option>
        <input-option v-if="pullDownRefresh" class="item sub first" name="threshold (≥ 40)"
                      :value="pullDownRefreshThreshold" min-value="40"
                      @update:value="updatePullDownRefreshThreshold"></input-option>
        <input-option v-if="pullDownRefresh" class="item sub last" name="stop (≥ 40)" :value="pullDownRefreshStop"
                      min-value="40"
                      @update:value="updatePullDownRefreshStop"></input-option>
      </div>
      <div class="group">
        <switch-option class="item" name="上拉加载" :value="pullUpLoad"
                       @update:value="updatePullUpLoad"></switch-option>
        <input-option v-if="pullUpLoad" class="item sub first" name="threshold" :value="pullUpLoadThreshold"
                      @update:value="updatePullUpLoadThreshold"></input-option>
        <input-option v-if="pullUpLoad" class="item sub first" name="moreTxt" :value="pullUpLoadMoreTxt"
                      @update:value="updatePullUpLoadMoreTxt"></input-option>
        <input-option v-if="pullUpLoad" class="item sub first last" name="noMoreTxt" :value="pullUpLoadNoMoreTxt"
                      @update:value="updatePullUpLoadNoMoreTxt"></input-option>
      </div>
      <div class="group">
        <input-option class="item" name="startY" :value="startY"
                      @update:value="updateStartY"></input-option>
      </div>
    </div>
    <div slot="demo">
      <scroll ref="scroll"
              :data="items"
              :scrollbar="scrollbarObj"
              :pullDownRefresh="pullDownRefreshObj"
              :pullUpLoad="pullUpLoadObj"
              :startY="parseInt(startY)"
              @pullingDown="onPullingDown"
              @pullingUp="onPullingUp">
      </scroll>
    </div>
    <div slot="methods">
      <div class="group">
        <input-option class="item" name="x" :value="scrollToX"
                      @update:value="updateScrollToX"></input-option>
        <input-option class="item" name="y" :value="scrollToY"
                      @update:value="updateScrollToY"></input-option>
        <input-option class="item" name="time" :value="scrollToTime"
                      @update:value="updateScrollToTime"></input-option>
        <select-option class="item" name="easing" :value="scrollToEasing" :options="scrollToEasingOptions"
                       @update:value="updateScrollToEasing"></select-option>
        <button @click="scrollTo">scrollTo</button>
      </div>
    </div>
  </optional-demo>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import OptionalDemo from 'example/components/optional-demo/optional-demo.vue'
  import Scroll from 'example/components/scroll/scroll.vue'
  import SwitchOption from 'example/components/switch-option/switch-option.vue'
  import InputOption from 'example/components/input-option/input-option.vue'
  import SelectOption from 'example/components/select-option/select-option.vue'

  import {ease} from '../../common/js/ease'

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
        scrollbarFade: true,
        pullDownRefresh: true,
        pullDownRefreshThreshold: 90,
        pullDownRefreshStop: 40,
        pullUpLoad: true,
        pullUpLoadThreshold: 0,
        pullUpLoadMoreTxt: '加载更多',
        pullUpLoadNoMoreTxt: '没有更多数据了',
        startY: 0,
        scrollToX: 0,
        scrollToY: -200,
        scrollToTime: 700,
        scrollToEasing: 'bounce',
        scrollToEasingOptions: ['bounce', 'swipe', 'swipeBounce'],
        items: _data,
        itemIndex: _data.length
      }
    },
    components: {
      OptionalDemo,
      Scroll,
      SwitchOption,
      InputOption,
      SelectOption
    },
    watch: {
      scrollbarObj() {
        this.rebuildScroll()
      },
      pullDownRefreshObj() {
        this.rebuildScroll()
      },
      pullUpLoadObj() {
        this.rebuildScroll()
      },
      startY() {
        this.rebuildScroll()
      }
    },
    computed: {
      scrollbarObj: function () {
        return this.scrollbar ? {fade: this.scrollbarFade} : false
      },
      pullDownRefreshObj: function () {
        return this.pullDownRefresh ? {
          threshold: parseInt(this.pullDownRefreshThreshold),
          stop: parseInt(this.pullDownRefreshStop)
        } : false
      },
      pullUpLoadObj: function () {
        return this.pullUpLoad ? {threshold: parseInt(this.pullUpLoadThreshold), txt: {more: this.pullUpLoadMoreTxt, noMore: this.pullUpLoadNoMoreTxt}} : false
      }
    },
    methods: {
      scrollTo() {
        this.$refs.scroll.scrollTo(this.scrollToX, this.scrollToY, this.scrollToTime, ease[this.scrollToEasing])
      },
      onPullingDown() {
        // 模拟更新数据
        console.log('pulling down and loading data')
        setTimeout(() => {
          if (Math.random() > 0.5) {
            // 如果有新数据
            this.items.unshift('我是新数据: ' + +new Date())
          } else {
            // 如果没有新数据
            this.$refs.scroll.forceUpdate()
          }
        }, 1000)
      },
      onPullingUp() {
        // 更新数据
        console.log('pulling up and load data')
        setTimeout(() => {
          if (Math.random() > 0.5) {
            // 如果有新数据
            let newPage = [
              '我是第 ' + ++this.itemIndex + ' 行',
              '我是第 ' + ++this.itemIndex + ' 行',
              '我是第 ' + ++this.itemIndex + ' 行',
              '我是第 ' + ++this.itemIndex + ' 行',
              '我是第 ' + ++this.itemIndex + ' 行'
            ]

            this.items = this.items.concat(newPage)
          } else {
            // 如果没有新数据
            this.$refs.scroll.forceUpdate()
          }
        }, 1000)
      },
      updateScrollbar(val) {
        this.scrollbar = val
      },
      updateScrollbarFade(val) {
        this.scrollbarFade = val
      },
      updatePullDownRefresh(val) {
        this.pullDownRefresh = val
      },
      updatePullDownRefreshThreshold(val) {
        this.pullDownRefreshThreshold = val
      },
      updatePullDownRefreshStop(val) {
        this.pullDownRefreshStop = val
      },
      updatePullUpLoad(val) {
        this.pullUpLoad = val
      },
      updatePullUpLoadThreshold(val) {
        this.pullUpLoadThreshold = val
      },
      updatePullUpLoadMoreTxt(val) {
        this.pullUpLoadMoreTxt = val
      },
      updatePullUpLoadNoMoreTxt(val) {
        this.pullUpLoadNoMoreTxt = val
      },
      updateStartY(val) {
        this.startY = val
      },
      updateScrollToX(val) {
        this.scrollToX = val
      },
      updateScrollToY(val) {
        this.scrollToY = val
      },
      updateScrollToTime(val) {
        this.scrollToTime = val
      },
      updateScrollToEasing(val) {
        this.scrollToEasing = val
      },
      rebuildScroll() {
        Vue.nextTick(() => {
          this.$refs.scroll.destroy()
          this.$refs.scroll.initScroll()
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
