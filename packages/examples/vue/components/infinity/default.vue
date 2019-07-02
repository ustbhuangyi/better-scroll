<template>
  <div class="infinity">
    <div class="template" v-once>
      <li ref="message" class="infinity-item">
        <div class="infinity-content"></div>
      </li>
      <li ref="tombstone" class="infinity-item tombstone">
        <div class="infinity-content">tombstone</div>
      </li>
    </div>
    <div ref="chat" class="infinity-timeline">
      <ul>
      </ul>
    </div>
  </div>
</template>

<script>
  import BScroll from '@better-scroll/core'
  import InfinityScroll from '@better-scroll/infinity'

  BScroll.use(InfinityScroll)

  export default {
    name: 'infinity',
    created() {
      this.nextItem = 0
      this.pageNum = 0
    },
    mounted() {
      this.$nextTick(() => {
        this.createInfinityScroll()
      })
    },
    methods: {
      createInfinityScroll() {
        this.scroll = new BScroll(this.$refs.chat, {
          observeDOM: false,
          // useTransition: false,
          // useTransform: false,
          infinity: {
            render: (item, div) => {
              div = div || this.$refs.message.cloneNode(true)
              div.dataset.id = item.id
              div.querySelector('.infinity-content').innerHTML = '我是 item ' + item.id

              return div
            },
            createTombstone: () => {
              return this.$refs.tombstone.cloneNode(true)
            },
            fetch: (count) => {
              // Fetch at least 30 or count more objects for display.
              count = Math.max(30, count)
              return new Promise((resolve, reject) => {
                // Assume 50 ms per item.
                setTimeout(() => {
                  if (this.pageNum++ > 20) {
                    resolve(false)
                  } else {
                    let items = []
                    for (let i = 0; i < Math.abs(count); i++) {
                      items[i] = { id: this.nextItem++ }
                    }
                    resolve(items)
                  }
                }, 1000)
              })
            }
          }
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .infinity
    height: 100%
  .template
    display: none

  .infinity-timeline
    position: relative
    height: 100%
    padding: 0 10px
    border: 1px solid #ccc
    overflow: hidden
    will-change: transform

  .infinity-timeline > ul
    -webkit-backface-visibility: hidden
    -webkit-transform-style: flat

  .infinity-item
    padding: 10px 0
    list-style: none
    border-bottom: 1px solid #ccc
    contain: layout
    will-change: transform
</style>
