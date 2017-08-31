<template>
  <div class="page">
    <div v-if="items.length" class="slider-wrapper">
      <slide ref="slide">
        <div v-for="item in items">
          <div class="full-page-img-wrapper">
            <img :src="item"/>
          </div>
        </div>
      </slide>
    </div>
    <div class="back">
      <div @click="back">开始使用</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Slide from '../../components/slide/slide.vue'

  export default {
    data() {
      return {
        items: [
          require('../../common/images/full-page-pic-3.jpeg'),
          require('../../common/images/full-page-pic-2.jpeg'),
          require('../../common/images/full-page-pic-1.jpeg')
        ],
        backIconUrl: require('../../common/images/back.svg')
      }
    },
    components: {
      Slide
    },
    methods: {
      back() {
        this.$router.back()
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable.styl"

  .page
    position: fixed
    z-index: 20
    top: 0
    left: 0
    width: 100%
    height: 100%
    background: #efeff4
    overflow: hidden
    .full-page-img-wrapper
      position: absolute 0 0 0 0
    .back
      position: absolute
      bottom: 60px
      left: 32%
      width: 36%
      line-height: 50px
      text-align: center
      font-size: $fontsize-large-xx
      border: 4px solid rgba(255, 255, 255, 0.8)
      border-radius: 4px
      color: rgba(255, 255, 255, 0.8)
</style>
