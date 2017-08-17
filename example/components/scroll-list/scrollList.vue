<template>
  <scroll :data="items" class="list-wrapper">
    <ul class="list-content">
      <li @click="clickItem($event,item)" class="list-item" v-for="item in items">{{item}}</li>
    </ul>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from '../scroll/scroll.vue'

  const COMPONENT_NAME = 'scroll-list'

  export default {
    name: COMPONENT_NAME,
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
    methods: {
      clickItem(e, item) {
        console.log(`${item} is clicked}`, e)
      }
    },
    components: {
      Scroll
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .scroll-content
    height: 100%

  .list-wrapper
    max-width 750px
    max-hight 1350px
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
