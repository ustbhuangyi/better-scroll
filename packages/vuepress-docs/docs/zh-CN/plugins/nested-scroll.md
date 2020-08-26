# nested-scroll

## 介绍

协调 BetterScroll 双层嵌套的滚动行为。

::: warning
目前插件只解决双层嵌套问题，比如**竖向套竖向**、**横向套横向**。
:::

## 安装

```bash
npm install @better-scroll/nested-scroll --save

// or

yarn add @better-scroll/nested-scroll
```

## 使用

你需要首先引入 `nested-scroll` 插件，并通过全局方法 `BScroll.use()` 使用

```js
  import BScroll from '@better-scroll/core'
  import NestedScroll from '@better-scroll/nested-scroll'

  BScroll.use(NestedScroll)
```

上面步骤完成后，BScroll 的 `options` 中配置 `nestedScroll`。

```js
  // parent bs
  new BScroll('.outerWrapper', {
    nestedScroll: true
  })
  // child bs
  new BScroll('.innerWrapper', {
    nestedScroll: true
  })
```

## 示例

- 竖向双层嵌套

  <demo qrcode-url="nested-scroll/vertical">
    <template slot="code-template">
      <<< @/examples/vue/components/nested-scroll/vertical.vue?template
    </template>
    <template slot="code-script">
      <<< @/examples/vue/components/nested-scroll/vertical.vue?script
    </template>
    <template slot="code-style">
      <<< @/examples/vue/components/nested-scroll/vertical.vue?style
    </template>
    <nested-scroll-vertical slot="demo"></nested-scroll-vertical>
  </demo>

- 横向双层嵌套

  <demo qrcode-url="nested-scroll/horizontal">
    <template slot="code-template">
      <<< @/examples/vue/components/nested-scroll/horizontal.vue?template
    </template>
    <template slot="code-script">
      <<< @/examples/vue/components/nested-scroll/horizontal.vue?script
    </template>
    <template slot="code-style">
      <<< @/examples/vue/components/nested-scroll/horizontal.vue?style
    </template>
    <nested-scroll-horizontal slot="demo"></nested-scroll-horizontal>
  </demo>