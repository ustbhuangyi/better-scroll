<template>
  <page class="form-list-view" :title="$t('examples.formList')" :desc="$t('formListPage.desc')">
    <div slot="content">
      <scroll ref="scroll" :click="options.click" :tap="options.tap" :listenBeforeScroll="options.listenBeforeScroll"
              @beforeScrollStart="beforeScrollStart">
        <ul class="content" ref="formList">
          <template v-for="(item, index) in items">
            <li ref="listItem" @click="clickItem(index)">
              <input :id="'input'+index" type="checkbox" :value="index" v-model="checkedItems">
              <label @click.stop :for="'input'+index">{{ $t('formListPage.previousTxt') + index + $t('formListPage.followingTxt')
                }}</label>
              <input class="text-input" type="text" @focus="focusHandle(index)" @blur="blurHandle(index)">
              <span>input {{ index }}</span>
            </li>
          </template>
        </ul>
      </scroll>
    </div>
  </page>
</template>

<script type="text/ecmascript-6">
  import Page from 'example/components/page/page.vue'
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
      Page,
      Scroll
    },
    mounted() {
    },
    methods: {
      clickItem(index) {
        console.log('click item', index)
      },
      // 用于input blur
      beforeScrollStart() {
        let inputList = this.$refs.formList.querySelectorAll('.text-input')
        inputList.forEach((item) => {
          item.blur()
        })
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
  .form-list-view
    .content
      li
        padding: 30px
        border-bottom: 1px solid #e5e5e5
        .text-input
          border: 1px solid #e5e5e5
          border-radius: 3px
</style>
