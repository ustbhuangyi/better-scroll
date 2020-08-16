# mouse-wheel

mouseWheel 扩展 BetterScroll 鼠标滚轮的能力。

# 安装

```bash
npm install @better-scroll/mouse-wheel@next --save

// or

yarn add @better-scroll/mouse-wheel@next
```

:::tip
目前支持鼠标滚轮有：core、slide、wheel
:::

## 基础使用

为了开启鼠标滚动功能，你需要首先引入 mouseWheel 插件，通过静态方法 `BScroll.use()` 注册插件，最后传入正确的 [mouseWheel 选项对象](./mouse-wheel.html#mousewheel-选项对象)

```js
import BScroll from '@better-scroll/core'
import MouseWheel from '@better-scroll/mouse-wheel'
BScroll.use(MouseWheel)

new BScroll('.bs-wrapper', {
  //...
  mouseWheel: {
    speed: 20,
    invert: false,
    easeTime: 300
  }
})
```

- **示例**

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

## 进阶使用

mouseWheel 插件还可以搭配其他的插件，为其增加鼠标滚轮的操作。

- **mouseWheel & slide**

  通过鼠标滚轮操作 [slide](./slide.html)。

  ```js
    import BScroll from '@better-scroll/core'
    import MouseWheel from '@better-scroll/mouse-wheel'
    import Slide from '@better-scroll/slide'

    BScroll.use(MouseWheel)
    BScroll.use(Slide)

    new BScroll('.bs-wrapper', {
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

  - **示例**
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

## mouseWheel 选项对象

### speed

- **类型**：`number`
- **默认值**：`20`

  鼠标滚轮滚动的速度。

### invert

- **类型**：`boolean`
- **默认值**：`false`

  当该值为 true 时，表示滚轮滚动和 BetterScroll 滚动的方向相反。

### easeTime

- **类型**：`number`
- **默认值**: `300`(ms)

  滚动动画的缓动时长。

### discreteTime

- **类型**：`number`
- **默认值**: `400`(ms)

  由于滚轮滚动是一种离散的运动，并没有 start、move、end 的事件类型，因此只要在 discreteTime 时间内没有探测到滚动，那么一次的滚轮动作就结束了。

### throttleTime

- **类型**：`number`
- **默认值**: `0`(ms)

  由于滚轮滚动是高频率的动作，因此可以通过 throttleTime 来限制触发频率，mouseWheel 内部会缓存滚动的距离，并且每隔 throttleTime 会计算缓存的距离并且滚动。

  > 修改 throttleTime 可能会造成滚动动画不连贯，请根据实际场景进行调整。