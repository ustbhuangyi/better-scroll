<template>
  <picker @select="handleSelect(arguments)" :data="linkageData" :selected-index="selectedIndex"
          ref="picker" :title="title" @change="handleChange" :cancelTxt="cancelTxt" :confirmTxt="confirmTxt"></picker>
</template>

<script type="text/ecmascript-6">
  import Picker from '../picker/picker.vue'

  const COMPONENT_NAME = 'city-picker'

  export default {
    name: COMPONENT_NAME,
    components: {
      Picker
    },
    props: {
      data: {
        type: Array,
        default: []
      },
      title: {
        type: String
      },
      selectedIndex: {
        type: Array,
        default: [0, 0, 0]
      },
      cancelTxt: {
        type: String
      },
      confirmTxt: {
        type: String
      }
    },
    data() {
      return {
        tempIndex: [0, 0, 0]
      }
    },
    computed: {
      linkageData() {
        const [provinceList, cityList, areaList] = this.data
        const provinces = provinceList
        const cities = cityList[provinces[this.tempIndex[0]].value]
        const areas = areaList[cities[this.tempIndex[1]].value]

        return [provinces, cities, areas]
      }
    },
    watch: {
      linkageData() {
        this.$refs.picker.refresh()
      }
    },
    methods: {
      show() {
        this.$refs.picker.setData(this.linkageData)
        this.$refs.picker.show()
      },
      handleSelect(args) {
        this.$emit('select', ...args)
      },
      handleChange(i, newIndex) {
        if (newIndex !== this.tempIndex[i]) {
          for (let j = 2; j > i; j--) {
            this.tempIndex.splice(j, 1, 0)
            this.$refs.picker.scrollTo(j, 0)
          }

          this.tempIndex.splice(i, 1, newIndex)
        }
      }
    }
  }
</script>
