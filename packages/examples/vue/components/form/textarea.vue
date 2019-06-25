<template>
  <div class="textarea-container">
    <div ref="scroller" class="textarea-wrapper">
      <div class="textarea-scroller">
        <ul class="textarea-list">
          <li v-for="i of data1" :key="i" class="textarea-list-item">
          </li>
          <textarea class="textarea-text" name="" id="" cols="30" rows="10">Manipulating this area can not make BetterScroll work.</textarea>
          <li v-for="i of data2" :key="i + 10" class="textarea-list-item">
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import BScroll from '@better-scroll/core'
  import Pullup from '@better-scroll/pull-up'

  BScroll.use(Pullup)

  export default {
    data() {
      return {
        isPullUpLoad: false,
        data1: 10,
        data2: 10
      }
    },
    mounted() {
      this.initBscroll()
    },
    methods: {
      initBscroll() {
        this.bscroll = new BScroll(this.$refs.scroller, {
          autoBlur: true // for blur
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
.textarea-container
  height: 100%
.textarea-wrapper
  height: 100%
  padding: 0 10px
  border: 1px solid #ccc
  overflow: hidden
.textarea-list
  padding: 0
  text-align: center
.textarea-list-item
  padding: 10px 0
  height: 40px
  list-style: none
  border-bottom: 1px solid #ccc
.textarea-text
  border: 2px solid #62B791
  border-radius: 5px
  margin: 40px auto 0
  line-height: 2
  font-size: 20px
  height: 200px
</style>