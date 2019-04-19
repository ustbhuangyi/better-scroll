<template>
  <div class="demo-wrap">
    <div class="demo-nav">
      <i class="demo-nav-btn icon-code" @click='codeBtnHandler'></i>
      <v-popover placement='right' :offset ='10' trigger='hover'>
        <i class="demo-nav-btn icon-qrcode"></i>
        <template slot="popover">
          <qr-code
            text="https://www.baidu.com/"
            :size="60"
            error-level="L">
          </qr-code>
        </template>
      </v-popover>


    </div>
    <div class="demo-code" v-show="showCode">
        <div class="demo-code-nav">
          <button class="demo-code-btn active">VUE</button>
        </div>
        <div class="demo-code-content">
          <slot name="code"></slot>
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
export default {
  name: 'demo',
  data() {
    return {
      showCode: false
    }
  },
  methods: {
    codeBtnHandler() {
      this.showCode = !this.showCode
    }
  }
}
</script>
<style lang="stylus">
.demo-wrap
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
    height 400px
    overflow scroll
    .demo-code-nav
      padding 0 16px
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
        height 30px
        line-height 30px
        font-size 16px
        font-weight bold
        &.active
          background #f5f5f5
          border-radius 28px
  .demo-main
    padding 16px
    background #fff
    .demo-component-wrap
      margin 0 auto
      max-width 350px
      height 400px
      background #f1f2f3
      overflow hidden
</style>


