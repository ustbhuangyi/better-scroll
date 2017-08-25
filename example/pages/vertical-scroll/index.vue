<template>
  <optional-demo class="scroll-view" title="普通 Scroll 组件" desc="基于 BScroll 实现垂直滚动列表组件">
    <div slot="options">
      <div class="group">
        <li>
          <switch-option name="滚动条" :value="scrollbar"
                         @update:value="updateScrollbar"></switch-option>
        </li>
        <li v-if="scrollbar" class="sub first last">
          <switch-option name="fade" :value="scrollbarFade"
                         @update:value="updateScrollbarFade"></switch-option>
        </li>
      </div>

      <div class="group">
        <li>
          <switch-option name="下拉刷新" :value="pullDownRefresh"
                         @update:value="updatePullDownRefresh"></switch-option>
        </li>
        <li v-if="pullDownRefresh" class="sub first">
          <input-option name="threshold (≥ 40)" :value="pullDownRefreshThreshold" min-value="40"
                        @update:value="updatePullDownRefreshThreshold"></input-option>
        </li>
        <li v-if="pullDownRefresh" class="sub last">
          <input-option name="stop (≥ 40)" :value="pullDownRefreshStop" min-value="40"
                        @update:value="updatePullDownRefreshStop"></input-option>
        </li>
      </div>
      <div class="group">
        <li>
          <switch-option name="上拉加载" :value="pullUpLoad"
                         @update:value="updatePullUpLoad"></switch-option>
        </li>
        <li v-if="pullUpLoad" class="sub first last">
          <input-option name="threshold" :value="pullUpLoadThreshold"
                        @update:value="updatePullUpLoadThreshold"></input-option>
        </li>
      </div>
      <div class="group">
        <li>
          <input-option name="startY" :value="startY"
                        @update:value="updateStartY"></input-option>
        </li>
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
        <li>
          <input-option name="x" :value="scrollToX"
                         @update:value="updateScrollToX"></input-option>
        </li>
        <li>
          <input-option name="y" :value="scrollToY"
                         @update:value="updateScrollToY"></input-option>
        </li>
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
        pullUpLoadThreshold: 50,
        startY: 0,
        scrollToX: 0,
        scrollToY: 0,
        y: 300,
        items: _data,
        itemIndex: _data.length
      }
    },
    components: {
      OptionalDemo,
      Scroll,
      SwitchOption,
      InputOption
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
        return this.pullDownRefresh ? {threshold: parseInt(this.pullDownRefreshThreshold), stop: parseInt(this.pullDownRefreshStop)} : false
      },
      pullUpLoadObj: function () {
        return this.pullUpLoad ? {threshold: parseInt(this.pullUpLoadThreshold)} : false
      }
    },
    methods: {
      scrollTo() {
        this.$refs.scroll.scrollTo(-this.scrollToX, -this.scrollToY)
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
      updateStartY(val) {
        this.startY = val
      },
      updateScrollToX(val) {
        this.scrollToX = val
      },
      updateScrollToY(val) {
        this.scrollToY = val
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
