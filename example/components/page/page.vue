<template>
  <div class="page">
    <header class="header">
      <h1>{{title}}</h1>
      <span @click="back" class="back">back</span>
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
    methods: {
      back() {
        this.$router.back()
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
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
        font-weight: 700
      .back
        position: absolute
        top: 0
        left: 0
        padding: 0 15px
        font-size: 14px
        color: rgb(0, 160, 220)
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
