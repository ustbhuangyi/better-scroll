<template>
  <page class="navigator-view" :title="$t('examples.navList')" :desc="$t('navigatorPage.desc')">
    <div slot="content">
      <div class="navigator-container" ref="viewport">
        <navigator :navList="navList" @change="change" :currentTabIndex="currentTabIndex">
          <span slot="item" slot-scope="props" class="tab-name" :class="{'link-active':isCurrent(props.index)}">{{props.text}}</span>
        </navigator>
      </div>
      <div class="tab-render-content">
        <router-view></router-view>
      </div>
    </div>
  </page>
</template>

<script type="text/ecmascript-6">
  import Page from 'example/components/page/page.vue'
  import Navigator from 'example/components/navigator/navigator.vue'

  const navListEn = [
    {
      id: 1,
      name: 'slide'
    },
    {
      id: 2,
      name: 'form-list'
    },
    {
      id: 3,
      name: 'vertical-scroll'
    },
    {
      id: 4,
      name: 'goods-list'
    },
    {
      id: 5,
      name: 'picker'
    }
  ]
  const navListZh = [
    {
      id: 1,
      name: 'slide组件'
    },
    {
      id: 2,
      name: '表单组件'
    },
    {
      id: 3,
      name: '垂直滚动'
    },
    {
      id: 4,
      name: '商品列表'
    },
    {
      id: 5,
      name: 'picker组件'
    }
  ]

  export default {
    data() {
      return {
        navList: this.$i18n.locale === 'en' ? navListEn : navListZh,  // 渲染的列表数据
        currentTabIndex: 1 // 当前默认tab
      }
    },
    methods: {
      isCurrent (index) {
        return index === this.currentTabIndex
      },
      change (item) {
        if (item !== undefined) {
          this.currentTabIndex = item.id
        }

        // 以下部分编写点击相应的navList item时，渲染的逻辑代码
        this.$router.replace('/examples/nav-list/' + this.currentTabIndex + '/' + this.$i18n.locale)
      }
    },
    components: {
      Page,
      Navigator
    }
  }
</script>
<style lang='stylus' rel='stylesheet/stylus' type="text/stylus">
  .navigator-view
    .navigator-container
      height: 52px;
      background: #fff;
      box-shadow: 0 2px 3px rgba(0, 0, 0, .12)
      overflow: hidden;
    .tab-render-content
      position: absolute;
      left: 0;
      top: 50px;
      right: 0;
      bottom: 0;
      margin-top: 15px;
      padding: 15px;
      background: #fff;
      line-height: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
</style>
