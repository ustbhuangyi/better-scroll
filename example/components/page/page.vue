<template>
  <div class="page">
    <header class="header">
      <h1>{{title}}</h1>
      <img class="back" :src="backIcon" @click="back" alt="back"/>
    </header>
    <div class="wrapper">
      <section v-show="desc" class="desc">
        <slot name="desc">{{desc}}</slot>
      </section>
      <main class="content">
        <slot name="content">{{content}}</slot>
      </main>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: '',
        required: true
      },
      desc: {
        type: String,
        default: ''
      },
      content: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        backIcon: require('../../common/images/back.svg')
      }
    },
    methods: {
      back() {
        this.$router.back()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"

  .page
    position: fixed
    z-index: 20
    top: 0
    left: 0
    width: 100%
    height: 100%
    background: #efeff4
    .header
      position: relative
      height: 44px
      line-height: 44px
      text-align: center
      background-color: #f7f7f7
      box-shadow: 0 1px 6px #ccc
      -webkit-backface-visibility: hidden
      backface-visibility: hidden
      z-index: 99
      h1
        margin: 0
        font-size: 16px
        color: $color-main
      .back
        position: absolute
        top: 9px
        left: 15px
        width: 26px
        color: $color-main
    .wrapper
      width: 100%
      display: flex
      flex-direction: column
      height: calc(100% - 44px)
      overflow: hidden
      -webkit-overflow-scrolling: touch
      .desc
        padding: 10px
        margin: 10px 0
        line-height: 20px
        font-size: 14px
      .content
        flex: 1
        position: relative
        margin: 10px
</style>
