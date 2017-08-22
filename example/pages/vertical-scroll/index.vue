<template>
  <optional-demo class="scroll-view" title="普通 Scroll 组件" desc="基于 BScroll 实现垂直滚动列表组件">
    <div slot="options">
      <li>
        <switch-option name="scrollbar" :value="scrollbar"
                       @update:value="updateScrollbar"></switch-option>
      </li>
      <li>
        <switch-option name="pull down refresh" :value="pullDownRefresh"
                       @update:value="updatePullDownRefresh"></switch-option>
      </li>
      <li>
        <switch-option name="pull up load" :value="pullUpLoad"
                       @update:value="updatePullUpLoad"></switch-option>
      </li>
    </div>
    <div slot="demo">
      <scroll ref="scrollList"
              :data="items"
              :scrollbar="scrollbar"
              :pullDownRefresh="pullDownRefresh"
              :pullUpLoad="pullUpLoad"
              @pullingDown="onPullingDown"
              @pullingUp="onPullingUp">
      </scroll>
    </div>
    <div slot="methods">
      <li>
        <input type="text" placeholder="Y:number" v-model="y">
        <div class="button" @click="scrollTo">scrollTo</div>
      </li>
    </div>
  </optional-demo>
</template>

<script type="text/ecmascript-6">
  import OptionalDemo from 'example/components/optional-demo/optionalDemo.vue'
  import Scroll from 'example/components/scroll/scroll.vue'
  import SwitchOption from 'example/components/switch-option/switchOption.vue'

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
      OptionalDemo,
      Scroll,
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
      },
      updateScrollbar(val) {
        this.scrollbar = val
      },
      updatePullDownRefresh(val) {
        this.pullDownRefresh = val
      },
      updatePullUpLoad(val) {
        this.pullUpLoad = val
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
