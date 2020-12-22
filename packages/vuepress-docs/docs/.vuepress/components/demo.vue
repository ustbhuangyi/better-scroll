<template>
  <div class="demo-wrap">
    <div class="demo-nav">
      <i class="demo-nav-btn icon-code" @click='toggleCode'>
        <!-- more details in https://github.com/tailwindlabs/heroicons -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" :stroke="codeIconColor">
          <path stroke-linecap="round" stroke-linejoin="round" :stroke-width="codeIconWidth" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      </i>
      <v-popover v-if="!hideQrcode" placement='right' :offset ='10' trigger='click'>
        <i class="demo-nav-btn icon-qrcode">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#666">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        </i>
        <template slot="popover">
          <qr-code
            :url="fullQrcodeUrl"
            :size="100"
            error-level="L">
          </qr-code>
        </template>
      </v-popover>
      <i class="demo-nav-btn icon-preview" @click='toPreview'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#666">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </i>
    </div>
    <div class="demo-code" v-show="showCode">
        <div class="demo-code-nav">
          <button
            v-for="(config, index) in codeNavConfigs"
            :class="['demo-code-btn', codeNavIndex === index ? 'active' : '']"
            @click="codeNavBtnHandler(index)">{{config.title}}</button>
        </div>
        <div class="demo-code-content">
          <div
            class="demo-code-item"
            v-for="(config, index) in codeNavConfigs"
            v-show="codeNavIndex === index">
            <slot :name="config.slotName"></slot>
          </div>
          <i class="demo-code-content-copy" @click='copyCode'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#ccc">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
          </i>
          <transition name="slide-fade">
            <span class="demo-code-content-copied" v-if="copied">Copied</span>
          </transition>
        </div>
    </div>
    <div class="demo-main">
      <div class="demo-component-wrap">
        <slot name="demo"></slot>
      </div>
    </div>
  </div>
</template>
<script>
import QrCode from './qrcode.vue'
//TODO replate url when publich 2.0
const FALLBACK_URL = 'https://ustbhuangyi.github.io/better-scroll/#/'
const BASE_URL = process.env.NODE_ENV === 'production' ?
  'https://better-scroll.github.io/examples/#/' :
   `http://${LOCAL_IP}:8932/#/`

export default {
  name: 'demo',
  components: { QrCode },
  props: {
    qrcodeUrl: {
      type: String,
      default: ''
    },
    renderCode: {
      type: Boolean,
      default: false
    },
    hideQrcode: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    fullQrcodeUrl() {
      return `${BASE_URL}${this.qrcodeUrl}`
    },
    codeIconColor() {
      return this.showCode ? '#000' : '#666'
    },
    codeIconWidth() {
      return this.showCode ? 3 : 2
    }
  },
  data() {
    return {
      showCode: this.renderCode,
      copied: false,
      codeNavIndex: 0,
      codeNavConfigs: []
    }
  },
  created () {
    // dynamic generating demo code configs
    this.makeCodeNavConfigs()
  },
  methods: {
    toggleCode() {
      this.showCode = !this.showCode
    },
    toPreview() {
      window.open(`${BASE_URL}${this.qrcodeUrl}`)
    },
    copyCode () {
      const pre = this.$el.querySelectorAll('pre')[this.codeNavIndex]
      pre.setAttribute('contenteditable', 'true')
      pre.focus()
      document.execCommand('selectAll', false, null)
      this.copied = document.execCommand('copy')
      pre.removeAttribute('contenteditable')
      setTimeout(() => { this.copied = false }, 1000)
    },
    codeNavBtnHandler (i) {
      this.codeNavIndex = i
    },
    makeCodeNavConfigs () {
      const slots = this.$slots
      const keys = ['code-template', 'code-script', 'code-style']
      const configs = []
      let title
      keys.forEach(key => {
        if (slots[key]) {
          title = key.replace('code-', '').replace(/^\S/, s => s.toUpperCase())
          configs.push({
            title,
            slotName: key
          })
        }
      })
      this.codeNavConfigs = configs
    }
  }
}
</script>
<style lang="stylus">
.demo-wrap
  margin: 20px 0
  box-shadow 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)
  text-decoration: none
  .demo-nav
    display flex
    flex-direction row
    flex-wrap nowrap
    align-items center
    height 48px
    background-color #f5f5f5
    color rgba(0,0,0,0.87)
    .demo-nav-btn
      cursor pointer
      margin-left 8px
      font-size 22px
      font-weight bold
      align-items center
      outline 0
      border 0
      background-size 100%
      width 26px
      height 26px
      line-height 26px
      display inline-block
  .demo-code
    background-color rgb(45, 45, 45)
    border-color rgb(45, 45, 45)
    color #fff
    pre
      margin 0!important
    .demo-code-nav
      display flex
      flex-direction row
      flex-wrap nowrap
      justify-content flex-start
      align-items center
      height 48px
      border-bottom: 1px solid rgba(255,255,255,0.12)
      .demo-code-btn
        display block
        padding 0 16px
        margin 0 8px
        height 32px
        line-height 32px
        font-size 16px
        border-radius 28px
        outline none
        cursor pointer
        background-color transparent
        color white
        border none
        &.active
          background #f5f5f5
          color black
          transition all .3s ease
    .demo-code-content
      max-height 350px
      overflow-y auto
      position relative
      .demo-code-content-copy
        cursor pointer
        position absolute
        top 30px
        right 10px
        z-index 100
        width 26px
        height 26px
      .demo-code-content-copied
          position absolute
          top 30px
          right 50px
          z-index 100
  .demo-main
    padding 16px
    background #fff
    .demo-component-wrap
      margin 0 auto
      max-width 350px
      height 400px
      background #f1f2f3
      overflow hidden

.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>


