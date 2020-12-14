# zoom

## 介绍

zoom 插件为 BetterScroll 提供缩放功能。

## 安装

```bash
npm install @better-scroll/zoom --save

// or

yarn add @better-scroll/zoom
```

## 使用

为了开启缩放功能，你需要首先引入 zoom 插件，并通过静态方法 `BScroll.use()` 注册插件

```js
import BScroll from '@better-scroll/core'
import Zoom from '@better-scroll/zoom'

BScroll.use(Zoom)
```

上面步骤完成后，在 BetterScroll 的基础能力上扩展了缩放的功能，但是想要缩放真正生效，还需要在 `options` 中传入正确的配置：

```js
new BScroll('.bs-wrapper', {
  freeScroll: true,
  scrollX: true,
  scrollY: true,
  zoom: {
    start: 1,
    min: 0.5,
    max: 2
  }
})
```

以下是 zoom 插件专属以及[ BetterScroll 的配置](../guide/base-scroll-options.html)：

- **zoom<插件专属>**

  开启 zoom 功能。若没有该项，则插件不会生效。该配置同时也是用来设置 zoom 特性的相关配置，具体请参考[ zoom 选项对象](./zoom.html#zoom-选项对象)。

- **freeScroll**

  如果希望当放大之后，当前区域在 x 和 y 轴方向都可以滚动时，必须设置为 `true`。同时需要设置 scrollX 和 scrollY 均为 true。

- **scrollX**

  如果希望当放大之后，当前区域在 x 轴方向可以滚动时，必须设置为 `true`。

- **scrollY**

  如果希望当放大之后，当前区域在 y 轴方向可以滚动时，必须设置为 `true`。

## 示例

  :::warning
  zoom 暂不支持在 pc 端的交互操作，下方 demo 请扫码体验。
  :::

  <demo qrcode-url="zoom/default" :render-code="true">
    <template slot="code-template">
      <<< @/examples/vue/components/zoom/default.vue?template
    </template>
    <template slot="code-script">
      <<< @/examples/vue/components/zoom/default.vue?script
    </template>
    <template slot="code-style">
      <<< @/examples/vue/components/zoom/default.vue?style
    </template>
    <zoom-default slot="demo"></zoom-default>
  </demo>

## zoom 选项对象

### start
  - **类型**：`number`
  - **默认值**：`1`

    初始缩放比例。

### min
  - **类型**：`number`
  - **默认值**：`1`

    最小缩放比例。

### max
  - **类型**：`number`
  - **默认值**：`4`

    最大缩放比例。

### initialOrigin
  - **类型**：`[OriginX, OriginY]`
    - **OriginX**：`number | 'left' | 'right' | 'center'`
    - **OriginY**：`number | 'top' | 'bottom' | 'center'`
  - **默认值**：`[0, 0]`

    初始化 zoom 插件的缩放原点，当 `start` 不为 `1` 的时候有效，缩放原点都是以`缩放元素`为坐标系。

  - **示例**

  ```js
    new BScroll('.bs-wrapper', {
      // ... 其他配置项
      zoom: {
        initialOrigin: [50, 50], // 基于缩放元素的左顶点上下偏移量都是 50 px
        initialOrigin: [0, 0], // 基于缩放元素的左顶点
        initialOrigin: ['left', 'top'], // 与上面效果相同
        initialOrigin: ['center', 'center'], // 基于缩放元素的中心
        initialOrigin: ['right', 'top'], // 基于缩放元素的右顶点
      }
    })
  ```

  往往你初始化 zoom 的时候只专注于以端点或者中心进行缩放，可以参考以上示例。

### minimalZoomDistance
  - **类型**：`number`
  - **默认值**：`5`

    当你双指进行缩放操作的时候，只有当缩放的距离超过 `minimalZoomDistance`，zoom 才生效。

### bounceTime
  - **类型**：`number`
  - **默认值**：`800`(毫秒)

    双指不断进行缩放操作并且 scale 超过 `max` 阈值的时候，当双指离开的时候，内部会「回弹」至 `max` 的形态，而 `bounceTime` 就是这次「回弹」行为的动画时长。

## 实例方法

### zoomTo(scale, x, y, [bounceTime])
  - **参数**
    - `{number} scale`： 缩放比例
    - `{OriginX} x`： 缩放原点的 x 坐标，相当于**缩放元素**的左顶点
      - `OriginX：'number | 'left' | 'right' | 'center'`
    - `{OriginY} y`： 缩放原点的 y 坐标，相当于**缩放元素**的左顶点
      - `OriginY：'number | 'top' | 'bottom' | 'center'`
    - `{number} [bounceTime]<可选>：一次缩放行为的动画时长`

    以 `[x, y]` 坐标作为原点对元素进行缩放。x 与 y 不仅可以是数字，也可以是对应的字符串，因为一般的场景都是基于端点或者中心进行缩放。

  - **示例**

  ```js
  const bs = new BScroll('.bs-wrapper', {
    freeScroll: true,
    scrollX: true,
    scrollY: true,
    zoom: {
      start: 1,
      min: 0.5,
      max: 2
    }
  })

  bs.zoomTo(1.8, 'left', 'bottom') // 基于缩放元素的左底点缩放至 1.8 倍
  bs.zoomTo(1.8, 'left', 'bottom', 1000) // 基于缩放元素的左底点缩放，动画时长为 1s
  bs.zoomTo(1.8, 100, 100) // 基于缩放元素左顶点的上下偏移量 100 为原点进行缩放
  bs.zoomTo(2, 'center', 'center') // 基于缩放元素的中心进行缩放
  ```

## 事件

### beforeZoomStart

  - **参数**：无
  - **触发时机**：双指接触缩放元素时，不包括直接调用 zoomTo 方法

### zoomStart

  - **参数**：无
  - **触发时机**：双指缩放距离超过最小阈值 `minimalZoomDistance`，缩放即将开始。不包括直接调用 zoomTo 方法

### zooming

  - **参数**：`{ scale }`
  - **类型**：`{ scale: number }`
  - **触发时机**：双指缩放行为正在进行时或者直接调用 zoomTo 进行缩放的过程

  - **示例**：
  ```js
    const bs = new BScroll('.bs-wrapper', {
      freeScroll: true,
      scrollX: true,
      scrollY: true,
      zoom: {
        start: 1,
        min: 0.5,
        max: 2
      }
    })

    bs.on('zooming', ({ scale }) => {
      // use scale
      console.log(scale) // 当前 scale 的值
    })
  ```

### zoomEnd

  - **参数**：`{ scale }`
  - **类型**：`{ scale: number }`
  - **触发时机**：双指缩放行为结束后（如果有回弹，触发时机在回弹动画结束之后）或者调用 zoomTo 完成缩放之后

  :::warning
  在 zoom 的场景下，你应该监听 zoomStart、zooming、zoomEnd 等等事件，而不是更底层的 scroll、scrollEnd 事件，要不然可能与你的预期不符。
  :::