<template>
  <div class="core-container">
    <div class="scroll-wrapper" ref="scroll">
      <div class="scroll-content">
        <div class="scroll-item" v-for="(item, index) in emojis1" :key="index">{{item}}</div>
      </div>
      <div class="scroll-content">
        <div class="scroll-item" v-for="(item, index) in emojis2" :key="index">{{item}}</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from '@better-scroll/core'
  import Movable from '@better-scroll/movable'

  BScroll.use(Movable)

  export default {
    data () {
      return {
        emojis1: [
          '😀 😁 😂 🤣 😃',
          '😄 😅 😆 😉 😊',
          '😫 😴 😌 😛 😜',
          '👆🏻 😒 😓 😔 👇🏻'
        ],
        emojis2: [
          '👍🏼 👎🏼 👊🏼 ✊🏼 🤛🏼',
          '☝🏽 ✋🏽 🤚🏽 🖐🏽 🖖🏽',
          '🌖 🌗 🌘 🌑 🌒',
          '💫 💥 💢 💦 💧'
        ]
      }
    },
    mounted() {
      this.init()
    },
    beforeDestroy() {
      this.bs1.destroy()
      this.bs2.destroy()
    },
    methods: {
      init() {
        this.bs1 = new BScroll(this.$refs.scroll, {
          bindToTarget: true,
          scrollX: true,
          scrollY: true,
          freeScroll: true,
          movable: true,
          startX: 20,
          startY: 20
        })
        this.bs2 = new BScroll(this.$refs.scroll, {
          // use wrapper.children[1] as content
          specifiedIndexAsContent: 1,
          bindToTarget: true,
          scrollX: true,
          scrollY: true,
          freeScroll: true,
          movable: true,
          startX: 50,
          startY: 50
        })

        setTimeout(() => {
          this.bs2.putAt('center', 'center')
        }, 3000)
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>

.core-container
  .scroll-wrapper
    height 400px
    overflow hidden
    position relative
    box-shadow 0 0 3px rgba(0, 0, 0, .3)
    .scroll-content
      position absolute
      top 0
      left 0
      width 220px
    .scroll-item
      height 50px
      line-height 50px
      font-size 24px
      font-weight bold
      border-bottom 1px solid #eee
      text-align center
      &:nth-child(2n)
        background-color #f3f5f7
      &:nth-child(2n+1)
        background-color #42b983
</style>
