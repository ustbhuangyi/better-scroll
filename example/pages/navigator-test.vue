<template>
  <page class="navigator-view" :title="$t('examples.navList')" :desc="$t('navigatorPage.desc')">
    <div slot="content">
      <div class="scroll-container" ref="viewport" >
        <!--<scroll ref="scroll" direction="horizontal">-->
          <ul class="tab-list" ref="tabList">
            <li v-for="item in navList" class="tab-item" @click="selectNav(item)">
              <span class="tab-name" :class="{'link-active':isCurrent(item)}">{{item.name}}
              </span>
            </li>
          </ul>
        <!--</scroll>-->
      </div>
      <div class="tab-render-content">
        <router-view></router-view>
      </div>
    </div>
  </page>
</template>

<script type="text/ecmascript-6">
  import Page from 'example/components/page/page.vue'
//  import Scroll from 'example/components/scroll/scroll.vue'
  import BScroll from '../../src/index'
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
  const items = [
    [
      {
        linkUrl: 'http://y.qq.com/w/album.html?albummid=0044K2vN1sT5mE',
        picUrl: 'http://y.gtimg.cn/music/photo_new/T003R720x288M000001YCZlY3aBifi.jpg',
        id: 11351
      },
      {
        linkUrl: 'https://y.qq.com/m/digitalbum/gold/index.html?_video=true&id=2197820&g_f=shoujijiaodian',
        picUrl: 'http://y.gtimg.cn/music/photo_new/T003R720x288M000004ckGfg3zaho0.jpg',
        id: 11372
      }
    ],
    [
      {
        linkUrl: 'http://y.qq.com/w/album.html?albummid=001tftZs2RX1Qz',
        picUrl: 'http://y.gtimg.cn/music/photo_new/T003R720x288M00000236sfA406cmk.jpg',
        id: 11378
      },
      {
        linkUrl: 'https://y.qq.com/msa/218/0_4085.html',
        picUrl: 'http://y.gtimg.cn/music/photo_new/T003R720x288M000001s0BXx3Zxcwb.jpg',
        id: 11375
      },
      {
        linkUrl: 'https://y.qq.com/m/digitalbum/gold/index.html?_video=true&id=2195876&g_f=shoujijiaodian',
        picUrl: 'http://y.gtimg.cn/music/photo_new/T003R720x288M000002cwng4353HKz.jpg',
        id: 11287
      }
    ]
  ]

  export default {
    computed: {
      data() {
        return items[this.index]
      }
    },
    data() {
      return {
        navList: this.$i18n.locale === 'en' ? navListEn : navListZh,
        renderData: '',
        currentTabId: 1,
        scrollbar: true,
        index: 0
      }
    },
    mounted() {
      this._initTabListWidth()
      this._initScroll()
      this._adjust(this.currentTabId)
    },
    methods: {
      isCurrent (item) {
        return item.id === this.currentTabId
      },
      selectNav (item) {
        this.currentTabId = item.id
        this.renderData = item.name
        this._adjust(item.id)
        this.$router.replace('/examples/nav-list/' + item.id + '/' + this.$i18n.locale)
      },
      _initTabListWidth() {
        const tabList = this.$refs.tabList
        const items = tabList.children
        let width = 0
        for (let i = 0; i < items.length; i++) {
          width += items[i].clientWidth
          console.log(width)
        }
        tabList.style.width = width + 'px'
      },
      _initScroll() {
        this.scroll = new BScroll(this.$refs.viewport, {
          click: true,
          scrollX: true,
          probeType: 3,
          disableMouse: true,
          eventPassthrough: 'vertical'
        })
      },
      _adjust(tabId) {
        const viewportWidth = this.$refs.viewport.clientWidth
        const tabListWidth = this.$refs.tabList.clientWidth
        const minTranslate = Math.min(0, viewportWidth - tabListWidth)
        const middleTranslate = viewportWidth / 2
        const items = this.$refs.tabList.children
        let width = 0
        this.navList.every((item, index) => {
          if (item.id === tabId) {
            return false
          }
          width += items[index].clientWidth
          return true
        })
        let translate = middleTranslate - width
        translate = Math.max(minTranslate, Math.min(0, translate))
        this.$refs.scroll.scrollTo(translate, 0, 300)
      }
    },
    components: {
        Page
//        Scroll
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus' type="text/stylus">
  .navigator-view
    .scroll-container
      height: 52px;
      background: #fff;
      box-shadow: 0 2px 3px rgba(0, 0, 0, .12)
      overflow: hidden;
      /*.scroll-wrapper*/
        /*background: none*/
        /*.scroll-content*/
          /*display: inline-block*/
          /*width: 100%*/
          /*overflow: hidden*/
        .tab-list
          margin: 0 auto
          white-space: nowrap;
          .tab-item
            display: inline-block
            line-height: 54px;
            .tab-name
             display: block
             position: relative
             padding: 0 15px 0 14px
             font-size: 14px
             color: #666
             &.link-active
               transition: all 0.2s
               transform: scale(1.04)
               color: #fc9153
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
