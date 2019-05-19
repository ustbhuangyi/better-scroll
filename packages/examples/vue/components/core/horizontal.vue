<template>
  <div class="horizontal-container">
    <div class="scroll-wrapper" ref="scroll">
      <div class="scroll-content">
        <div class="scroll-item" v-for="(item, index) in emojis" :key="index">{{item}}</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from '@better-scroll/core'

  export default {
    data () {
      return {
        emojis: [
          '👉🏼 😁 😂 🤣 👈🏼',
          '😄 😅 😆 😉 😊',
          '😫 😴 😌 😛 😜',
          '👆🏻 😒 😓 😔 👇🏻',
          '😑 😶 🙄 😏 😣',
          '😞 😟 😤 😢 😭',
          '🤑 😲 ☹️ 🙁 😖',
          '👍 👎 👊 ✊ 🤛',
          '☝️ ✋ 🤚 🖐 🖖',
          '👍🏼 👎🏼 👊🏼 ✊🏼 🤛🏼',
          '☝🏽 ✋🏽 🤚🏽 🖐🏽 🖖🏽',
          '🌖 🌗 🌘 🌑 🌒'
        ]
      }
    },
    mounted() {
      this.init()
    },
    beforeDestroy() {
      this.bs.destroy()
    },
    methods: {
      init() {
        this.bs = new BScroll(this.$refs.scroll, {
          scrollX: true,
          probeType: 3 // listening scroll hook
        })
        this._registerHooks(['scroll', 'scrollEnd'], (pos) => {
          console.log('done')
        })
      },
      _registerHooks(hookNames, handler) {
        hookNames.forEach((name) => {
          this.bs.on(name, handler)
        })
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>

.horizontal-container
  .scroll-wrapper
    width 300px
    margin 80px auto
    white-space nowrap
    border 3px solid #42b983
    border-radius 5px
    overflow hidden
    .scroll-content
      display inline-block
    .scroll-item
      height 50px
      line-height 50px
      font-size 24px
      display inline-block
      text-align center
      padding 0 10px
</style>
