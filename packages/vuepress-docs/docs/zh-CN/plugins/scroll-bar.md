# scrollbar

## 介绍

  scrollbar 插件为 BetterScroll 提供了样式美观的滚动条。

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

<demo qrcode-url="scrollbar/default" :render-code="true">
  <template slot="code-template">
    <<< @/examples/vue/components/scrollbar/default.vue?template
  </template>
  <template slot="code-script">
    <<< @/examples/vue/components/scrollbar/default.vue?script
  </template>
  <template slot="code-style">
    <<< @/examples/vue/components/scrollbar/default.vue?style
  </template>
  <scrollbar-default slot="demo"></scrollbar-default>
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
