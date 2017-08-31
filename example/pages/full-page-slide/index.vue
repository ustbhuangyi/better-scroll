<template>
  <div class="page">
    <div v-if="items.length" class="slider-wrapper">
      <slide ref="slide">
        <div v-for="item in items">
          <img :src="item">
        </div>
      </slide>
    </div>
    <div class="back">
      <img :src="backIconUrl" @click="back"/></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Slide from '../../components/slide/slide.vue'

  export default {
    data() {
      return {
        items: [
          require('../../common/images/spring2.jpeg'),
          require('../../common/images/summer2.jpeg'),
          require('../../common/images/winter3.jpeg'),
          require('../../common/images/winter4.jpeg')
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
  .page
    position: fixed
    z-index: 20
    top: 0
    left: 0
    width: 100%
    height: 100%
    background: #efeff4
    .slider-wrapper
      width: 100%
      height: 100%
    .back
      position: absolute
      top: 20px
      left: 15px
      img
        width: 30px
        height: 30px
</style>
