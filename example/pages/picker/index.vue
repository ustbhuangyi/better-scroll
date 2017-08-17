<template>
  <page class="picker-view" title="Picker（选择器）" desc="picker 组件是移动端常见的选择器组件，支持单列和多列；可以动态改变 picker 某列的数据，实现级联的效果。">
    <div slot="content">
      <div class="select" @click="showPicker(0)" ref="select0">单列筛选器示例 ...</div>
      <picker @select="handleSelect(0,arguments)" :selected-index="selectedIndex[0]"
              ref="picker0" :title="title[0]"></picker>
      <div class="select" @click="showPicker(1)" ref="select1">两列筛选器示例 ...</div>
      <picker @select="handleSelect(1,arguments)" :data="data[1]" :selected-index="selectedIndex[1]"
              ref="picker1" :title="title[1]" :cancelTxt="cancelTxt"
              :confirmTxt="confirmTxt"></picker>

      <div class="select" @click="showPicker(2)" ref="select2">三列选择器示例 ...</div>
      <picker @select="handleSelect(2,arguments)" :data="data[2]" :selected-index="selectedIndex[2]"
              ref="picker2" :title="title[2]"></picker>

      <div class="select" @click="showPicker(3)" ref="select3">变化选择器示例 ...</div>
      <picker @select="handleSelect(3,arguments)" :data="data[3]" :selected-index="selectedIndex[3]"
              ref="picker3" :title="title[3]"></picker>
    </div>
  </page>
</template>

<script type="text/ecmascript-6">
  import Page from 'example/components/page/page.vue'
  import Picker from 'example/components/picker/picker.vue'

  let data1 = [
    {
      text: '剧毒',
      value: 1
    }, {
      text: '蚂蚁',
      value: 2
    },
    {
      text: '幽鬼',
      value: 3
    },
    {
      text: '主宰',
      value: 4
    },
    {
      text: '卡尔',
      value: 5
    },
    {
      text: '宙斯',
      value: 6
    },
    {
      text: '巫医',
      value: 7
    }, {
      text: '巫妖',
      value: 8
    },
    {
      text: '神谕者',
      value: 9
    },
    {
      text: '撼地神牛',
      value: 10
    },
    {
      text: '蓝胖子',
      value: 11
    },
    {
      text: '水晶室女',
      value: 12
    },
    {
      text: '莉娜',
      value: 13
    },
    {
      text: '斯拉克',
      value: 14
    },
    {
      text: '斯拉达',
      value: 15
    }
  ]

  let data2 = [
    {
      text: '输出',
      value: 'a'
    }, {
      text: '控制',
      value: 'b'
    },
    {
      text: '核心',
      value: 'c'
    },
    {
      text: '爆发',
      value: 'd'
    },
    {
      text: '辅助',
      value: 'e'
    },
    {
      text: '打野',
      value: 'f'
    },
    {
      text: '逃生',
      value: 'g'
    }, {
      text: '先手',
      value: 'h'
    }
  ]

  let data3 = [
    {
      text: '梅肯',
      value: 's'
    }, {
      text: '秘法鞋',
      value: 'ss'
    },
    {
      text: '假腿',
      value: 'sss'
    },
    {
      text: '飞鞋',
      value: 'ssss'
    },
    {
      text: '辉耀',
      value: 'sssss'
    },
    {
      text: '金箍棒',
      value: 'ssssss'
    }
  ]

  let _data = [data1, data2, data3]

  export default {
    mounted() {
      this.$refs.picker0.setData([data1])
      this.$refs.picker0.setSelectedIndex([1])
    },
    data() {
      return {
        data: [
          [data1],
          [data1, data2],
          [data1, data2, data3],
          [_data[0]]
        ],
        selectedIndex: [
          [0],
          [1, 0],
          [0, 1, 2],
          [0]
        ],
        title: [
          '单列选择器',
          '两列选择器',
          '三列选择器',
          '变化选择器'
        ],
        cancelTxt: '关闭',
        confirmTxt: '好的',
        index: 0
      }
    },
    methods: {
      showPicker(index) {
        let picker = this.$refs['picker' + index]

        if (index === 3) {
          this.index = (this.index + 1) % 3
          picker.setData([_data[this.index]])
        }
        picker.show()
      },
      handleSelect(index, args) {
        let el = this.$refs['select' + index]
        let [selectedVal, selectedIndex] = args
        let data
        if (index === 3) {
          data = [_data[this.index]]
        } else {
          data = this.data[index]
        }
        let text = ''
        for (let i = 0; i < data.length; i++) {
          text += data[i][selectedIndex[i]].text + ' '
        }
        el.innerText = text
        console.log(selectedVal)
      }
    },
    components: {
      Page,
      Picker
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .picker-view
    .select
      margin: 0 10px 40px 10px
      height: 40px
      line-height: 40px
      border: 1px solid #e5e5e5
      text-align: center
      background: #fff

</style>
