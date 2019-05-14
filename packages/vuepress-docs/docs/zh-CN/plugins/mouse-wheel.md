# mouse-wheel

这个插件可以为核心滚动和一些插件增加对 PC 场景下的鼠标滚轮操作。

:::tip
目前支持鼠标滚轮有：核心滚动、slide、wheel
:::

# 使用

- 为核心滚动增加鼠标滚轮的支持

  ```js
    import BScroll from '@better-scroll/core'
    import MouseWheel from '@better-scroll/mouse-wheel'
    BScroll.use(MouseWheel)

    new BScroll('.bs-wrap', {
      //...
      mouseWheel: {
        speed: 20,
        invert: false,
        easeTime: 300
      }
    })
  ```

- 为其他插件增加鼠标滚轮行为时，你需要同时使用对应的插件和 mouse-wheel 插件

  ```js
    import BScroll from '@better-scroll/core'
    import MouseWheel from '@better-scroll/mouse-wheel'
    import Slide from '@better-scroll/slide'

    BScroll.use(MouseWheel)
    BScroll.use(Slide)

    new BScroll('.bs-wrap', {
      scrollX: true,
      scrollY: false,
      slide: {
        loop: true,
        threshold: 100
      },
      momentum: false,
      bounce: false,
      stopPropagation: true,
      mouseWheel: {
        speed: 20,
        invert: false,
        easeTime: 300
      }
    })
  ```

## 示例

- 核心滚动的鼠标滚轮

  <demo :hide-qrcode="true">
    <template slot="code-template">
      <<< @/examples/vue/components/core/mouse-wheel.vue?template
    </template>
    <template slot="code-script">
      <<< @/examples/vue/components/core/mouse-wheel.vue?script
    </template>
    <template slot="code-style">
      <<< @/examples/vue/components/core/mouse-wheel.vue?style
    </template>
    <core-mouse-wheel slot="demo"></core-mouse-wheel>
  </demo>

- wheel 的鼠标滚轮

- slide 的鼠标滚轮

  <demo :hide-qrcode="true">
    <template slot="code-template">
      <<< @/examples/vue/components/slide/pc.vue?template
    </template>
    <template slot="code-script">
      <<< @/examples/vue/components/slide/pc.vue?script
    </template>
    <template slot="code-style">
      <<< @/examples/vue/components/slide/pc.vue?style
    </template>
    <slide-pc slot="demo"></slide-pc>
  </demo>

## 配置

### speed

鼠标滚轮滚动的速度。

- 类型：number
- 默认值：20

### invert

当该值为 true 时，表示滚轮滚动和 slide 滚动的方向相反。

- 类型：boolean
- 默认值：false

### easeTime

滚动动画的缓动时长。单位为毫秒。

- 类型：number
- 默认值: 300
