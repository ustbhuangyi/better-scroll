<template>
  <page class="form-list-view" :title="$t('examples.formList')" :desc="$t('formListPage.desc')">
    <div slot="content">
      <scroll ref="scroll" :click="options.click" :tap="options.tap">
        <ul class="content" ref="formList">
          <li v-for="(item, index) in items" @click="click">
            <input type="checkbox" :value="index" v-model="checkedItems">
            <label>{{ $t('formListPage.previousTxt') + index + $t('formListPage.followingTxt') }}</label>
          </li>
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
          click: false,
          tap: true
        },
        items: Array(20),
        checkedItems: []
      }
    },
    components: {
      Page,
      Scroll
    },
    mounted() {
      let labelList = this.$refs.formList.querySelectorAll('label')
      console.log(labelList)
      labelList.forEach((item, index) => {
        item.addEventListener('tap', () => {
          console.log('tap item', index)
          const i = this.checkedItems.indexOf(index)
          i === -1 ? this.checkedItems.push(index) : this.checkedItems.splice(i, 1)
        })
      })
    },
    methods: {
      click() {
        console.log('click item')
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
</style>
