# mouse-wheel

mouseWheel 扩展 BetterScroll 鼠标滚轮的能力。

# 安装

```bash
npm install @better-scroll/mouse-wheel --save

// or

yarn add @better-scroll/mouse-wheel
```

:::tip
目前支持鼠标滚轮有：core、slide、wheel、pullup、pulldown
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

- **纵向普通滚动示例**

  <demo :hide-qrcode="true" render-code="true">
    <template slot="code-template">
      <<< @/examples/vue/components/mouse-wheel/vertical-scroll.vue?template
    </template>
    <template slot="code-script">
      <<< @/examples/vue/components/mouse-wheel/vertical-scroll.vue?script
    </template>
    <template slot="code-style">
      <<< @/examples/vue/components/mouse-wheel/vertical-scroll.vue?style
    </template>
    <mouse-wheel-vertical-scroll slot="demo"></mouse-wheel-vertical-scroll>
  </demo>

- **横向普通滚动示例**

  <demo :hide-qrcode="true">
    <template slot="code-template">
      <<< @/examples/vue/components/mouse-wheel/horizontal-scroll.vue?template
    </template>
    <template slot="code-script">
      <<< @/examples/vue/components/mouse-wheel/horizontal-scroll.vue?script
    </template>
    <template slot="code-style">
      <<< @/examples/vue/components/mouse-wheel/horizontal-scroll.vue?style
    </template>
    <mouse-wheel-horizontal-scroll slot="demo"></mouse-wheel-horizontal-scroll>
  </demo>

## 进阶使用

mouseWheel 插件还可以搭配其他的插件，为其增加鼠标滚轮的操作。

- **mouseWheel & slide**

  通过鼠标滚轮操作 [slide](./slide.html)。

  - **横向 slide 示例**

    <demo :hide-qrcode="true">
      <template slot="code-template">
        <<< @/examples/vue/components/mouse-wheel/horizontal-slide.vue?template
      </template>
      <template slot="code-script">
        <<< @/examples/vue/components/mouse-wheel/horizontal-slide.vue?script
      </template>
      <template slot="code-style">
        <<< @/examples/vue/components/mouse-wheel/horizontal-slide.vue?style
      </template>
      <mouse-wheel-horizontal-slide slot="demo"></mouse-wheel-horizontal-slide>
    </demo>

  - **纵向 slide 示例**

    <demo :hide-qrcode="true">
      <template slot="code-template">
        <<< @/examples/vue/components/mouse-wheel/vertical-slide.vue?template
      </template>
      <template slot="code-script">
        <<< @/examples/vue/components/mouse-wheel/vertical-slide.vue?script
      </template>
      <template slot="code-style">
        <<< @/examples/vue/components/mouse-wheel/vertical-slide.vue?style
      </template>
      <mouse-wheel-vertical-slide slot="demo"></mouse-wheel-vertical-slide>
    </demo>

- **mouseWheel & pullup**

  通过鼠标触发上拉加载 [pullup](./pullup.html)。

  <demo :hide-qrcode="true">
    <template slot="code-template">
      <<< @/examples/vue/components/mouse-wheel/pullup.vue?template
    </template>
    <template slot="code-script">
      <<< @/examples/vue/components/mouse-wheel/pullup.vue?script
    </template>
    <template slot="code-style">
      <<< @/examples/vue/components/mouse-wheel/pullup.vue?style
    </template>
    <mouse-wheel-pullup slot="demo"></mouse-wheel-pullup>
  </demo>

- **mouseWheel & pulldown**

  通过鼠标触发下拉加载 [pulldown](./pulldown.html)。

  <demo :hide-qrcode="true">
    <template slot="code-template">
      <<< @/examples/vue/components/mouse-wheel/pulldown.vue?template
    </template>
    <template slot="code-script">
      <<< @/examples/vue/components/mouse-wheel/pulldown.vue?script
    </template>
    <template slot="code-style">
      <<< @/examples/vue/components/mouse-wheel/pulldown.vue?style
    </template>
    <mouse-wheel-pulldown slot="demo"></mouse-wheel-pulldown>
  </demo>

- **mouseWheel & wheel**

  通过鼠标触发 [wheel](./wheel.html)。

  <demo :hide-qrcode="true">
    <template slot="code-template">
      <<< @/examples/vue/components/mouse-wheel/picker.vue?template
    </template>
    <template slot="code-script">
      <<< @/examples/vue/components/mouse-wheel/picker.vue?script
    </template>
    <template slot="code-style">
      <<< @/examples/vue/components/mouse-wheel/picker.vue?style
    </template>
    <mouse-wheel-picker slot="demo"></mouse-wheel-picker>
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
  - **默认值**： `300`(ms)

  滚动动画的缓动时长。

### discreteTime

  - **类型**：`number`
  - **默认值**： `400`(ms)

  由于滚轮滚动是一种离散的运动，并没有 start、move、end 的事件类型，因此只要在 discreteTime 时间内没有探测到滚动，那么一次的滚轮动作就结束了。

  ::: warning 注意
  当搭配 [pulldown](./pulldown.html) 插件的时候，`easeTime` 和 `discreteTime` 会被内部修改成合理的固定值，以便触发 `pullingDown` 钩子
  :::

### throttleTime

  - **类型**：`number`
  - **默认值**： `0`(ms)

  由于滚轮滚动是高频率的动作，因此可以通过 throttleTime 来限制触发频率，mouseWheel 内部会缓存滚动的距离，并且每隔 throttleTime 会计算缓存的距离并且滚动。

  > 修改 throttleTime 可能会造成滚动动画不连贯，请根据实际场景进行调整。

### dampingFactor

  - **类型**：`number`
  - **默认值**： `0.1`

  阻尼因子，值的范围是[0, 1]，当 BetterScroll 滚出边界的时候，需要施加阻力，防止滚动幅度过大，值越小，阻力越大。

## 钩子

### alterOptions

  - **参数**：`MouseWheelConfig`
    ```typescript
    export interface MouseWheelConfig {
      speed: number
      invert: boolean
      easeTime: number
      discreteTime: number
      throttleTime: number,
      dampingFactor: number
    }
    ```
  - **触发时机**：滚轮滚动开始

  允许修改 options 来控制滚动中的某些行为。

## 事件

### mousewheelStart

  - **参数**：无
  - **触发时机**：滚轮滚动开始。

### mousewheelMove

  - **参数**： `{ x, y }`
  - `{ number } x`：当前 BetterScroll 的横向滚动位置
  - `{ number } y`：当前 BetterScroll 的纵向滚动位置
  - **类型**： `{ x: number, y: number }`
  - **触发时机**：滚轮滚动中

### mousewheelEnd

  - **参数**：`delta`
  - **类型**： `WheelDelta`
  ```typescript
    interface WheelDelta {
      x: number
      y: number
      directionX: Direction
      directionY: Direction
    }
  ```
  - **触发时机**：discreteTime 之后如果还没有触发 mousewheel 事件，那么便结算一次滚轮滚动行为。

  ::: danger 警告
  由于 mousewheel 事件的特殊性，mousewheelEnd 派发并不代表滚动动画结束。
  :::


::: tip 提示
在绝大多数的场景下，如果你想要精确的知道当前 BetterScroll 的滚动位置，请监听 scroll、scrollEnd 钩子，而不是 `mouseXXX` 钩子。
:::