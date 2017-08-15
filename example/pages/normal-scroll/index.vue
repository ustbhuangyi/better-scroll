<template>
  <page class="scroll-view" title="Scroll（普通滚动列表组件）" desc="基于 better-scroll 可以实现一个普通的滚动列表组件">
    <div slot="content" class="scroll-content">
      <scroll :data="items" class="list-wrapper">
        <ul class="list-content">
          <li class="list-item" v-for="item in items">{{item}}</li>
        </ul>
      </scroll>
    </div>
  </page>
</template>

<script type="text/ecmascript-6">
  import Page from 'example/components/page/page.vue'
  import Scroll from 'example/components/scroll/scroll.vue'

  export default {
    data() {
      return {
        items: [
          '我是第一行',
          '我是第二行',
          '我是第三行',
          '我是第四行',
          '我是第五行',
          '我是第六行',
          '我是第七行',
          '我是第八行',
          '我是第九行',
          '我是第十行',
          '我是第十一行',
          '我是第十二行',
          '我是第十三行',
          '我是第十四行',
          '我是第十五行',
          '我是第十六行',
          '我是第十七行',
          '我是第十八行',
          '我是第十九行',
          '我是第二十行',
          '我是第二十一行',
          '我是第二十二行',
          '我是第二十三行',
          '我是第二十四行',
          '我是第二十五行',
          '我是第二十六行',
          '我是第二十七行',
          '我是第二十八行',
          '我是第二十九行'
        ]
      }
    },
    components: {
      Page,
      Scroll
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .scroll-content
    height: 100%

  .list-wrapper
    position: absolute
    left: 0
    top: 0
    right: 0
    bottom: 0
    overflow: hidden
    background: #fff
    .list-content
      position: relative
      z-index: 10
      background: #fff
      .list-item
        height: 60px
        line-height: 60px
        font-size: 18px
        padding-left: 20px
        border-bottom: 1px solid #e5e5e5
</style>