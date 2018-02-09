<template>
  <div class="goods-list-render-view">
    <div class="scroll-wrapper">
      <div ref="scroll" class="scroll">
        <ul class="foods-wrapper">
          <li v-for="food in foods" class="food-item border-1px">
            <div class="icon">
              <img width="57" height="57" :src="food.icon">
            </div>
            <div class="content">
              <h2 class="name">{{food.name}}</h2>
              <p class="desc">{{food.description}}</p>
              <div class="extra">
                <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
              </div>
              <div class="price">
                <span class="now">￥{{food.price}}</span>
                <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import Scroll from 'example/components/scroll/scroll'
  import data from 'example/data/goods-list.json'
  import BScroll from 'scroll/index'

  let _foods = []

  data.goods.forEach((item) => {
    _foods = _foods.concat(item.foods)
  })

  export default {
    data() {
      return {
        foods: _foods
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.scroll, {
          mouseWheel: true,
          scrollbar: {
            fade: false,
            interactive: true
          },
          probeType: 3
        })

        this.scroll.on('scrollStart', () => {
          console.log('scrollStart')
        })

        this.scroll.on('scroll', (pos) => {
          console.log('pos:', pos)
        })

        this.scroll.on('scrollEnd', () => {
          console.log('scrollEnd')
        })
//        this._appendFood()
      })
    },
    methods: {
      _appendFood() {
        if (this.foods.length < 100) {
          this.foods = this.foods.concat(_foods)
          setTimeout(this._appendFood, 5000)
        }
      }
    },
    components: {
      Scroll
    }
  }
</script>

<style lang="stylus">
  @import "~common/stylus/mixin.styl"

  .goods-list-render-view
    width: 100%
    height: 100%
    .scroll-wrapper
      position: absolute
      background-color: white
      top: 0
      left: 0
      width: 100%
      height: 100%
      overflow: hidden
      .scroll
        height: 100%
        .foods-wrapper
          .food-item
            display: flex
            margin: 18px
            padding-bottom: 18px
            border-bottom: 1px solid rgba(7, 17, 27, 0.1)
            &:last-child
              border-none()
              margin-bottom: 0
            .icon
              flex: 0 0 57px
              margin-right: 10px
            .content
              flex: 1
              .name
                margin: 2px 0 8px 0
                height: 14px
                line-height: 14px
                font-size: 14px
                color: rgb(7, 17, 27)
              .desc, .extra
                line-height: 10px
                font-size: 10px
                color: rgb(147, 153, 159)
              .desc
                line-height: 12px
                margin-bottom: 8px
              .extra
                .count
                  margin-right: 12px
              .price
                font-weight: 700
                line-height: 24px
                .now
                  margin-right: 8px
                  font-size: 14px
                  color: rgb(240, 20, 20)
                .old
                  text-decoration: line-through
                  font-size: 10px
                  color: rgb(147, 153, 159)
              .cartcontrol-wrapper
                position: absolute
                right: 0
                bottom: 12px
</style>
