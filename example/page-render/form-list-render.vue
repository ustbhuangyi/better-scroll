<template>
  <div class="form-list-render-view">
    <scroll ref="scroll" :click="options.click" :tap="options.tap" :listenBeforeScroll="options.listenBeforeScroll"
            @beforeScrollStart="beforeScrollStart">
      <ul class="content" ref="formList">
        <template v-for="(item, index) in items">
          <li ref="listItem" @click="clickItem(index)">
            <input :id="'input'+index" type="checkbox" :value="index" v-model="checkedItems">
            <label @click.stop
                   :for="'input'+index">{{ $t('formListPage.previousTxt') + index + $t('formListPage.followingTxt')
              }}</label>
            <input class="text-input" @click.stop="clickInpunt(index)" type="text" @focus="focusHandle(index)"
                   @blur="blurHandle(index)">
            <span>input {{ index }}</span>
            <a href="https://github.com/didi/cube-ui">cube-ui</a>
            <button @click.stop="clickButton(index)">click me</button>
          </li>
        </template>
      </ul>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'example/components/scroll/scroll.vue'

  export default {
    data() {
      return {
        options: {
          click: true,
          listenBeforeScroll: true // 用于input blur
        },
        items: Array(10),
        checkedItems: []
      }
    },
    components: {
      Scroll
    },
    mounted() {
    },
    methods: {
      clickItem(index) {
        console.log('click item', index)
      },
      clickInpunt(index) {
        console.log('click input', index)
      },
      clickButton(index) {
        console.log('click button', index)
      },
      // supported in better-scroll core
      beforeScrollStart() {
//        let inputList = this.$refs.formList.querySelectorAll('.text-input')
//        inputList.forEach((item) => {
//          item.blur()
//        })
      },
      focusHandle(index) {
        console.log(`input ${index}: focus`)
      },
      blurHandle(index) {
        console.log(`input ${index}: blur`)
      }
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .form-list-render-view
    position: absolute
    top: 0
    left: 0
    bottom: 0
    right: 0
    .content
      li
        padding: 30px
        border-bottom: 1px solid #e5e5e5
        .text-input
          border: 1px solid #e5e5e5
          border-radius: 3px
</style>
