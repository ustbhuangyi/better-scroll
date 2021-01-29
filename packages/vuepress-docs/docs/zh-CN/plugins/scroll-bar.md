# scrollbar

## 介绍

scrollbar 插件为 BetterScroll 提供了样式美观的滚动条。

:::tip 提示
从 v2.1.5 开始，用户可以提供自定义的滚动条。
:::

## 安装

```bash
npm install @better-scroll/scroll-bar --save

// or

yarn add @better-scroll/scroll-bar
```

## 使用

首先引入 scrollbar 插件，并通过静态方法 `BScroll.use()` 注册插件

```js
  import BScroll from '@better-scroll/core'
  import ScrollBar from '@better-scroll/scroll-bar'

  BScroll.use(ScrollBar)
```

接着在 `options` 传入正确的配置。

```js
  new BScroll('.bs-wrapper', {
    scrollY: true,
    scrollbar: true
  })
```
## 示例

  - **竖向滚动条**

    <demo qrcode-url="scrollbar/vertical" :render-code="true">
      <template slot="code-template">
        <<< @/examples/vue/components/scrollbar/vertical.vue?template
      </template>
      <template slot="code-script">
        <<< @/examples/vue/components/scrollbar/vertical.vue?script
      </template>
      <template slot="code-style">
        <<< @/examples/vue/components/scrollbar/vertical.vue?style
      </template>
      <scrollbar-vertical slot="demo"></scrollbar-vertical>
    </demo>

  - **横向滚动条**

    <demo qrcode-url="scrollbar/horizontal" :render-code="true">
      <template slot="code-template">
        <<< @/examples/vue/components/scrollbar/horizontal.vue?template
      </template>
      <template slot="code-script">
        <<< @/examples/vue/components/scrollbar/horizontal.vue?script
      </template>
      <template slot="code-style">
        <<< @/examples/vue/components/scrollbar/horizontal.vue?style
      </template>
      <scrollbar-horizontal slot="demo"></scrollbar-horizontal>
    </demo>

  - **用户定制化滚动条**

    <demo qrcode-url="scrollbar/custom" :render-code="true">
      <template slot="code-template">
        <<< @/examples/vue/components/scrollbar/custom.vue?template
      </template>
      <template slot="code-script">
        <<< @/examples/vue/components/scrollbar/custom.vue?script
      </template>
      <template slot="code-style">
        <<< @/examples/vue/components/scrollbar/custom.vue?style
      </template>
      <scrollbar-custom slot="demo"></scrollbar-custom>
    </demo>

  - **搭配鼠标滚轮**

    <demo qrcode-url="scrollbar/mousewheel" :render-code="true">
      <template slot="code-template">
        <<< @/examples/vue/components/scrollbar/mousewheel.vue?template
      </template>
      <template slot="code-script">
        <<< @/examples/vue/components/scrollbar/mousewheel.vue?script
      </template>
      <template slot="code-style">
        <<< @/examples/vue/components/scrollbar/mousewheel.vue?style
      </template>
      <scrollbar-mousewheel slot="demo"></scrollbar-mousewheel>
    </demo>

## scrollbar 选项对象

### fade

  - **类型**：`boolean`
  - **默认值**：`true`

  当滚动停止的时候，滚动条渐隐。

### interactive

  - **类型**：`boolean`
  - **默认值**：`false`

  滚动条是否可以交互。

### customElements <Badge text="2.1.5" />

  - **类型**：`HTMLElement[]`
  - **默认值**：`[]`

  用户提供自定义的滚动条。

  ```js
  // 横向滚动条
  const horizontalEl = document.getElementById('用户自定义的滚动条')
  new BScroll('.bs-wrapper', {
    scrollY: true,
    scrollbar: {
      customElements: [horizontalEl]
    }
  })
  // 竖向滚动条
  const verticalEl = document.getElementById('用户自定义的滚动条')
  new BScroll('.bs-wrapper', {
    scrollY: false,
    scrollX: true,
    scrollbar: {
      customElements: [verticalEl]
    }
  })
  // 双向滚动条
  const horizontalEl = document.getElementById('用户自定义的滚动条')
  const verticalEl = document.getElementById('用户自定义的滚动条')
  new BScroll('.bs-wrapper', {
    freeScroll: true,
    scrollbar: {
      // 当滚动条是 2 个的时候，数组第一个元素是横向滚动条
      customElements: [horizontalEl, verticalEl]
    }
  })
  ```

### minSize <Badge text="2.1.5" />

  - **类型**：`number`
  - **默认值**：`8`

  滚动条的最小尺寸，当用户提供了自定义的滚动条，该配置无效。

### scrollbarTrackClickable <Badge text="2.1.5" />

  - **类型**：`boolean`
  - **默认值**：`false`

  滚动条轨道是否允许点击。

  **注意**：当开启该配置的时候，请保证 BetterScroll Options 的 `click` 为 true，否则无法触发点击事件。[详细原因在这](../FAQ/diagnosis.html#【问题四】为什么-betterscroll-content-内部的所有的-click-事件的侦听器都不触发？)

  ```js
  new BScroll('.bs-wrapper', {
    scrollY: true,
    click: true // 必不可少
    scrollbar: {
      scrollbarTrackClickable: true
    }
  })
  ```

### scrollbarTrackOffsetType <Badge text="2.1.5" />

  - **类型**：`string`
  - **默认值**：`'step'`

  滚动条轨道被点击之后，滚动距离的计算方式，默认与浏览器的表现形式一样，可以配置为 `'clickedPoint'`，代表滚动条滚动至点击的位置。

### scrollbarTrackOffsetTime <Badge text="2.1.5" />

  - **类型**：`number`
  - **默认值**：`300`

  滚动条轨道被点击之后，滚动位移的时间

:::tip 提示
当 scrollbar 配置为 true 的时候，插件内部使用的是默认的插件选项对象。

```js
const bs = new BScroll('.wrapper', {
  scrollbar: true
})

// 相当于

const bs = new BScroll('.wrapper', {
  scrollbar: {
    fade: true,
    interactive: false,
    // 以下配置项 v2.1.2 才支持
    customElements: [],
    minSize: 8,
    scrollbarTrackClickable: false,
    scrollbarTrackOffsetType: 'step',
    scrollbarTrackOffsetTime: 300
  }
})
```
:::