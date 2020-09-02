# infinity

## 介绍

infinity 插件为 BetterScroll 提供了无限滚动的能力。如果有大量的列表数据需要渲染，可以使用 infinity 插件，此时 BetterScroll 只会渲染一定数量的 DOM 元素，从而使页面在大量数据时依然保持流畅滚动。

> 注意：除非你有大量的数据渲染需求，否则使用 core 即可。

## 安装

```shell
npm install @better-scroll/infinity --save

// or

yarn add @better-scroll/infinity
```

## 使用

首先引入 infinity 插件，并通过静态方法 `BScroll.use()` 初始化插件

```js
import BScroll from '@better-scroll/core'
import InfinityScroll from '@better-scroll/infinity'

BScroll.use(InfinityScroll)
```

然后，实例化 BetterScroll 时需要传入相关配置项 infinity:

```typescript
new BScroll('.bs-wrapper', {
  scrollY: true,
  infinity: {
    fetch(count) {
      // 获取大于 count 数量的数据，该函数是异步的，它需要返回一个 Promise。
      // case 1. resolve 数据数组Array<data>，来告诉 infinity 渲染数据，render 的第一个参数就是数据项
      // case 2. resolve(false), 来停止无限滚动
    }
    render(item, div?: HTMLElement) {
      // item 是 fetch 函数提供的每一个数据项，
      // div 是页面回收的 DOM，可能不存在
      // 如果 div 不存在，你需要创建一个新的 HTMLElement 元素
      // 必须返回一个 HTMLElement
    },
    createTombstone() {
      // 必须返回一个墓碑 DOM 节点。
    }
  }
})
```

::: danger 危险
`fetch`、`render`、`createTombstone` 必须按照注释来实现，否则内部会报错。
:::

## 示例

<demo qrcode-url="infinity/" :render-code="true">
  <template slot="code-template">
    <<< @/examples/vue/components/infinity/default.vue?template
  </template>
  <template slot="code-script">
    <<< @/examples/vue/components/infinity/default.vue?script
  </template>
  <template slot="code-style">
    <<< @/examples/vue/components/infinity/default.vue?style
  </template>
  <infinity-default slot="demo"></infinity-default>
</demo>