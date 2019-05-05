<template>
  <div class="demo-wrap">
    <div class="demo-nav">
      <i class="demo-nav-btn icon-code" @click='toggleCode'></i>
      <v-popover v-if="!hideQrcode" placement='right' :offset ='10' trigger='click'>
        <i class="demo-nav-btn icon-qrcode"></i>
        <template slot="popover">
          <qr-code
            :url="fullQrcodeUrl"
            :size="100"
            error-level="L">
          </qr-code>
        </template>
      </v-popover>
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
          <i class="demo-code-content-copy icon-copy" @click='copyCode'></i>
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
  'https://ustbhuangyi.github.io/better-scroll/#/' :
   `http://${LOCAL_IP}:8932/#/`

export default {
  name: 'demo',
  components: { QrCode },
  props: {
    qrcodeUrl: {
      type: String,
      default: ''
    },
    hideQrcode: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    fullQrcodeUrl() {
      return `${BASE_URL}${this.qrcodeUrl}`
    }
  },
  data() {
    return {
      showCode: false,
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
      margin-left 6px
      font-size 22px
      font-weight bold
      align-items center
      outline 0
      border 0
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
        position absolute
        top 30px
        right 10px
        z-index 100
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


