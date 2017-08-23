<template>
  <div class="page">
    <div class="flex-box">
      <header class="header">
        <h1>{{title}}</h1>
        <span @click="back" class="back">back</span>
      </header>
      <div ref="wrapper" class="page-content">
        <main class="main-content">
          <section v-show="desc" class="desc">
            <span>{{desc}}</span>
          </section>
          <div class="options">
            <div class="title sub">Options</div>
            <ul class="option-list">
              <slot name="options"></slot>
            </ul>
          </div>
          <div class="demo">
            <div class="title sub">Demo</div>
            <div class="scroll-list-wrap">
              <slot name="demo"></slot>
            </div>
          </div>
          <div class="methods">
            <div class="title sub">Methods</div>
            <ul class="method-list">
              <slot name="methods"></slot>
            </ul>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'optional-demo'

  export default {
    name: COMPONENT_NAME,
    props: {
      title: {
        type: String,
        default: '',
        required: true
      },
      desc: {
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

  @import "~common/stylus/variable.styl"

  .page
    position: fixed
    z-index: 20
    top: 0
    left: 0
    width: 100%
    height: 100%
    background: $color-white
    .flex-box
      width: 100%
      height: 100%
      display flex
      flex-direction column
      .header
        flex: 0 0 44px
        line-height: 44px
        text-align: center
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
      .page-content
        flex: 1 0 95%
        overflow scroll
        .title
          font-size: 1.5rem
          font-weight: 500
          color: $color-dark-grey
          padding: 1rem
          border-bottom: 1px solid rgba(0, 0, 0, .1)
          margin-bottom: 1rem
        .main-content
          display: flex
          justify-content: space-between
          flex-wrap: wrap
          .desc
            flex: 0 0 100%
            margin: 0.7rem 0
            @media screen and (min-width: 42rem)
              margin: 2rem 0
          .options
            @media screen and (min-width: 42rem)
              flex: 0 1 25%
            @media screen and (max-width: 42rem)
              flex: 0 1 100%
              margin-bottom: 1rem

            .option-list
              border: 1px solid rgba(0, 0, 0, .1)
              border-radius: $radius-size-medium
              li
                padding: 5px 0
                border-bottom: 1px solid rgba(0, 0, 0, .1)
          .demo
            @media screen and (min-width: 42rem)
              flex: 0 0 23rem
            @media screen and (max-width: 42rem)
              flex: 0 0 100%
              margin-bottom: 1rem

            .scroll-list-wrap
              position relative
              @media screen and (min-width: 42rem)
                height: 30rem
              @media screen and (max-width: 42rem)
                height: 26rem
              border: 1px solid rgba(0, 0, 0, .1)
              border-radius: $radius-size-medium
              transform: rotate(0deg) // fix 子元素超出边框圆角部分不隐藏的问题
              overflow: hidden
          .methods
            @media screen and (min-width: 42rem)
              flex: 0 1 25%
            @media screen and (max-width: 42rem)
              flex: 0 1 100%
            .method-list
              li
                display: flex
                width: 100%
                justify-content: center
                align-items: center
                transform: rotate(0deg) // fix 子元素超出边框圆角部分不隐藏的问题
                overflow: hidden
                input
                .button
                  flex: 1 1 50%
                  border: 1px solid rgba(0, 0, 0, .1)
                  padding: 0.5rem 1rem
                  line-height: 1.6rem
                input
                  border-radius: $radius-size-medium 0 0 $radius-size-medium
                  outline: none
                  &:focus
                    border-color: $color-green
                .button
                  border-radius: 0 $radius-size-medium $radius-size-medium 0
                  background-color: $color-green
                  border-color: $color-green
                  color: $color-white
</style>
