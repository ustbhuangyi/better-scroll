<template>
  <div class="page">
    <div class="back">
    </div>
    <div v-if="items.length" class="slider-wrapper">
      <slide ref="slide" :autoPlay="false" :loop="false">
        <div v-for="(item, index) in items">
          <div class="full-page-img-wrapper">
            <img :src="item"/>
            <div v-if="index === items.length -1" class="button-wrapper" @click="handleClick(index)">
              <span class="button">开始使用</span>
            </div>
          </div>
        </div>
      </slide>
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
      handleClick(index) {
        if (index === this.items.length - 1) {
          this.$router.back()
        } else {
          this.$refs.slide.next()
        }
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
      img
        width: 100%
        height: 100%
      .button-wrapper
        position: absolute
        top: 510px
        display: block
        width: 33%
        overflow: hidden
        .button
          display: inline-block
          width: 130px
          padding: 15px 0
          border: 4px solid rgba(255, 255, 255, 0.8)
          border-radius: 4px
          color: rgba(255, 255, 255, 0.8)
          font-size: $fontsize-large-xx
</style>
